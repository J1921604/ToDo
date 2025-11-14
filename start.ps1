# React Todo App - ワンコマンド起動スクリプト
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  React Todo App - ワンコマンド起動" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# スクリプトのディレクトリに移動
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# 1. 依存関係確認
Write-Host "[1/3] 依存関係を確認中..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules")) {
    Write-Host "   依存関係をインストール中..." -ForegroundColor Gray
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   エラー: npm install に失敗しました" -ForegroundColor Red
        Read-Host "Enterキーを押して終了"
        exit 1
    }
}
Write-Host "   完了" -ForegroundColor Green
Write-Host ""

# 2. 開発サーバー起動
Write-Host "[2/3] 開発サーバーを起動中..." -ForegroundColor Yellow
Write-Host "   ディレクトリ: $scriptDir" -ForegroundColor Gray

$job = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $scriptDir

# サーバー起動を待つ（最大30秒）
$maxWait = 30
$waited = 0
$serverReady = $false

Write-Host "   サーバー起動を待機中..." -ForegroundColor Gray
while ($waited -lt $maxWait -and -not $serverReady) {
    Start-Sleep -Seconds 1
    $waited++
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:1234" -TimeoutSec 1 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $serverReady = $true
            Write-Host "   サーバーが起動しました！" -ForegroundColor Green
        }
    } catch {
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
}

Write-Host ""
if (-not $serverReady) {
    Write-Host "   警告: サーバー起動の確認ができませんでした" -ForegroundColor Yellow
    Write-Host "   サーバーは起動処理中です。ブラウザで確認してください。" -ForegroundColor Yellow
}
Write-Host "   完了" -ForegroundColor Green
Write-Host ""
# 3. ブラウザ起動
Write-Host "[3/3] ブラウザを起動中..." -ForegroundColor Yellow
Write-Host ""
Start-Process "http://localhost:1234/"
Write-Host "   完了" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ✅ 起動完了！" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ ブラウザで http://localhost:1234/ が開きました" -ForegroundColor Green
Write-Host "📝 停止方法: taskkill /F /IM node.exe" -ForegroundColor Yellow
Write-Host ""
Write-Host "5秒後にこのウィンドウを閉じます..." -ForegroundColor Cyan
Start-Sleep -Seconds 5
exit
