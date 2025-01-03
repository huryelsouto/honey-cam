#!/bin/bash

# Variáveis
PROJECT_ID="tcchuryel"
ZONE="southamerica-east1-a"
INSTANCE_NAME="honeypot-test-10"
MACHINE_TYPE="e2-small"
DISK_SIZE="10"
IMAGE_FAMILY="ubuntu-2004-lts"
IMAGE_PROJECT="ubuntu-os-cloud"
FIREWALL_RULE="honeypot-http-firewall"
PROJECT_ZIP_LOCAL_PATH="../honey-cam.zip"
PROJECT_FOLDER_NAME="honey-cam"

# Gerar chave SSH (se não existir)
setup_ssh_keys() {
    echo "Verificando chave SSH para o gcloud..."
    if [ ! -f ~/.ssh/google_compute_engine ]; then
        echo "Gerando chave SSH..."
        gcloud compute ssh $INSTANCE_NAME --dry-run --zone=$ZONE > /dev/null 2>&1
    else
        echo "Chave SSH já existente."
    fi
}

# Criar instância
create_instance() {
    echo "Criando instância $INSTANCE_NAME..."
    curl -X POST \
        -H "Authorization: Bearer $(gcloud auth print-access-token)" \
        -H "Content-Type: application/json" \
        "https://compute.googleapis.com/compute/v1/projects/$PROJECT_ID/zones/$ZONE/instances" \
        -d "{
            'name': '$INSTANCE_NAME',
            'machineType': 'zones/$ZONE/machineTypes/$MACHINE_TYPE',
            'disks': [
                {
                    'boot': true,
                    'autoDelete': true,
                    'initializeParams': {
                        'sourceImage': 'projects/$IMAGE_PROJECT/global/images/family/$IMAGE_FAMILY',
                        'diskSizeGb': $DISK_SIZE
                    }
                }
            ],
            'networkInterfaces': [
                {
                    'network': 'global/networks/default',
                    'accessConfigs': [
                        {
                            'type': 'ONE_TO_ONE_NAT',
                            'name': 'External NAT'
                        }
                    ]
                }
            ],
            'tags': {
                'items': ['http-server', 'ssh-server']
            }
        }"
}

# Verificar regra de firewall para HTTP
check_firewall_rule() {
    echo "Verificando regra de firewall $FIREWALL_RULE..."
    if gcloud compute firewall-rules describe $FIREWALL_RULE --project=$PROJECT_ID > /dev/null 2>&1; then
        echo "Regra de firewall $FIREWALL_RULE já existe. Pulando criação."
    else
        echo "Criando regra de firewall $FIREWALL_RULE..."
        gcloud compute firewall-rules create $FIREWALL_RULE \
            --project=$PROJECT_ID \
            --allow=tcp:80 \
            --target-tags=http-server \
            --direction=INGRESS \
            --source-ranges=0.0.0.0/0
    fi
}

# Verificar regra de firewall para SSH
check_firewall_rule_ssh() {
    echo "Verificando regra de firewall para SSH..."
    if gcloud compute firewall-rules describe allow-ssh --project=$PROJECT_ID > /dev/null 2>&1; then
        echo "Regra de firewall para SSH já existe. Pulando criação."
    else
        echo "Criando regra de firewall para SSH..."
        gcloud compute firewall-rules create allow-ssh \
            --project=$PROJECT_ID \
            --allow=tcp:22 \
            --target-tags=ssh-server \
            --direction=INGRESS \
            --source-ranges=0.0.0.0/0
    fi
}

# Aguardar inicialização do SSH
wait_for_ssh() {
    echo "Aguardando o SSH ficar disponível na instância..."
    for i in {1..10}; do
        if gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="exit" > /dev/null 2>&1; then
            echo "SSH está disponível!"
            return 0
        fi
        echo "Tentativa $i: SSH ainda não disponível. Aguardando..."
        sleep 15
    done
    echo "Falha ao conectar via SSH após várias tentativas."
    exit 1
}

# Configurar instância
setup_instance() {
    echo "Esperando instância inicializar..."
    wait_for_ssh

    echo "Enviando projeto para a instância..."
    gcloud compute scp $PROJECT_ZIP_LOCAL_PATH $INSTANCE_NAME:~/ --zone=$ZONE

    echo "Configurando servidor Apache, PHP, .htaccess e deploy do projeto..."
    gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="
        sudo apt update &&
        sudo apt install apache2 php libapache2-mod-php unzip -y &&
        sudo systemctl enable apache2 &&
        sudo systemctl start apache2 &&
        unzip ~/honey-cam.zip -d ~/ &&
        sudo mv ~/honey-cam/public/* ~/honey-cam/public/.* /var/www/html/ &&
        sudo rm /var/www/html/index.html &&
        sudo chmod 644 /var/www/html/index.php &&
        sudo chmod -R 755 /var/www/html &&
        echo '<IfModule mod_dir.c>
                DirectoryIndex index.php index.html
            </IfModule>' | sudo tee /etc/apache2/mods-enabled/dir.conf
    "
}

# Função principal
main() {
    echo "Iniciando configuração do honeypot..."

    # Garantir que a chave SSH existe
    setup_ssh_keys

    # Criar instância
    create_instance

    # Configurar firewall
    check_firewall_rule
    check_firewall_rule_ssh

    # Configurar a instância e o projeto
    setup_instance

    echo "Configuração concluída com sucesso!"
}

# Executar o script
main
