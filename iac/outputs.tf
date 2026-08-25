output "kubernetes_cluster_id" {
  description = "The Kubernetes Managed Cluster ID."
  value       = azurerm_kubernetes_cluster.this.id
}

output "kubernetes_cluster_name" {
  description = "The name of the AKS cluster."
  value       = azurerm_kubernetes_cluster.this.name
}

output "kubeconfig" {
  description = "A Terraform object that contains kubeconfig info."
  value       = azurerm_kubernetes_cluster.this.kube_config
  sensitive   = true
}

output "resource_group_name" {
  description = "The resource group containing the AKS cluster."
  value       = data.azurerm_resource_group.this.name
}
