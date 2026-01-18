# 🚀 Deploy no Vercel - Guia Completo

Este guia explica como fazer o deploy da aplicação no Vercel e configurar as variáveis de ambiente necessárias.

## 📋 Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Credenciais da API Cakto
3. URL do webhook n8n configurado

## 🔧 Configuração das Variáveis de Ambiente no Vercel

### Passo 1: Acessar o Projeto no Vercel

1. Faça login no Vercel
2. Selecione seu projeto `economizaai`
3. Vá em **Settings** → **Environment Variables**

### Passo 2: Adicionar as Variáveis

Configure as seguintes variáveis de ambiente:

#### Credenciais Cakto (obrigatórias)

```
CAKTO_CLIENT_ID=seu_client_id_aqui
CAKTO_CLIENT_SECRET=seu_client_secret_aqui
```

Estas credenciais são usadas pelas serverless functions em `/api/create-pix` e `/api/check-pix-status` para:
- Autenticar na API da Cakto
- Criar pedidos PIX
- Verificar status dos pagamentos

#### Webhook n8n (obrigatório)

```
VITE_WEBHOOK_URL=https://seu-webhook-n8n.com/webhook/pagamento
```

Esta URL é usada para:
- Enviar dados do pedido criado (status: pending)
- Notificar quando o pagamento é confirmado (status: paid)

#### Supabase (opcional - se ainda estiver usando)

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### Passo 3: Aplicar em Todos os Ambientes

Para cada variável adicionada, marque os ambientes onde ela deve estar disponível:
- ✅ Production
- ✅ Preview
- ✅ Development

## 📦 Deploy

### Opção 1: Deploy via Git (Recomendado)

```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

O Vercel detectará automaticamente o push e iniciará o deploy.

### Opção 2: Deploy via CLI

```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Fazer login
vercel login

# Deploy para produção
vercel --prod
```

## 🔍 Verificação Pós-Deploy

Após o deploy, teste:

1. **Criação de PIX**: Tente criar um pagamento PIX
2. **Verifique os logs**: No Vercel, vá em **Functions** → Selecione a função → **Logs**
3. **Teste o webhook**: Confirme que o n8n está recebendo os dados

## 🐛 Troubleshooting

### Erro 404 em /api/create-pix

**Causa**: As serverless functions não estão sendo reconhecidas.

**Solução**:
1. Verifique se o arquivo `vercel.json` existe na raiz
2. Confirme que a pasta `api/` contém os arquivos `.ts`
3. Redeploye o projeto

### Erro de autenticação Cakto

**Causa**: Credenciais não configuradas ou incorretas.

**Solução**:
1. Vá em Settings → Environment Variables no Vercel
2. Verifique se `CAKTO_CLIENT_ID` e `CAKTO_CLIENT_SECRET` estão corretos
3. Redeploy após adicionar/corrigir as variáveis

### Webhook não está sendo chamado

**Causa**: URL do webhook incorreta ou n8n offline.

**Solução**:
1. Verifique se `VITE_WEBHOOK_URL` está correto no Vercel
2. Teste o webhook diretamente (pode usar Postman)
3. Verifique os logs da função no Vercel

## 📁 Estrutura de Arquivos Importantes

```
economizaai/
├── api/
│   ├── create-pix.ts       # Cria PIX via Cakto
│   └── check-pix-status.ts # Verifica status do PIX
├── vercel.json             # Configuração de rewrites
├── .env.example            # Exemplo de variáveis
└── DEPLOY-VERCEL.md        # Este arquivo
```

## 🔐 Segurança

- ✅ Nunca commite o arquivo `.env` com credenciais reais
- ✅ Use apenas variáveis de ambiente do Vercel em produção
- ✅ As credenciais Cakto só são acessíveis no backend (serverless functions)
- ✅ O frontend só vê `VITE_WEBHOOK_URL` (não é sensível)

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Vercel Dashboard
2. Teste as APIs localmente com `npm run dev:vercel`
3. Confirme que todas as variáveis estão configuradas

---

**Última atualização**: 18 de Janeiro de 2026
