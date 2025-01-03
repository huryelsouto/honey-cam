#!/bin/bash

INSTANCE="honeypot-instance-sao-paulo"
ZONE="southamerica-east1-a"

# Diretório logs
gcloud compute scp --recurse $INSTANCE:/var/www/html/logs/ ./logs/ --zone=$ZONE

# Arquivo access.log
gcloud compute scp $INSTANCE:/var/log/apache2/access.log ./access.log --zone=$ZONE

# Arquivo error.log
gcloud compute scp $INSTANCE:/var/log/apache2/error.log ./error.log --zone=$ZONE

echo "Todos os arquivos foram copiados com sucesso!"
