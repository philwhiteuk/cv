#!/bin/bash
set -e

# Build Tailwind CSS initially
npx tailwindcss -i ./src/input.css -o ./assets/css/main.css --minify

# Start Tailwind in watch mode in the background
npx tailwindcss -i ./src/input.css -o ./assets/css/main.css --watch &
TAILWIND_PID=$!

# Start Jekyll server in the foreground
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload --livereload-port 35729

# Cleanup (will run when the container stops)
kill $TAILWIND_PID 2>/dev/null || true
