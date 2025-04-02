# Nom d'utilisateur Docker Hub pour l'image container
variable "docker_username" {
  description = "Nom d'utilisateur pour Docker Hub où l'image est stockée"
  type        = string
  sensitive   = true  # Masque la valeur dans les logs de sortie
}

# Tag de l'image Docker à déployer
variable "image_tag" {
  description = "Tag de version de l'image Docker (par défaut: latest)"
  type        = string
  default     = "latest"
}

# Nombre de réplicas pour le déploiement
variable "replica_count" {
  description = "Nombre initial de pods à déployer"
  type        = number
  default     = 3  # Valeur recommandée pour la haute disponibilité
}

# Mot de passe de la base de données (exemple)
variable "db_password" {
  description = "Mot de passe pour la connexion à la base de données"
  type        = string
  sensitive   = true  # Ne jamais exposer en clair
}