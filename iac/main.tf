data "azurerm_resource_group" "this" {
  name = var.resource_group_name
}
resource "azurerm_kubernetes_cluster" "this" {
  name                = var.cluster_name
  location            = data.azurerm_resource_group.this.location
  resource_group_name = data.azurerm_resource_group.this.name
  dns_prefix          = var.cluster_name
  sku_tier            = var.sku_tier
  default_node_pool {
    name       = var.default_node_pool_name
    node_count = var.default_node_pool_node_count
    vm_size    = var.default_node_pool_vm_size
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
  }

  node_provisioning_profile {
    mode = "Manual"
  }

  tags = merge(data.azurerm_resource_group.this.tags, var.tags)
}
