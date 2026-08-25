resource "helm_release" "envoy_gateway_api" {
  name             = "envoy-gateway-api"
  repository       = "oci://docker.io/envoyproxy"
  chart            = "gateway-helm"
  version          = var.envoy_gateway_api_version
  create_namespace = true
  namespace        = "envoy-gateway-api"
}

resource "helm_release" "kube_prometheus_stack" {
  name             = "monitoring"
  repository       = "oci://ghcr.io/prometheus-community/charts"
  chart            = "kube-prometheus-stack"
  version          = var.kube_prometheus_stack_version
  create_namespace = true
  namespace        = "monitoring"
}
