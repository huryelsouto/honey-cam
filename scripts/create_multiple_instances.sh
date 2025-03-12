#!/usr/local/bin/bash

# Locations and corresponding zones
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

# Loop through the locations
for LOCATION in "${!LOCATIONS[@]}"; do
    ZONE="${LOCATIONS[$LOCATION]}"
    INSTANCE_NAME="honeycam-${LOCATION}" # Instance name with the array key
    echo "Creating instance $INSTANCE_NAME in zone $ZONE..."

    ./create_instance.sh "tcchuryel" "$ZONE" "$INSTANCE_NAME" &
done

# Wait for all parallel processes to finish
wait
echo "All instances have been created!"
