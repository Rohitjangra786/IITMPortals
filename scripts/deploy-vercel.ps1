# One-shot Turso + Vercel setup/deploy for the JAC Inspection Portal.
#
# Run this in YOUR terminal (PowerShell) — it will open browser logins for
# Turso and Vercel, which only you can complete:
#
#   powershell -ExecutionPolicy Bypass -File scripts/deploy-vercel.ps1
#
# Prereqs (installed automatically if missing): Vercel CLI (npm), Turso CLI.

$ErrorActionPreference = "Stop"
$DB = "iitm-portals"

# Generate a fresh strong AUTH_SECRET at runtime (never committed).
$AUTH_SECRET = (node -e "console.log(require('crypto').randomBytes(48).toString('hex'))").Trim()

function Have($cmd) { $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue) }

# --- 1. Ensure CLIs ---
if (-not (Have "vercel")) {
  Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
  npm install -g vercel
}
if (-not (Have "turso")) {
  Write-Host "Installing Turso CLI..." -ForegroundColor Cyan
  # Turso on Windows: easiest via Scoop, else see https://docs.turso.tech/cli/installation
  if (Have "scoop") { scoop install turso }
  else { irm https://get.tur.so/install.ps1 | iex }
}

# --- 2. Turso: login + create DB from local SQLite + get URL & token ---
Write-Host "`n== Turso login (browser) ==" -ForegroundColor Yellow
turso auth login

Write-Host "`nPushing local schema to prisma/dev.db..." -ForegroundColor Cyan
npm run db:push

Write-Host "Creating Turso DB '$DB' from prisma/dev.db..." -ForegroundColor Cyan
try { turso db create $DB --from-file prisma/dev.db }
catch { Write-Host "DB '$DB' may already exist — continuing." -ForegroundColor DarkYellow }

$TURSO_URL   = (turso db show $DB --url).Trim()
$TURSO_TOKEN = (turso db tokens create $DB).Trim()
Write-Host "TURSO_DATABASE_URL = $TURSO_URL" -ForegroundColor Green

# --- 3. Vercel: login + link + env + deploy ---
Write-Host "`n== Vercel login (browser) ==" -ForegroundColor Yellow
vercel login
vercel link            # pick / create the project for this repo

function Set-VercelEnv($name, $value) {
  foreach ($env in @("production", "preview", "development")) {
    vercel env rm $name $env -y 2>$null | Out-Null
    $value | vercel env add $name $env | Out-Null
  }
  Write-Host "  set $name" -ForegroundColor Green
}

Write-Host "`nSetting environment variables on Vercel..." -ForegroundColor Cyan
Set-VercelEnv "TURSO_DATABASE_URL" $TURSO_URL
Set-VercelEnv "TURSO_AUTH_TOKEN"   $TURSO_TOKEN
Set-VercelEnv "AUTH_SECRET"        $AUTH_SECRET

Write-Host "`nDeploying to production..." -ForegroundColor Cyan
vercel --prod

Write-Host "`nDone. Your portal is live with Turso connected." -ForegroundColor Green
