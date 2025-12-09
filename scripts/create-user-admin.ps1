# Script para criar usuario via Admin API (bypass do signup com erro 500)
param(
    [Parameter(Mandatory=$true)]
    [string]$Email,
    
    [Parameter(Mandatory=$true)]
    [string]$Password
)

$envFile = Join-Path $PSScriptRoot "..\.env"
$supabaseUrl = $null
$anonKey = $null

# Carregar variaveis do .env
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^VITE_SUPABASE_URL=(.+)$') {
            $supabaseUrl = $matches[1].Trim('"').Trim("'")
        }
        if ($_ -match '^VITE_SUPABASE_ANON_KEY=(.+)$') {
            $anonKey = $matches[1].Trim('"').Trim("'")
        }
    }
}

if (-not $supabaseUrl) {
    $supabaseUrl = "https://pywhtppscqzctzjfzbfe.supabase.co"
}

Write-Host "`n[*] Criando usuario: $Email`n" -ForegroundColor Cyan

# Usar service role key para criar usuario via Admin API
$token = (Get-Content $envFile | Where-Object { $_ -match '^SUPABASE_ACCESS_TOKEN=' }) -replace 'SUPABASE_ACCESS_TOKEN=', ''

if ($token) {
    try {
        # Criar usuario diretamente no banco
        $query = "INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token) VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', '$Email', crypt('$Password', gen_salt('bf')), NOW(), NOW(), NOW(), '') RETURNING id, email, email_confirmed_at"
        
        $body = @{ query = $query } | ConvertTo-Json
        
        $response = Invoke-RestMethod `
            -Uri "https://api.supabase.com/v1/projects/pywhtppscqzctzjfzbfe/database/query" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            } `
            -Body $body
        
        Write-Host "[+] Usuario criado com sucesso!" -ForegroundColor Green
        Write-Host "    Email: $Email"
        Write-Host "    Pode fazer login imediatamente (email ja confirmado)"
        
    } catch {
        Write-Host "[!] Erro ao criar usuario: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "[!] SUPABASE_ACCESS_TOKEN nao encontrado no .env" -ForegroundColor Yellow
}
