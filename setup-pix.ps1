# Script de configuração da integração PIX
# Execute este script após clonar o projeto (PowerShell)

Write-Host "🚀 Configurando integração PIX para Economiza.IA" -ForegroundColor Green
Write-Host ""

# 1. Criar arquivo .env.local
Write-Host "📝 Criando arquivo .env.local..." -ForegroundColor Yellow

$envContent = @"
# Credenciais da API de Pagamento PIX
PAYMENT_CLIENT_ID=oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ
PAYMENT_CLIENT_SECRET=UXtdFNN3NVJTtMc5HkppxmgAMQPPcH42fqFHghYWbMbMDJ6SwIc6wOc5M6voFbnQvLY6zFJLqhVeLiDsPWeaTPzTUo12YYxlZagB5mGImNIdP75XXQWVoBPjwEd2u4cG

# URL da API de Pagamento
PAYMENT_API_URL=https://api.openpix.com.br/api/v1
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
Write-Host ""

# 2. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o servidor de desenvolvimento, execute:"
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para fazer deploy na Vercel:" -ForegroundColor Yellow
Write-Host "  1. Configure as variáveis de ambiente no painel da Vercel"
Write-Host "  2. Execute: vercel --prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Leia INTEGRACAO-PIX.md para mais informações" -ForegroundColor Magenta
