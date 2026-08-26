variable "resource_group_name" {
  type        = string
  description = "Resource group EXISTANT, fourni par l'école (renseigné dans terraform.tfvars)."
}
variable "cluster_name" {
  type    = string
  default = "aks-projet-devops"
}

variable "default_node_pool_name" {
  type    = string
  default = "default"
}
variable "default_node_pool_node_count" {
  type    = number
  default = 2
}
variable "default_node_pool_vm_size" {
  type    = string
  default = "Standard_B2ms"
}
variable "tags" {
  type    = map(string)
  default = {}
}

variable "sku_tier" {
  type    = string
  default = "Free"
}

variable "github_handle" {
  type        = string
  description = "Nom du compte GitHub."
  default     = "ReDxOps"
}

variable "github_repository" {
  type        = string
  description = "Nom du dépôt GitHub."
  default     = "projet-devops"
}

variable "github_branch" {
  type        = string
  description = "Branche autorisée pour la fédération OIDC."
  default     = "main"
}
