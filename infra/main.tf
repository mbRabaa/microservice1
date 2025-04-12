
resource "kubernetes_namespace" "microservice" {
  metadata {
    name = "microservice"
    labels = {
      env     = "production"
      managed = "terraform"
    }
  }
}

resource "helm_release" "postgresql" {
  name      = "postgresql"
  chart     = "./postgresql-16.6.3.tgz" # Chemin local garantissant le téléchargement
  namespace = kubernetes_namespace.microservice.metadata[0].name
  
  # Configuration via values.yaml intégré
  values = [
    <<-EOT
    auth:
      database: gestion_trajet_db
      username: tunisbus
      password: "0000"
    primary:
      persistence:
        enabled: true
        size: 8Gi
      resources:
        requests:
          memory: "256Mi"
          cpu: "250m"
    EOT
  ]

  lifecycle {
    create_before_destroy = true
  }

  timeout = 900 # 15 minutes pour les clusters lents
}

resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    "application.yml" = <<-EOT
    spring:
      datasource:
        url: jdbc:postgresql://${helm_release.postgresql.name}.${kubernetes_namespace.microservice.metadata[0].name}.svc.cluster.local:5432/${var.db_name}
        username: ${var.db_user}
        password: ${var.db_password}
    server:
      port: 8080
    EOT
  }
}

resource "kubernetes_secret" "db_creds" {
  metadata {
    name      = "database-credentials"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    db_host     = "${helm_release.postgresql.name}.${kubernetes_namespace.microservice.metadata[0].name}.svc.cluster.local"
    db_name     = var.db_name
    db_user     = var.db_user
    db_password = var.db_password
  }

  type = "Opaque"
}

resource "kubernetes_deployment" "app" {
  metadata {
    name      = "gestion-trajet-deployment"
    namespace = kubernetes_namespace.microservice.metadata[0].name
    labels = {
      app = "gestion-trajet"
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
          app = "gestion-trajet"
        }
      }

      spec {
        init_container {
          name    = "wait-for-db"
          image   = "busybox:1.28"
          command = ["sh", "-c", "until nc -z ${helm_release.postgresql.name} 5432; do sleep 2; done"]
        }

        container {
          name  = "app"
          image = "${var.docker_registry}/${var.docker_image}:${var.image_tag}"
          port {
            container_port = 8080
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }

          resources {
            requests = {
              cpu    = "200m"
              memory = "256Mi"
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
            initial_delay_seconds = 30
            period_seconds        = 10
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "app" {
  metadata {
    name      = "gestion-trajet-service"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  spec {
    selector = {
      app = "gestion-trajet"
    }

    port {
      port        = 80
      target_port = 8080
    }

    type = "LoadBalancer"
  }
}

