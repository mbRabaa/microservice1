output "application_url" {
  description = "URL d'accès à l'application"
  value       = "http://${try(kubernetes_service.app.status[0].load_balancer[0].ingress[0].ip, "pending")}"
}

output "prometheus_targets" {
  description = "URL des cibles Prometheus"
  value       = "http://prometheus-server.monitoring.svc.cluster.local:9090/targets"
}

output "deployment_status" {
  description = "Statut du déploiement"
  value       = kubernetes_deployment.app.status[0].conditions[0].type
}