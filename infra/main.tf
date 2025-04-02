# 1. Création d'un namespace dédié
resource "kubernetes_namespace" "microservice" {
  metadata {
    name = "microservice"
    labels = {
      env     = "production"
      managed = "terraform"
    }
  }
}

# 2. Déploiement de l'application
resource "kubernetes_deployment" "app" {
  metadata {
    name      = "microservice1-deployment"
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
          "prometheus.io/port"   = "80"  # Changé à 80 pour Nginx
        }
      }

      spec {
        container {
          name  = "app-microservice1"
          image = "${var.docker_username}/gestion-trajet:${var.image_tag}"
          
          # Port modifié à 80 pour Nginx
          port {
            name           = "http"
            container_port = 80
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

          # Probes adaptées pour Nginx
          liveness_probe {
            http_get {
              path = "/"  # Utilise la racine au lieu de /health
              port = 80
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
          }

          readiness_probe {
            http_get {
              path = "/"  # Utilise la racine au lieu de /ready
              port = 80
            }
            initial_delay_seconds = 5
            period_seconds        = 5
            timeout_seconds       = 5
          }

          env {
            name  = "APP_ENV"
            value = "production"
          }
          
          env {
            name = "DB_HOST"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.db_creds.metadata[0].name
                key  = "db_host"
              }
            }
          }
        }

        toleration {
          key      = "CriticalAddonsOnly"
          operator = "Exists"
          effect   = "NoSchedule"
        }
      }
    }
  }
}

# 3. Service pour exposer l'application
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
      target_port = 80  # Changé à 80 pour Nginx
      protocol    = "TCP"
    }

    type = "LoadBalancer"
  }
}

# 4. Secret pour les informations sensibles
resource "kubernetes_secret" "db_creds" {
  metadata {
    name      = "database-credentials"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    db_host     = base64encode("postgres-service")
    db_password = base64encode(var.db_password)
  }

  type = "Opaque"
}

# 5. ConfigMap pour la configuration
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    "app_config.yml" = <<-EOT
      logging:
        level: INFO
      features:
        cache_enabled: true
    EOT
  }
}

# 6. Auto-scaling horizontal (optionnel)
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