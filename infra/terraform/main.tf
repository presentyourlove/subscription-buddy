terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  user_project_override = true
}

# 1. Firebase Project Resource (Import existing)
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id
}

# 2. Firestore Database
resource "google_firestore_database" "database" {
  provider                    = google-beta
  project                     = var.project_id
  name                        = "(default)"
  location_id                 = var.region
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"
}

# 3. Storage Bucket (Default)
resource "google_storage_bucket" "default" {
  provider      = google-beta
  name          = "${var.project_id}.appspot.com"
  location      = var.region
  force_destroy = false
  uniform_bucket_level_access = true
}

# 4. Firebase Rules (Firestore)
resource "google_firebaserules_ruleset" "firestore" {
  provider = google-beta
  project  = var.project_id
  source {
    files {
      name    = "firestore.rules"
      content = file("../../firestore.rules")
    }
  }
}

resource "google_firebaserules_release" "firestore" {
  provider     = google-beta
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name
  project      = var.project_id
}
