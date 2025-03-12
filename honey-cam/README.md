
# Meu Projeto Apache

Este é um projeto inicial configurado para rodar um servidor Apache com frontend em HTML, CSS e JS, e backend em PHP com JSON.

## Estrutura do Projeto

- **public/**: Contém o frontend.
- **api/**: Contém os endpoints PHP.
- **data/**: Contém os dados JSON.

## Como Rodar o Projeto

1. Certifique-se de ter o Apache instalado e configurado.
2. Coloque o projeto na raiz do servidor Apache (`/var/www/html/` ou conforme a configuração).
3. Acesse `http://localhost/meu_projeto_apache/public/` no navegador para ver o frontend.
4. Clique no botão "Obter Dados" para interagir com o backend PHP.

```shell
conectar ao honeycam

gcloud compute ssh <honeypot-name> --zone=<zone>

# gcloud compute ssh honeycam-sao-paulo --zone=southamerica-east1-a
# gcloud compute ssh honeycam-tel-aviv --zone=me-west1-a
# gcloud compute ssh honeycam-santiago --zone=southamerica-west1-a
# gcloud compute ssh honeycam-mumbai --zone=asia-south1-a
# gcloud compute ssh honeycam-los-angeles --zone=us-west2-a
# gcloud compute ssh honeycam-hong-kong --zone=asia-east2-a
# gcloud compute ssh honeycam-norte-da-virginia --zone=us-east4-a
# gcloud compute ssh honeycam-tokyo --zone=asia-northeast1-a
# gcloud compute ssh honeycam-paris --zone=europe-west9-a
# gcloud compute ssh honeycam-singapura --zone=asia-southeast1-a
# gcloud compute ssh honeycam-frankfurt --zone=europe-west3-a
# gcloud compute ssh honeycam-sydney --zone=australia-southeast1-a

# gcloud compute ssh honeypot-teste02 --zone=southamerica-east1-a
# gcloud compute ssh honeypot-teste03 --zone=southamerica-east1-a

```

```shell
terminar a configuração do honeycam

sudo rm /var/www/html/index.html && \
sudo mkdir -p /var/www/html/logs && \
sudo chown -R www-data:www-data /var/www/html/logs && \
sudo tee /etc/apache2/sites-available/000-default.conf > /dev/null <<EOF
<VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        ErrorLog \${APACHE_LOG_DIR}/error.log
        CustomLog \${APACHE_LOG_DIR}/access.log combined

        <Directory /var/www/html>
                AllowOverride All
                Require all granted
        </Directory>
</VirtualHost>
EOF
sudo a2enmod rewrite && \
sudo systemctl restart apache2
```

```shell
conferir os logs após eu entrar

ls /var/www/html/logs/ && cat /var/log/apache2/access.log && cat /var/log/apache2/error.log


```
```shell
limpar os logs após eu entrar

sudo truncate -s 0 /var/log/apache2/access.log && sudo truncate -s 0 /var/log/apache2/error.log && sudo rm /var/www/html/logs/*
```