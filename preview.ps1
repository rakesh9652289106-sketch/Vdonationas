Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Donations Platform on http://localhost:3000   " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\frontend"

Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

npm run dev
