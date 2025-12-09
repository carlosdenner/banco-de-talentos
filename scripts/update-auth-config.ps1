# Script PowerShell para atualizar configuracoes de autenticacao do Supabase
# Uso: .\scripts\update-auth-config.ps1

$PROJECT_REF = "pywhtppscqzctzjfzbfe"
$SITE_URL = "https://carlosdenner.github.io/banco-de-talentos/"
$REDIRECT_URLS = "https://carlosdenner.github.io/banco-de-talentos/**,http://localhost:5173/banco-de-talentos/**,https://carlosdenner.github.io/banco-de-talentos,http://localhost:5173/banco-de-talentos"

Write-Host "`n[*] Atualizando configuracoes de autenticacao...`n" -ForegroundColor Cyan

Write-Host "[i] Configuracoes a serem aplicadas:" -ForegroundColor Yellow
Write-Host "   Site URL: $SITE_URL"
Write-Host "   Redirect URLs:"
Write-Host "     - https://carlosdenner.github.io/banco-de-talentos/**"
Write-Host "     - http://localhost:5173/banco-de-talentos/**"
Write-Host ""

# Tentar carregar o token do arquivo .env
$envFile = Join-Path $PSScriptRoot "..\\.env"
$accessToken = $env:SUPABASE_ACCESS_TOKEN

if (-not $accessToken -and (Test-Path $envFile)) {
    Write-Host "[i] Carregando token do arquivo .env..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^SUPABASE_ACCESS_TOKEN=(.+)$') {
            $accessToken = $matches[1].Trim('"').Trim("'")
        }
    }
}

# Verificar se o token existe
if (-not $accessToken) {
    Write-Host "[!] ATENCAO:" -ForegroundColor Yellow
    Write-Host "   Este script requer um Access Token da Management API do Supabase.`n"
    Write-Host "   Para obter o token:" -ForegroundColor White
    Write-Host "   1. Acesse: https://supabase.com/dashboard/account/tokens"
    Write-Host "   2. Clique em 'Generate new token'"
    Write-Host "   3. Adicione no arquivo .env:"
    Write-Host "      SUPABASE_ACCESS_TOKEN=seu-token-aqui" -ForegroundColor Green
    Write-Host "   4. Execute este script novamente:`n      .\scripts\update-auth-config.ps1`n" -ForegroundColor Green
    exit 1
}

Write-Host "[+] Token encontrado. Enviando requisicao...`n" -ForegroundColor Green

# Preparar o body JSON
$body = @{
    SITE_URL = $SITE_URL
    URI_ALLOW_LIST = $REDIRECT_URLS
    MAILER_AUTOCONFIRM = $false
    ENABLE_SIGNUP = $true
} | ConvertTo-Json

# Fazer a requisicao
try {
    $response = Invoke-RestMethod `
        -Uri "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" `
        -Method PATCH `
        -Headers @{
            "Authorization" = "Bearer $accessToken"
            "Content-Type" = "application/json"
        } `
        -Body $body
    
    Write-Host "[+] Configuracoes atualizadas com sucesso!`n" -ForegroundColor Green
    Write-Host "[i] Proximos passos:" -ForegroundColor Yellow
    Write-Host "   1. Teste o fluxo de cadastro novamente"
    Write-Host "   2. Verifique se o link de confirmacao funciona"
    Write-Host "   3. O link deve redirecionar para: $SITE_URL`n"
    
} catch {
    Write-Host "[!] Erro ao atualizar configuracoes:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nDetalhes do erro:" -ForegroundColor Yellow
    Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    exit 1
}
