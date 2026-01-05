#!/bin/sh
set -e

UPDATES_DIR="/app/wwwroot/content/updates"

# Only copy default updates if the directory is empty (first run)
if [ -d "/app/updates.default" ] && [ -z "$(ls -A "$UPDATES_DIR" 2>/dev/null)" ]; then
    echo "Initializing updates directory with defaults..."
    cp -rf /app/updates.default/. "$UPDATES_DIR/"
    echo "✓ Updates initialized"
fi

# Execute the main application command
exec "$@"

# Execute the main application command
exec "$@"
