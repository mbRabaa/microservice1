# Variables d'entrée
variable "docker_username" {
  description = "Nom d'utilisateur Docker Hub"
  type        = string
}

variable "db_password" {
  description = "Mot de passe de la base de données"
  type        = string
  sensitive   = true
}

variable "image_tag" {
  description = "Tag de l'image Docker"
  type        = string
  default     = "latest"
}

variable "replica_count" {
  description = "Nombre de réplicas pour le déploiement"
  type        = number
  default     = 3
}

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
    name      = "gestion-trajet-deployment"  # Nom modifié pour cohérence
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
          "prometheus.io/port"   = "80"
          "prometheus.io/path"   = "/metrics"  # Ajouté pour la métrique
        }
      }

      spec {
        container {
          name  = "app-container"  # Nom simplifié
          image = "${var.docker_username}/gestion-trajet:${var.image_tag}"
          
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

          liveness_probe {
            http_get {
              path = "/healthz"  # Endpoint de santé standard
              port = 80
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/ready"  # Endpoint de readiness
              port = 80
            }
            initial_delay_seconds = 5
            period_seconds        = 5
            timeout_seconds       = 5
            success_threshold     = 1
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

          # Ajout de variables d'environnement supplémentaires
          env {
            name  = "PORT"
            value = "80"
          }
        }

        # Ajout de tolerations et nodeSelector pour le scheduling
        toleration {
          key      = "CriticalAddonsOnly"
          operator = "Exists"
          effect   = "NoSchedule"
        }

        node_selector = {
          "kubernetes.io/arch" = "amd64"  # Spécification d'architecture
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
      "prometheus.io/scrape"             = "true"  # Pour le monitoring
    }
  }

  spec {
    selector = {
      app = "gestion-trajet"
    }

    port {
      name        = "http"
      port        = 80
      target_port = 80
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
    db_host     = base64encode("postgres-service.microservice.svc.cluster.local")  # FQDN complet
    db_password = base64encode(var.db_password)
    db_user     = base64encode("app_user")  # Ajout d'un utilisateur par défaut
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
      server:
        port: 80
        health_check_path: /healthz
        readiness_path: /ready
    EOT
  }
}

# 6. Auto-scaling horizontal
resource "kubernetes_horizontal_pod_autoscaler" "app" {
  metadata {
    name      = "gestion-trajet-hpa"
    namespace = kubernetes_namespace.microservice.metadata[0].name
    labels = {
      app = "gestion-trajet"  # Ajout de labels pour cohérence
    }
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

# 7. Sorties utiles
output "service_url" {
  value = "http://${kubernetes_service.app.status.0.load_balancer.0.ingress.0.ip}:80"
}

output "deployment_name" {
  value = kubernetes_deployment.app.metadata[0].name
}

output "namespace" {
  value = kubernetes_namespace.microservice.metadata[0].name
}