# Push Firebase + admin env vars to the linked Vercel project.
# Prereqs:
#   1. vercel login (account that owns the OSI project)
#   2. vercel link   (select project "osi" under nazifah-anwars-projects)
#   3. firebase-service-account.json in repo root
#
# Usage: .\scripts\setup-vercel-firebase-env.ps1
# Optional: .\scripts\setup-vercel-firebase-env.ps1 -SiteUrl "https://your-domain.vercel.app"

param(
  [string]$SiteUrl = "https://osi-oe7997akv-nazifah-anwars-projects.vercel.app"
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

if (-not (Test-Path ".vercel\project.json")) {
  Write-Host "Run 'vercel link' in the project root first (select the OSI project)." -ForegroundColor Red
  exit 1
}

$saPath = Join-Path $root "firebase-service-account.json"
if (-not (Test-Path $saPath)) {
  Write-Host "Missing firebase-service-account.json — download from Firebase Console → Project settings → Service accounts." -ForegroundColor Red
  exit 1
}

function Read-DotEnvValue([string]$key) {
  $line = Get-Content ".env.local" -ErrorAction SilentlyContinue | Where-Object { $_ -match "^\s*$([regex]::Escape($key))=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return ($line -split "=", 2)[1].Trim()
}

$serviceAccountJson = (Get-Content $saPath -Raw | ConvertFrom-Json | ConvertTo-Json -Compress -Depth 10)

$vars = [ordered]@{
  NEXT_PUBLIC_FIREBASE_API_KEY            = Read-DotEnvValue "NEXT_PUBLIC_FIREBASE_API_KEY"
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        = Read-DotEnvValue "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  NEXT_PUBLIC_FIREBASE_PROJECT_ID         = Read-DotEnvValue "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     = Read-DotEnvValue "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = Read-DotEnvValue "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  NEXT_PUBLIC_FIREBASE_APP_ID             = Read-DotEnvValue "NEXT_PUBLIC_FIREBASE_APP_ID"
  NEXT_PUBLIC_SITE_URL                    = $SiteUrl
  ADMIN_SECRET                            = Read-DotEnvValue "ADMIN_SECRET"
  ADMIN_ALLOWED_EMAILS                    = Read-DotEnvValue "ADMIN_ALLOWED_EMAILS"
  FIREBASE_SERVICE_ACCOUNT_KEY            = $serviceAccountJson
}

$targets = @("production", "preview", "development")

foreach ($entry in $vars.GetEnumerator()) {
  if ([string]::IsNullOrWhiteSpace($entry.Value)) {
    Write-Host "Skip empty: $($entry.Key)" -ForegroundColor Yellow
    continue
  }
  foreach ($target in $targets) {
    Write-Host "Setting $($entry.Key) ($target)..."
    $entry.Value | vercel env add $entry.Key $target --force 2>&1 | Out-Host
  }
}

Write-Host ""
Write-Host "Done. Redeploy: vercel --prod" -ForegroundColor Green
Write-Host "Firebase Console → Authentication → Settings → Authorized domains → add:" -ForegroundColor Cyan
Write-Host "  - your-project.vercel.app"
Write-Host "  - *.vercel.app (or each preview hostname)"
