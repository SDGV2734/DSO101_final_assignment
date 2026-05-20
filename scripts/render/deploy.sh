#!/usr/bin/env bash
set -euo pipefail

required_vars=(
  RENDER_BACKEND_DEPLOY_HOOK
  RENDER_FRONTEND_DEPLOY_HOOK
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Missing required environment variable: ${var_name}" >&2
    exit 1
  fi
done

curl -fsS -X POST "${RENDER_BACKEND_DEPLOY_HOOK}"
curl -fsS -X POST "${RENDER_FRONTEND_DEPLOY_HOOK}"

echo "Render deploy hooks triggered successfully."
