#!/bin/sh
set -e

# Check if this is the first run by looking for a marker file
MARKER_FILE="/app/data/.container_initialized"
PAGES_DIR="/app/wwwroot/content/pages"
UPDATES_DIR="/app/wwwroot/content/updates"

# If marker doesn't exist, this is the first container creation
if [ ! -f "$MARKER_FILE" ]; then
    echo "First container creation detected. Copying default content to mounted volumes..."
    
    # Copy default pages to mounted volume (overwrites existing files)
    if [ -d "/app/pages.default" ]; then
        echo "Copying default pages..."
        yes | cp -rf /app/pages.default/. "$PAGES_DIR/" 2>/dev/null || true
        echo "✓ Pages copied successfully"
    fi
    
    # Copy default updates to mounted volume (overwrites existing files)
    if [ -d "/app/updates.default" ]; then
        echo "Copying default updates..."
        yes | cp -rf /app/updates.default/. "$UPDATES_DIR/" 2>/dev/null || true
        echo "✓ Updates copied successfully"
    fi
    
    # Create the marker file to prevent future copies
    mkdir -p /app/data
    touch "$MARKER_FILE"
    echo "$(date)" > "$MARKER_FILE"
    
    echo "Container initialization complete."
else
    echo "Container already initialized. Skipping default content copy."
fi

# Execute the main application command
exec "$@"
