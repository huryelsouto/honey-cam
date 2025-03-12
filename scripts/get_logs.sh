#!/usr/local/bin/bash

# Check if the project logs directory name is provided
if [ -z "$1" ]; then
    echo "Error: Missing required parameter 'project_logs_dir_name'."
    echo "Usage: $0 <project_logs_dir_name>"
    exit 1
fi

# Define the project logs directory name from the argument
project_logs_dir_name="$1"

# Get the parent directory of the current directory
parent_dir="$(dirname "$(pwd)")"

# Create the 'honey-cam-logs' directory in the parent directory if it does not exist
logs_dir="$parent_dir/honey-cam-logs"
mkdir -p "$logs_dir"

# Create the project logs directory inside logs_dir
project_logs_dir="$logs_dir/$project_logs_dir_name"
mkdir -p "$project_logs_dir"

# Array with instance names and their respective zones
declare -A INSTANCES
INSTANCES=(
    ["honeypot-teste02"]="southamerica-east1-a"
    ["honeypot-teste03"]="southamerica-east1-a"
    # ["honeycam-sao-paulo"]="southamerica-east1-a"
    # ["honeycam-tel-aviv"]="me-west1-a"
    # ["honeycam-santiago"]="southamerica-west1-a"
    # ["honeycam-mumbai"]="asia-south1-a"
    # ["honeycam-los-angeles"]="us-west2-a"
    # ["honeycam-hong-kong"]="asia-east2-a"
    # ["honeycam-norte-da-virginia"]="us-east4-a"
    # ["honeycam-tokyo"]="asia-northeast1-a"
    # ["honeycam-paris"]="europe-west9-a"
    # ["honeycam-singapore"]="asia-southeast1-a"
    # ["honeycam-frankfurt"]="europe-west3-a"
    # ["honeycam-sydney"]="australia-southeast1-a"
)

# Loop through each instance
for INSTANCE in "${!INSTANCES[@]}"; do
    ZONE="${INSTANCES[$INSTANCE]}"
    LOG_DIR="$project_logs_dir/logs-${INSTANCE}"

    # Create the directory for instance logs
    mkdir -p "$LOG_DIR"

    echo "Collecting logs for $INSTANCE in zone $ZONE..."

    # Copy the logs directory from the instance
    gcloud compute scp --recurse $INSTANCE:/var/www/html/logs/ "$LOG_DIR/" --zone=$ZONE

    # Copy the entire Apache2 logs directory
    gcloud compute scp --recurse $INSTANCE:/var/log/apache2/ "$LOG_DIR/apache2_logs/" --zone=$ZONE
done

echo "All logs have been collected successfully in '$project_logs_dir'!"
