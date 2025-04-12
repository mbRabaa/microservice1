# outputs.tf - Version corrigée
output "application_url" {
  description = "URL d'accès à l'application"
  value       = try("http://${kubernetes_service.app.status[0].load_balancer[0].ingress[0].ip}", "Non disponible")
}

output "db_connection" {
  description = "Informations de connexion à la base de données"
  sensitive   = true
  value = {
    host     = kubernetes_secret.db_creds.data["db_host"]
    database = kubernetes_secret.db_creds.data["db_name"]
    username = kubernetes_secret.db_creds.data["db_user"]
  }
}