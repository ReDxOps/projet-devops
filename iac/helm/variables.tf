variable "kube_context" {
  description = "Kubernetes context to use; leave null to use the kubeconfig default context"
  type        = string
  default     = "aks-projet-devops"
}

variable "envoy_gateway_api_version" {
  type    = string
  default = "v1.9.0"
}
variable "kube_prometheus_stack_version" {
  type    = string
  default = "88.5.4"
}
