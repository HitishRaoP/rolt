resource "aws_secretsmanager_secret" "minikube_certs" {
  name = "minikube_certs"
}

resource "aws_secretsmanager_secret_version" "minikube_certs_version" {
  secret_id = aws_secretsmanager_secret.minikube_certs.id
  secret_string = jsonencode({
    ca_data   = var.MINIKUBE_CA_DATA
    cert_data = var.MINIKUBE_CERT_DATA
    key_data  = var.MINIKUBE_KEY_DATA
  })
}
