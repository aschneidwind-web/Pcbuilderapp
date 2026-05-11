# Auto-pull from origin/dev every 15 seconds.
# Run from: C:\Users\Andrew\Documents\pc-builder
# Usage:    .\watch-dev.ps1

$branch = "dev"
$interval = 15

Write-Host "Watching origin/$branch — pulling every $interval seconds. Ctrl+C to stop." -ForegroundColor Cyan

while ($true) {
    $before = git rev-parse HEAD

    git fetch origin $branch --quiet 2>$null
    $remote = git rev-parse "origin/$branch"

    if ($before -ne $remote) {
        Write-Host ""
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] New commits detected — pulling..." -ForegroundColor Yellow
        git merge --ff-only "origin/$branch"
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Up to date. Expo will hot-reload." -ForegroundColor Green
    }

    Start-Sleep -Seconds $interval
}
