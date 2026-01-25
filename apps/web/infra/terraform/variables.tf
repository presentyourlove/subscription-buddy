variable "project_id" {
  description = "The ID of the Firebase project"
  type        = string
}

variable "billing_account_id" {
  description = "The Billing Account ID"
  type        = string
}

variable "region" {
  description = "The region for resources (e.g. asia-east1)"
  type        = string
  default     = "asia-east1"
}
