variable "docker_username" {
  description = "Nom d'utilisateur Docker Hub pour l'image container"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Mot de passe de la base de données"
  type        = string
  sensitive   = true
}

variable "image_tag" {
  description = "Tag de version de l'image Docker"
  type        = string
  default     = "latest"
}

variable "replica_count" {
  description = "Nombre initial de pods à déployer"
  type        = number
  default     = 3
}