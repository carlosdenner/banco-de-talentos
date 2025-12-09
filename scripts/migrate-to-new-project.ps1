# Script para migrar dados do projeto antigo para o novo
# Uso: .\scripts\migrate-to-new-project.ps1

Write-Host "`n=== MIGRACAO PARA NOVO PROJETO SUPABASE ===`n" -ForegroundColor Cyan

# Projeto ANTIGO
$OLD_PROJECT_REF = "pywhtppscqzctzjfzbfe"
$OLD_URL = "https://pywhtppscqzctzjfzbfe.supabase.co"

# Projeto NOVO - PREENCHA AQUI
$NEW_PROJECT_REF = "zppltubgadwwahsnammj"  # Ex: "abcdefghijklmnop"
$NEW_URL = "https://zppltubgadwwahsnammj.supabase.co"          # Ex: "https://abcdefghijklmnop.supabase.co"
$NEW_ANON_KEY = "sb_publishable_V2LAqHYR1vciseRkhTg4Hg_1Lau-WMy"     # Copie do dashboard
$NEW_SERVICE_KEY = "sb_secret_E6InOWk5R-YY1-AvAzy3BQ_raj_lS5p"  # Copie do dashboard (service_role) - COLE A CHAVE COMPLETA AQUI

if (-not $NEW_PROJECT_REF -or -not $NEW_URL -or -not $NEW_ANON_KEY) {
    Write-Host "[!] ERRO: Preencha as credenciais do novo projeto no script!" -ForegroundColor Red
    Write-Host "    Edite o arquivo: scripts\migrate-to-new-project.ps1" -ForegroundColor Yellow
    Write-Host "    E preencha: NEW_PROJECT_REF, NEW_URL, NEW_ANON_KEY, NEW_SERVICE_KEY`n"
    exit 1
}

# Carregar token do .env
$envFile = Join-Path $PSScriptRoot "..\.env"
$accessToken = $null

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^SUPABASE_ACCESS_TOKEN=(.+)$') {
            $accessToken = $matches[1].Trim('"').Trim("'")
        }
    }
}

if (-not $accessToken) {
    Write-Host "[!] SUPABASE_ACCESS_TOKEN nao encontrado no .env" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Exportando dados do projeto antigo..." -ForegroundColor Yellow

# Exportar opportunities
$opportunities = Invoke-RestMethod `
    -Uri "https://api.supabase.com/v1/projects/$OLD_PROJECT_REF/database/query" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    } `
    -Body '{"query": "SELECT * FROM opportunities"}'

Write-Host "   - Opportunities: $($opportunities.Count) registros"

# Exportar applications
$applications = Invoke-RestMethod `
    -Uri "https://api.supabase.com/v1/projects/$OLD_PROJECT_REF/database/query" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    } `
    -Body '{"query": "SELECT * FROM applications"}'

Write-Host "   - Applications: $($applications.Count) registros"

Write-Host "`n[2/5] Criando schema no novo projeto..." -ForegroundColor Yellow

# Ler o schema SQL
$schemaFile = Join-Path $PSScriptRoot "..\supabase\migrations\20250101000000_initial_schema.sql"
if (Test-Path $schemaFile) {
    $schema = Get-Content $schemaFile -Raw
    
    try {
        Invoke-RestMethod `
            -Uri "https://api.supabase.com/v1/projects/$NEW_PROJECT_REF/database/query" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $accessToken"
                "Content-Type" = "application/json"
            } `
            -Body (@{ query = $schema } | ConvertTo-Json)
        
        Write-Host "   - Schema criado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "   - Erro ao criar schema: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   - Arquivo de schema nao encontrado" -ForegroundColor Yellow
}

Write-Host "`n[3/5] Importando dados..." -ForegroundColor Yellow
Write-Host "   - (Implementar importacao de dados se necessario)"

Write-Host "`n[4/5] Atualizando arquivo .env..." -ForegroundColor Yellow

# Backup do .env antigo
Copy-Item $envFile "$envFile.backup" -Force
Write-Host "   - Backup criado: .env.backup"

# Atualizar .env
$newEnvContent = @"
VITE_SUPABASE_URL=$NEW_URL
VITE_SUPABASE_ANON_KEY=$NEW_ANON_KEY
SUPABASE_ACCESS_TOKEN=$accessToken
"@

Set-Content $envFile $newEnvContent
Write-Host "   - Arquivo .env atualizado!" -ForegroundColor Green

Write-Host "`n[5/5] Configurando autenticacao..." -ForegroundColor Yellow

$authConfig = @{
    SITE_URL = "https://carlosdenner.github.io/banco-de-talentos/"
    URI_ALLOW_LIST = "https://carlosdenner.github.io/banco-de-talentos/**,https://carlosdenner.github.io/banco-de-talentos/,https://carlosdenner.github.io/banco-de-talentos,http://localhost:5173/banco-de-talentos/**,http://localhost:5173/banco-de-talentos/,http://localhost:5173/banco-de-talentos"
    MAILER_AUTOCONFIRM = $false
    ENABLE_SIGNUP = $true
} | ConvertTo-Json

try {
    Invoke-RestMethod `
        -Uri "https://api.supabase.com/v1/projects/$NEW_PROJECT_REF/config/auth" `
        -Method PATCH `
        -Headers @{
            "Authorization" = "Bearer $accessToken"
            "Content-Type" = "application/json"
        } `
        -Body $authConfig | Out-Null
    
    Write-Host "   - Configuracao de auth aplicada!" -ForegroundColor Green
} catch {
    Write-Host "   - Erro ao configurar auth: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== MIGRACAO CONCLUIDA ===`n" -ForegroundColor Green
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "1. Teste o cadastro/login na aplicacao"
Write-Host "2. Faca build e deploy: npm run build && git add -A && git commit -m 'chore: update supabase credentials' && git push"
Write-Host "3. Se tudo funcionar, pode deletar o projeto antigo`n"
