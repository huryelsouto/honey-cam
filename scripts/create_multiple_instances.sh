#!/usr/local/bin/bash

# Localizações e zonas correspondentes
declare -A LOCATIONS
LOCATIONS=(
    ["sao-paulo"]="southamerica-east1-a"
    ["tel-aviv"]="me-west1-a"
    ["santiago"]="southamerica-west1-a"
    ["mumbai"]="asia-south1-a"
    ["los-angeles"]="us-west2-a"
    ["hong-kong"]="asia-east2-a"
    ["norte-da-virginia"]="us-east4-a"
    ["tokyo"]="asia-northeast1-a"
    ["paris"]="europe-west9-a"
    ["singapura"]="asia-southeast1-a"
    ["frankfurt"]="europe-west3-a"
    ["sydney"]="australia-southeast1-a"
)

# Loop pelas localizações
for LOCATION in "${!LOCATIONS[@]}"; do
    ZONE="${LOCATIONS[$LOCATION]}"
    INSTANCE_NAME="honeycam-${LOCATION}" # Nome da instância com a chave do array
    echo "Criando instância $INSTANCE_NAME na zona $ZONE..."

    ./create_instance.sh "tcchuryel" "$ZONE" "$INSTANCE_NAME" &
done

# Aguardar finalização de todos os processos em paralelo
wait
echo "Todas as instâncias foram criadas!"
