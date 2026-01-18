# 💰 Economiza.IA - Loja de Créditos Lovable

A melhor loja de créditos Lovable do Brasil com até 86% de desconto!

## 🚀 Tecnologias

Este projeto é construído com:

- **Vite** - Build tool rápido
- **React** + **TypeScript** - Framework e tipagem
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Vercel Serverless Functions** - Backend para pagamentos PIX
- **Cakto API** - Gateway de pagamento PIX
- **n8n Webhook** - Automação de processamento de pedidos

## 📦 Instalação Local

### Pré-requisitos

- Node.js 18+ e npm - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Vercel CLI - `npm install -g vercel`

### Passos

```sh
# 1. Clone o repositório
git clone <YOUR_GIT_URL>

# 2. Entre na pasta do projeto
cd economizaai

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz com:
# CAKTO_CLIENT_ID=seu_client_id
# CAKTO_CLIENT_SECRET=seu_client_secret
# VITE_WEBHOOK_URL=https://seu-n8n.com/webhook

# 5. Inicie o servidor de desenvolvimento
npm run dev:vercel
```

O app estará disponível em `http://localhost:3000`

## 🌐 Deploy no Vercel

### Deploy Automático

Simplesmente faça push para o repositório:

```sh
git add .
git commit -m "Deploy to production"
git push origin main
```

O Vercel detectará automaticamente e fará o deploy.

### Configurar Variáveis de Ambiente

Acesse seu projeto no Vercel → Settings → Environment Variables e adicione:

- `CAKTO_CLIENT_ID` - Client ID da API Cakto
- `CAKTO_CLIENT_SECRET` - Client Secret da API Cakto
- `VITE_WEBHOOK_URL` - URL do webhook n8n

📖 **Guia completo**: Veja [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)

## 🔗 Integração com n8n

Este projeto envia webhooks para o n8n para processar os pedidos automaticamente.

📖 **Documentação completa**: Veja [WEBHOOK-N8N.md](./WEBHOOK-N8N.md)

## 📁 Estrutura do Projeto

```
economizaai/
├── api/                    # Serverless Functions (Vercel)
│   ├── create-pix.ts      # Cria pagamento PIX
│   └── check-pix-status.ts # Verifica status do PIX
├── src/
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas da aplicação
│   ├── hooks/            # Custom hooks
│   └── lib/              # Utilitários
├── public/               # Arquivos estáticos
├── vercel.json           # Configuração Vercel
└── package.json          # Dependências
```

## 🛠️ Scripts Disponíveis

```sh
npm run dev          # Inicia Vite (apenas frontend)
npm run dev:vercel   # Inicia Vercel Dev (frontend + APIs)
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linter
```

⚠️ **Importante**: Use `npm run dev:vercel` em desenvolvimento para testar as APIs de pagamento.

## 🎯 Funcionalidades

- ✅ Catálogo de créditos Lovable
- ✅ Pagamento via PIX (Cakto)
- ✅ Verificação automática de pagamento
- ✅ Integração com n8n para automação
- ✅ PWA (Progressive Web App)
- ✅ Notificações push
- ✅ Painel administrativo
- ✅ Sistema de descontos progressivos
- ✅ Modal de oferta de saída

## 🔐 Segurança

- As credenciais sensíveis (Cakto) ficam apenas no backend
- APIs protegidas por CORS
- Variáveis de ambiente nunca expostas no frontend
- Validação de dados no cliente e servidor

## 📞 Suporte

Para problemas com:
- **Deploy**: Veja [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)
- **Webhook n8n**: Veja [WEBHOOK-N8N.md](./WEBHOOK-N8N.md)
- **Código**: Abra uma issue no GitHub

## How can I edit this code?

**Use Lovable (Recomendado para mudanças visuais)**

Acesse o [Projeto no Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) e comece a fazer prompts.

Mudanças feitas via Lovable são automaticamente commitadas neste repositório.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
