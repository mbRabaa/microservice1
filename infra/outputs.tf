output "service_url" {
  description = "URL pour accéder à l'application"
  value       = "http://${try(kubernetes_service.app.status[0].load_balancer[0].ingress[0].ip, "localhost")}:80"
}

output "namespace" {
  description = "Namespace Kubernetes créé"
  value       = kubernetes_namespace.microservice.metadata[0].name
}

output "deployment_name" {
  description = "Nom du déploiement Kubernetes"
  value       = kubernetes_deployment.app.metadata[0].name
}