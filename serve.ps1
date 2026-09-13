param([int]$Port = 4173, [string]$Root = $PSScriptRoot)
$ErrorActionPreference = 'Stop'
$rootPath = (Resolve-Path -LiteralPath $Root).Path
Write-Host "Deep Health AI prototype: http://localhost:$Port" -ForegroundColor Cyan
python -m http.server $Port --bind 127.0.0.1 --directory $rootPath
