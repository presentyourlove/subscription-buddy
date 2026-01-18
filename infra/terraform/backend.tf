terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
  # For production, replace with GCS backend:
  # backend "gcs" {
  #   bucket  = "tf-state-prod"
  #   prefix  = "terraform/state"
  # }
}
