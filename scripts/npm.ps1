# Run npm inside the frontend-dev container. Example: .\scripts\npm install
$root = Split-Path -Parent $PSScriptRoot
docker compose -f "$root\docker-compose.dev.yml" run --rm frontend-dev npm @args
exit $LASTEXITCODE
