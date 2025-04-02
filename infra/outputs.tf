# URL d'accès au service
output "service_url" {
  description = "URL pour accéder à l'application"
  value       = "http://${try(kubernetes_service.app.status[0].load_balancer[0].ingress[0].ip, "localhost")}:80"
  
  # Note : try() gère le cas où l'IP n'est pas encore disponible
}

# Nom du namespace créé
output "namespace" {
  description = "Namespace Kubernetes créé"
  value       = kubernetes_namespace.microservice.metadata[0].name
}

# Nom du déploiement
output "deployment_name" {
  description = "Nom du déploiement Kubernetes"
  value       = kubernetes_deployment.app.metadata[0].name
}