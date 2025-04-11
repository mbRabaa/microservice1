# Configuration Terraform
terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.23.0"
    }
  }
}

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
  description = "Nombre de réplicas initiaux"
  type        = number
  default     = 1
}

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

# 2. Configuration de l'application (optimisé)
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    "application.yml" = yamlencode({
      logging = {
        level = "INFO"
      }
      server = {
        port              = 8080
        health_check_path = "/health"
        readiness_path    = "/ready"
      }
      database = {
        host = "postgres-service.microservice.svc.cluster.local"
        user = "app_user"
      }
    })
  }
}

# 3. Secrets de la base de données (sécurisé)
resource "kubernetes_secret" "db_creds" {
  metadata {
    name      = "database-credentials"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  data = {
    DB_PASSWORD = var.db_password
    DB_HOST     = base64encode("postgres-service.microservice.svc.cluster.local")
    DB_USER     = base64encode("app_user")
  }

  type = "Opaque"
}

# 4. Déploiement principal (version robuste)
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
        max_surge       = "25%"
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
        # Ajout d'un ServiceAccount pour de meilleures pratiques
        service_account_name = kubernetes_service_account.app.metadata[0].name
        
        container {
          name  = "app-container"
          image = "${var.docker_username}/gestion-trajet:${var.image_tag}"
          image_pull_policy = "IfNotPresent"
          
          ports {
            container_port = 8080
            name           = "http"
            protocol       = "TCP"
          }

          env {
            name = "NODE_ENV"
            value = "production"
          }

          env {
            name = "PORT"
            value = "8080"
          }

          # Chargement sécurisé des variables
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

          # Probes optimisées
          liveness_probe {
            http_get {
              path = "/health"
              port = 8080
            }
            initial_delay_seconds = 60  # Délai augmenté
            period_seconds        = 10
            timeout_seconds       = 3
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = 8080
            }
            initial_delay_seconds = 20  # Délai augmenté
            period_seconds        = 5
            timeout_seconds       = 3
            failure_threshold     = 3
          }

          startup_probe {
            http_get {
              path = "/health"
              port = 8080
            }
            failure_threshold = 30  # 30 * 5s = 150s max
            period_seconds    = 5
          }

          # Sécurité renforcée
          security_context {
            run_as_non_root = true
            run_as_user     = 1000
            capabilities {
              drop = ["ALL"]
            }
          }
        }

        # Tolérance pour les nœuds
        toleration {
          key      = "app"
          operator = "Equal"
          value    = "gestion-trajet"
          effect   = "NoSchedule"
        }
      }
    }
  }

  # Ajout d'un timeout personnalisé
  timeouts {
    create = "15m"
    update = "15m"
  }
}

# 5. ServiceAccount pour le déploiement
resource "kubernetes_service_account" "app" {
  metadata {
    name      = "gestion-trajet-sa"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }
}

# 6. Service d'exposition (optimisé)
resource "kubernetes_service" "app" {
  metadata {
    name      = "gestion-trajet-service"
    namespace = kubernetes_namespace.microservice.metadata[0].name
    annotations = {
      "metallb.universe.tf/address-pool" = "default"
      "prometheus.io/scrape"             = "true"
    }
  }

  spec {
    selector = {
      app = kubernetes_deployment.app.metadata[0].labels.app
    }

    port {
      name        = "http"
      port        = 80
      target_port = 8080
      protocol    = "TCP"
    }

    type = "LoadBalancer"

    # Meilleure gestion du LoadBalancer
    session_affinity = "None"
    ip_families      = ["IPv4"]
  }
}

# 7. Autoscaling Horizontal (optimisé)
resource "kubernetes_horizontal_pod_autoscaler" "app" {
  metadata {
    name      = "gestion-trajet-hpa"
    namespace = kubernetes_namespace.microservice.metadata[0].name
  }

  spec {
    min_replicas = 1
    max_replicas = 5
    
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.app.metadata[0].name
    }

    # Métriques combinées
    metric {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type                = "Utilization"
          average_utilization = 80
        }
      }
    }
    
    metric {
      type = "Resource"
      resource {
        name = "memory"
        target {
          type                = "Utilization"
          average_utilization = 80
        }
      }
    }

    # Comportement de scaling
    behavior {
      scale_down {
        stabilization_window_seconds = 300
        policies {
          type          = "Pods"
          value         = 1
          period_seconds = 60
        }
      }
      scale_up {
        stabilization_window_seconds = 60
        policies {
          type          = "Pods"
          value         = 2
          period_seconds = 45
        }
      }
    }
  }
}

# 8. Sorties utiles
output "application_url" {
  value = "http://${kubernetes_service.app.status.0.load_balancer.0.ingress.0.ip}:${kubernetes_service.app.spec.0.port.0.port}"
}

output "namespace" {
  value = kubernetes_namespace.microservice.metadata[0].name
}

output "deployment_name" {
  value = kubernetes_deployment.app.metadata[0].name
}