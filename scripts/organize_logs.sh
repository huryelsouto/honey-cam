#!/usr/local/bin/bash

# Get the parent directory of the script
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
parent_dir="$(dirname "$script_dir")"

# Define the honey-cam-logs directory path
logs_base_dir="$parent_dir/honey-cam-logs"

# Check if the honey-cam-logs directory exists
if [[ ! -d "$logs_base_dir" ]]; then
    echo "Error: The directory 'honey-cam-logs' was not found in the parent directory of the script."
    exit 1
fi

echo "Processing logs inside: $logs_base_dir"

# Function to normalize extracted log filenames
normalize_log_name() {
    local log_file="$1"
    local directory="$2"

    # Ensure directory exists before moving files
    mkdir -p "$directory"

    # Extract base name and numeric suffix (if any)
    if [[ "$(basename "$log_file")" =~ ^(.*)\.log\.([0-9]+)$ ]]; then
        base_name="${BASH_REMATCH[1]}" # Example: "error"
        suffix="${BASH_REMATCH[2]}"    # Example: "8"
        new_name="${base_name}_${suffix}.log"
    else
        new_name="$(basename "$log_file")"
    fi

    # Move and rename the file correctly
    mv "$log_file" "$directory/$new_name"
}

# Loop through each project directory inside honey-cam-logs
for project_dir in "$logs_base_dir"/*/; do
    [[ -d "$project_dir" ]] || continue

    echo "Processing project: $(basename "$project_dir")"

    for sub_dir in "$project_dir"/*/; do
        [[ -d "$sub_dir" ]] || continue

        echo "Processing subdirectory: $(basename "$sub_dir")"

        apache_logs_dir="$sub_dir/apache2_logs"

        if [[ -d "$apache_logs_dir" ]]; then
            echo "Found apache2_logs directory in $(basename "$sub_dir")"

            # Define category directories
            access_dir="$apache_logs_dir/access_logs"
            error_dir="$apache_logs_dir/error_logs"
            other_dir="$apache_logs_dir/other_logs"

            # Ensure subdirectories exist
            mkdir -p "$access_dir" "$error_dir" "$other_dir"

            # Extract and move access logs
            for log_file in "$apache_logs_dir"/access.log*.gz; do
                [[ -f "$log_file" ]] || continue
                extracted_file="${log_file%.gz}"
                gunzip -c "$log_file" > "$extracted_file"
                rm -f "$log_file"
                normalize_log_name "$extracted_file" "$access_dir"
            done

            # Move and rename already extracted access logs
            for log_file in "$apache_logs_dir"/access.log*; do
                [[ -f "$log_file" ]] || continue
                normalize_log_name "$log_file" "$access_dir"
            done

            # Extract and move error logs
            for log_file in "$apache_logs_dir"/error.log*.gz; do
                [[ -f "$log_file" ]] || continue
                extracted_file="${log_file%.gz}"
                gunzip -c "$log_file" > "$extracted_file"
                rm -f "$log_file"
                normalize_log_name "$extracted_file" "$error_dir"
            done

            # Move and rename already extracted error logs
            for log_file in "$apache_logs_dir"/error.log*; do
                [[ -f "$log_file" ]] || continue
                normalize_log_name "$log_file" "$error_dir"
            done

            # Extract and move other vhosts access logs
            for log_file in "$apache_logs_dir"/other_vhosts_access.log*.gz; do
                [[ -f "$log_file" ]] || continue
                extracted_file="${log_file%.gz}"
                gunzip -c "$log_file" > "$extracted_file"
                rm -f "$log_file"
                normalize_log_name "$extracted_file" "$other_dir"
            done

            # Move and rename already extracted other vhosts access logs
            for log_file in "$apache_logs_dir"/other_vhosts_access.log*; do
                [[ -f "$log_file" ]] || continue
                normalize_log_name "$log_file" "$other_dir"
            done
        else
            echo "No apache2_logs directory found in $(basename "$sub_dir")"
        fi
    done
done

echo "Log extraction, renaming, organization, and cleanup completed!"