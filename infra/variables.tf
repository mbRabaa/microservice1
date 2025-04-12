# variables.tf
variable "docker_registry" {
  description = "URL du registry Docker"
  type        = string
  default     = "ghcr.io" # Exemple avec GitHub Container Registry
}

variable "docker_image" {
  description = "Nom de l'image Docker"
  type        = string
  default     = "votre-compte/gestion-trajet" # À adapter
}

variable "image_tag" {
  description = "Tag de l'image Docker"
  type        = string
  default     = "latest"
}

variable "db_user" {
  description = "Nom d'utilisateur PostgreSQL"
  type        = string
  default     = "tunisbus"
}

variable "db_password" {
  description = "Mot de passe PostgreSQL"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nom de la base de données"
  type        = string
  default     = "gestion_trajet_db"
}

variable "replica_count" {
  description = "Nombre de réplicas de l'application"
  type        = number
  default     = 2
}