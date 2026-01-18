#!/bin/bash

# Script de configuração da integração PIX
# Execute este script após clonar o projeto

echo "🚀 Configurando integração PIX para Economiza.IA"
echo ""

# 1. Criar arquivo .env.local
echo "📝 Criando arquivo .env.local..."
cat > .env.local << 'EOF'
# Credenciais da API de Pagamento PIX
PAYMENT_CLIENT_ID=oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ
PAYMENT_CLIENT_SECRET=UXtdFNN3NVJTtMc5HkppxmgAMQPPcH42fqFHghYWbMbMDJ6SwIc6wOc5M6voFbnQvLY6zFJLqhVeLiDsPWeaTPzTUo12YYxlZagB5mGImNIdP75XXQWVoBPjwEd2u4cG

# URL da API de Pagamento
PAYMENT_API_URL=https://api.openpix.com.br/api/v1
EOF

echo "✅ Arquivo .env.local criado com sucesso!"
echo ""

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo ""
echo "✅ Configuração concluída!"
echo ""
echo "Para iniciar o servidor de desenvolvimento, execute:"
echo "  npm run dev"
echo ""
echo "Para fazer deploy na Vercel:"
echo "  1. Configure as variáveis de ambiente no painel da Vercel"
echo "  2. Execute: vercel --prod"
echo ""
echo "📖 Leia INTEGRACAO-PIX.md para mais informações"
