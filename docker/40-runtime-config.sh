#!/bin/sh
# Runs on container start (nginx image executes /docker-entrypoint.d/*.sh).
# Writes config.json from env vars set in the ECS task definition, so one image
# works in every environment.
set -eu

cat > /usr/share/nginx/html/config.json <<JSON
{
  "appEnv": "${APP_ENV:-local}",
  "apiUrl": "${API_URL:-}"
}
JSON

echo "runtime-config: APP_ENV=${APP_ENV:-local} API_URL=${API_URL:-}"
