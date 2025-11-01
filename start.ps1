Write-Host "Starting ELMS Backend Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Please wait while the server starts..." -ForegroundColor Yellow
Write-Host ""

Set-Location "backend"
npm start

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
