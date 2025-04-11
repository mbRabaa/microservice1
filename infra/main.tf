# 1. Namespace dédié
resource "kubernetes_namespace" "microservice" {
  metadata {
    name = "microservice"
    labels = {
      env     = "production"
      managed = "terraform"
    }
  }
}

# 2. Configuration de l'application
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    "app_config.yml" = <<-EOT
      logging:
        level: INFO
      server:
        port: 8080
        health_check_path: /health
        readiness_path: /ready
    EOT
  }
}

# 3. Secrets de la base de données
resource "kubernetes_secret" "db_creds" {
  metadata {
    name      = "database-credentials"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    db_host     = base64encode("postgres-service.microservice.svc.cluster.local")
    db_password = base64encode(var.db_password)
    db_user     = base64encode("app_user")
  }

  type = "Opaque"
}

# 4. Déploiement principal (version optimisée)
resource "kubernetes_deployment" "app" {
  metadata {
    name      = "gestion-trajet-deployment"
    namespace = kubernetes_namespace.microservice.metadata[0].name
    labels = {
      app     = "gestion-trajet"
      version = var.image_tag
    }
  }

  spec {
    replicas = var.replica_count

    strategy {
      type = "RollingUpdate"
      rolling_update {
        max_surge       = 1
        max_unavailable = 0
      }
    }

    selector {
      match_labels = {
        app = "gestion-trajet"
      }
    }

    template {
      metadata {
        labels = {
          app     = "gestion-trajet"
          monitor = "true"
        }
        annotations = {
          "prometheus.io/scrape" = "true"
          "prometheus.io/port"   = "8080"
          "prometheus.io/path"   = "/metrics"
        }
      }

      spec {
        container {
          name  = "app-container"
          image = "${var.docker_username}/gestion-trajet:${var.image_tag}"
          image_pull_policy = "IfNotPresent"
          
          port {
            name           = "http"
            container_port = 8080
          }

          env {
            name  = "PORT"
            value = "8080"
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.db_creds.metadata[0].name
            }
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 8080
            }
            initial_delay_seconds = 45  # Augmenté pour les applications lentes
            period_seconds        = 10
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/ready"  # Endpoint distinct pour readiness
              port = 8080
            }
            initial_delay_seconds = 5
            period_seconds        = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          startup_probe {
            http_get {
              path = "/health"
              port = 8080
            }
            failure_threshold = 30  # 30 tentatives
            period_seconds    = 5   # Intervalle de 5s
          }
        }
      }
    }
  }
}

# 5. Service d'exposition
resource "kubernetes_service" "app" {
  metadata {
    name      = "gestion-trajet-service"
    namespace = kubernetes_namespace.microservice.metadata[0].name
    annotations = {
      "metallb.universe.tf/address-pool" = "default"
    }
  }

  spec {
    selector = {
      app = "gestion-trajet"
    }

    port {
      name        = "http"
      port        = 80
      target_port = 8080
      protocol    = "TCP"
    }

    type = "LoadBalancer"
  }
}

# 6. Autoscaling Horizontal (optionnel)
resource "kubernetes_horizontal_pod_autoscaler" "app" {
  metadata {
    name      = "gestion-trajet-hpa"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  spec {
    min_replicas = 1
    max_replicas = 5
    target_cpu_utilization_percentage = 80

    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.app.metadata[0].name
    }
  }
}