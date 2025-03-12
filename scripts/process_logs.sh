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

# Function to process a log file with GoAccess
process_log_file() {
    local file_path="$1"
    local output_html="$2"

    echo "Processing log file: $file_path → $output_html"

    LC_TIME="en_US.UTF-8" goaccess "$file_path" -o "$output_html" --log-format=COMBINED

    if [ $? -eq 0 ]; then
        echo "Report generated: $output_html"
    else
        echo "Error processing file: $file_path" >&2
        return 1
    fi
}

# Function to merge logs into a single file
merge_logs() {
    local output_log="$1"
    shift
    local log_files=("$@")

    cat "${log_files[@]}" > "$output_log"

    if [ $? -eq 0 ]; then
        echo "Logs merged into: $output_log"
    else
        echo "Error merging logs" >&2
        return 1
    fi
}

# Process all project directories in honey-cam-logs
for project_dir in "$logs_base_dir"/*/; do
    [[ -d "$project_dir" ]] || continue

    echo "Processing project: $(basename "$project_dir")"

    for sub_dir in "$project_dir"/*/; do
        [[ -d "$sub_dir" ]] || continue

        echo "Processing subdirectory: $(basename "$sub_dir")"

        access_dir="$sub_dir/apache2_logs/access_logs"
        processed_dir="$sub_dir/apache2_goaccess_processed_logs/access_logs"

        # Skip if access_logs directory does not exist
        if [[ ! -d "$access_dir" ]]; then
            echo "Skipping: No access_logs directory in $(basename "$sub_dir")"
            continue
        fi

        echo "Processing access logs in: $access_dir"

        # Create processed logs directory
        mkdir -p "$processed_dir"

        # Collect all log files
        log_files=("$access_dir"/*.log)
        unified_log="$processed_dir/unified_access_logs.log"
        unified_html="$processed_dir/unified_access_logs.html"

        # Clear or create the unified log file
        > "$unified_log"

        # Process individual log files
        for log_file in "${log_files[@]}"; do
            [[ -f "$log_file" ]] || continue

            output_html="$processed_dir/$(basename "$log_file").html"

            # Generate HTML for each log
            process_log_file "$log_file" "$output_html" > /dev/null 2>&1

            # Append to unified log
            cat "$log_file" >> "$unified_log"
        done

        # Generate HTML for the unified log if it has content
        if [[ -s "$unified_log" ]]; then
            echo "Generating unified log report: $unified_html"
            process_log_file "$unified_log" "$unified_html" > /dev/null 2>&1
        else
            echo "Warning: Unified log is empty in $processed_dir"
        fi
    done
done

echo "Step 1: Individual log processing completed."
echo "Starting global log unification..."

# Global unification: Merge all unified_access_logs.log files into one per project
for project_dir in "$logs_base_dir"/*/; do
    [[ -d "$project_dir" ]] || continue

    echo "Unifying logs for project: $(basename "$project_dir")"

    global_unified_log="$project_dir/global_unified_access_logs.log"
    global_unified_html="$project_dir/global_unified_access_logs.html"

    # Clear or create the global unified log file
    > "$global_unified_log"

    # Find and merge all unified_access_logs.log files
    find "$project_dir" -type f -path "*/apache2_goaccess_processed_logs/access_logs/unified_access_logs.log" | while read -r unified_log; do
        [[ -f "$unified_log" ]] || continue
        cat "$unified_log" >> "$global_unified_log"
    done

    # Generate HTML for the global unified log if it has content
    if [[ -s "$global_unified_log" ]]; then
        echo "Generating global unified log report: $global_unified_html"
        process_log_file "$global_unified_log" "$global_unified_html" > /dev/null 2>&1
    else
        echo "Warning: Global unified log is empty in $project_dir"
    fi
done

echo "Log processing completed!"
