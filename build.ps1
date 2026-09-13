$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$output = Join-Path $projectRoot 'dist'
if (Test-Path -LiteralPath $output) { Remove-Item -LiteralPath $output -Recurse -Force }
New-Item -ItemType Directory -Path $output | Out-Null
@('index.html','app.css','nav.css','app.js','manifest.webmanifest','sw.js','app-icon.png') | ForEach-Object {
  Copy-Item -LiteralPath (Join-Path $projectRoot $_) -Destination (Join-Path $output $_)
}
Copy-Item -LiteralPath (Join-Path $projectRoot 'stitch_remix_of_deep_health_ai_mobile_app') -Destination $output -Recurse
Write-Host 'Production build complete: dist/' -ForegroundColor Green
