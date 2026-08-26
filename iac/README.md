# Infrastructure as Code - AKS

Provisionnement d'un cluster Azure Kubernetes Service (AKS) via Terraform.

## Prérequis

- Terraform >= 1.5.0
- Azure CLI connecté (`az login`)
- Un Resource Group Azure existant

## Configuration

Renseigner les variables dans `terraform.tfvars` :

```hcl
resource_group_name = "rg-RDubois2025_cours-projet"
cluster_name        = "aks-projet-devops"
node_count          = 2
vm_size             = "Standard_B2ms"
tags = {
  user = "RDubois2025"
}
```

## Déploiement

1. Initialiser Terraform et télécharger le provider AzureRM :
   ```bash
   terraform init
   ```

2. Valider et prévisualiser les ressources :
   ```bash
   terraform plan
   ```

3. Déployer l'infrastructure :
   ```bash
   terraform apply
   ```

## Connexion au cluster

Récupérer les identifiants pour configurer `kubectl` localement :

```bash
az aks get-credentials --resource-group $(terraform output -raw resource_group_name) --name $(terraform output -raw kubernetes_cluster_name) --overwrite-existing
```

Vérifier l'accès aux nœuds :
```bash
kubectl get nodes
```

## Authentification CI/CD (OIDC)

L'infrastructure provisionne également une identité managée (`identity.tf`) avec fédération OIDC pour GitHub Actions.

Récupérer l'identifiant client pour la CI :
```bash
terraform output azure_client_id
```

Récupérer le tenant et subscription id pour la CI :
```bash
az account show
```

## Destruction

Supprimer l'ensemble des ressources provisionnées :
```bash
terraform destroy
```