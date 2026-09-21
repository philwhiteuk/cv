#!/bin/bash
set -e

if [ ! -f ./node_modules/.bin/tailwindcss ]; then
  echo "Installing Tailwind CSS..."
  npm install
fi

echo "Starting Tailwind in watch mode..."
npx tailwindcss -i ./css/main.css -o ./assets/css/main.css --watch=always &
TAILWIND_PID=$!

# Start Jekyll server in the foreground
echo "Starting Jekyll server..."
bundle exec jekyll serve --host 0.0.0.0 --port 8080 --livereload --livereload-port 35729

# Cleanup (will run when the container stops)
kill $TAILWIND_PID 2>/dev/null || true
