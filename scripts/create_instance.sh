#!/usr/local/bin/bash

# Check for mandatory parameters
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Error: PROJECT_ID, ZONE, and INSTANCE_NAME are required parameters."
    echo "Usage: $0 <PROJECT_ID> <ZONE> <INSTANCE_NAME> [MACHINE_TYPE] [DISK_SIZE] [IMAGE_FAMILY] [IMAGE_PROJECT] [FIREWALL_RULE] [PROJECT_ZIP_LOCAL_PATH] [PROJECT_FOLDER_NAME]"
    exit 1
fi

# Mandatory variables
PROJECT_ID="$1"
ZONE="$2"
INSTANCE_NAME="$3"

# Optional variables with default values
MACHINE_TYPE="${4:-e2-small}"
DISK_SIZE="${5:-10}"
IMAGE_FAMILY="${6:-ubuntu-2004-lts}"
IMAGE_PROJECT="${7:-ubuntu-os-cloud}"
FIREWALL_RULE="${8:-honeypot-http-firewall}"
PROJECT_FOLDER_NAME="${9:-honey-cam}"
PROJECT_ZIP_LOCAL_PATH="${10:-../$PROJECT_FOLDER_NAME.zip}"

# Generate SSH key if it doesn't exist
setup_ssh_keys() {
    echo "Checking SSH key for gcloud..."
    if [ ! -f ~/.ssh/google_compute_engine ]; then
        echo "Generating SSH key..."
        gcloud compute ssh $INSTANCE_NAME --dry-run --zone=$ZONE > /dev/null 2>&1
    else
        echo "SSH key already exists."
    fi
}

# Create instance
create_instance() {
    echo "Creating instance $INSTANCE_NAME..."
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

# Check and create HTTP firewall rule
check_firewall_rule() {
    echo "Checking HTTP firewall rule $FIREWALL_RULE..."
    if gcloud compute firewall-rules describe $FIREWALL_RULE --project=$PROJECT_ID > /dev/null 2>&1; then
        echo "HTTP firewall rule $FIREWALL_RULE already exists. Skipping creation."
    else
        echo "Creating HTTP firewall rule $FIREWALL_RULE..."
        gcloud compute firewall-rules create $FIREWALL_RULE \
            --project=$PROJECT_ID \
            --allow=tcp:80 \
            --target-tags=http-server \
            --direction=INGRESS \
            --source-ranges=0.0.0.0/0
    fi
}

# Check and create SSH firewall rule
check_firewall_rule_ssh() {
    echo "Checking SSH firewall rule..."
    if gcloud compute firewall-rules describe allow-ssh --project=$PROJECT_ID > /dev/null 2>&1; then
        echo "SSH firewall rule already exists. Skipping creation."
    else
        echo "Creating SSH firewall rule..."
        gcloud compute firewall-rules create allow-ssh \
            --project=$PROJECT_ID \
            --allow=tcp:22 \
            --target-tags=ssh-server \
            --direction=INGRESS \
            --source-ranges=0.0.0.0/0
    fi
}

# Wait for SSH to be available
wait_for_ssh() {
    echo "Waiting for SSH to be available on the instance..."
    for i in {1..10}; do
        if gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="exit" > /dev/null 2>&1; then
            echo "SSH is now available!"
            return 0
        fi
        echo "Attempt $i: SSH not yet available. Waiting..."
        sleep 15
    done
    echo "Failed to connect to SSH after multiple attempts."
    exit 1
}

# Configure instance
setup_instance() {
    echo "Waiting for instance to initialize..."
    wait_for_ssh

    echo "Uploading project to the instance..."
    gcloud compute scp $PROJECT_ZIP_LOCAL_PATH $INSTANCE_NAME:~/ --zone=$ZONE

    echo "Setting up Apache server, PHP, .htaccess, and deploying the project..."
    gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="
        sudo apt update &&
        sudo apt install apache2 php libapache2-mod-php unzip -y &&
        sudo systemctl enable apache2 &&
        sudo systemctl start apache2 &&
        unzip ~/$PROJECT_FOLDER_NAME.zip -d ~/ &&
        sudo mv ~/$PROJECT_FOLDER_NAME/public/* ~/$PROJECT_FOLDER_NAME/public/.* /var/www/html/ &&
        sudo rm /var/www/html/index.html &&
        sudo chmod 644 /var/www/html/index.php &&
        sudo chmod -R 755 /var/www/html &&
        echo '<IfModule mod_dir.c>
                DirectoryIndex index.php index.html
            </IfModule>' | sudo tee /etc/apache2/mods-enabled/dir.conf
    "
}

# Main function
main() {
    echo "Starting honeypot configuration..."

    # Ensure SSH key exists
    setup_ssh_keys

    # Create instance
    create_instance

    # Configure firewall
    check_firewall_rule
    check_firewall_rule_ssh

    # Configure the instance and project
    setup_instance

    echo "Configuration completed successfully!"
}

# Execute the script
main
