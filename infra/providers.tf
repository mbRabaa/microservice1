# Configuration de base de Terraform
terraform {
  # Déclaration des providers requis
  required_providers {
    # Provider Kubernetes pour interagir avec K3s
    kubernetes = {
      source  = "hashicorp/kubernetes"  # Source officielle HashiCorp
      version = "2.23.0"                # Version stable recommandée
    }
  }
}

# Configuration du provider Kubernetes
provider "kubernetes" {
  # Chemin vers le fichier de configuration kubeconfig
  # K3s génère automatiquement ce fichier lors de l'installation
  config_path = "~/.kube/config"

  # Note : Dans un environnement CI/CD comme GitHub Actions,
  # ce chemin est valide car K3s configure automatiquement kubectl
}