# Script para verificar usuario no Supabase
param(
    [string]$Email = "carlosdenner@unb.br"
)

$envFile = Join-Path $PSScriptRoot "..\.env"
$supabaseUrl = $null
$serviceRoleKey = $null

# Carregar variaveis do .env
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^VITE_SUPABASE_URL=(.+)$') {
            $supabaseUrl = $matches[1].Trim('"').Trim("'")
        }
        if ($_ -match '^SUPABASE_SERVICE_ROLE_KEY=(.+)$') {
            $serviceRoleKey = $matches[1].Trim('"').Trim("'")
        }
    }
}

if (-not $supabaseUrl) {
    $supabaseUrl = "https://pywhtppscqzctzjfzbfe.supabase.co"
}

Write-Host "`n[*] Verificando usuario: $Email`n" -ForegroundColor Cyan

# Usar a API REST do Supabase para buscar usuarios (requer service role key)
if ($serviceRoleKey) {
    try {
        $response = Invoke-RestMethod `
            -Uri "$supabaseUrl/auth/v1/admin/users?filter=email.eq.$Email" `
            -Method GET `
            -Headers @{
                "Authorization" = "Bearer $serviceRoleKey"
                "apikey" = $serviceRoleKey
            }
        
        if ($response.users -and $response.users.Count -gt 0) {
            $user = $response.users[0]
            Write-Host "[+] Usuario encontrado!" -ForegroundColor Green
            Write-Host "    ID: $($user.id)"
            Write-Host "    Email: $($user.email)"
            Write-Host "    Email Confirmado: $($user.email_confirmed_at)"
            Write-Host "    Criado em: $($user.created_at)"
            Write-Host "    Ultimo login: $($user.last_sign_in_at)"
        } else {
            Write-Host "[!] Usuario nao encontrado" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[!] Erro ao buscar usuario: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "[!] SUPABASE_SERVICE_ROLE_KEY nao encontrada no .env" -ForegroundColor Yellow
    Write-Host "    Adicione a chave para verificar usuarios"
}
