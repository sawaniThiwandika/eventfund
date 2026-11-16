# Run Maven inside the backend-dev container. Example: .\scripts\mvn test
$root = Split-Path -Parent $PSScriptRoot
docker compose -f "$root\docker-compose.dev.yml" run --rm backend-dev mvn @args
exit $LASTEXITCODE
