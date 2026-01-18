# ✅ Checklist de Deploy - Economiza.IA

Use este checklist antes de fazer deploy para garantir que tudo está configurado.

## 📋 Pré-Deploy

### 1. Código
- [ ] Todas as alterações foram commitadas
- [ ] Não há arquivos `.env` no repositório (apenas `.env.example`)
- [ ] Pasta `api/` contém `create-pix.ts` e `check-pix-status.ts`
- [ ] Arquivo `vercel.json` existe na raiz

### 2. Credenciais Cakto
- [ ] Você tem o `CAKTO_CLIENT_ID`
- [ ] Você tem o `CAKTO_CLIENT_SECRET`
- [ ] As credenciais foram testadas (opcional: teste local com `vercel dev`)

### 3. Webhook n8n
- [ ] n8n está configurado e rodando
- [ ] URL do webhook está acessível publicamente
- [ ] Workflow do n8n está ativo
- [ ] Você testou o webhook com cURL (ver WEBHOOK-N8N.md)

## 🚀 Durante o Deploy

### 1. Configurar Vercel
- [ ] Projeto está vinculado ao repositório Git
- [ ] Build command: `npm run build` (padrão)
- [ ] Output directory: `dist` (padrão)
- [ ] Framework Preset: `Vite` (detectado automaticamente)

### 2. Adicionar Environment Variables

No Vercel Dashboard → Settings → Environment Variables:

- [ ] `CAKTO_CLIENT_ID` - [Production] [Preview] [Development]
- [ ] `CAKTO_CLIENT_SECRET` - [Production] [Preview] [Development]
- [ ] `VITE_WEBHOOK_URL` - [Production] [Preview] [Development]

⚠️ **Importante**: Marque todos os 3 ambientes para cada variável!

### 3. Deploy
- [ ] Fazer push para `main` ou clicar em "Deploy" no Vercel
- [ ] Aguardar build completar (normalmente 1-2 minutos)

## ✅ Pós-Deploy

### 1. Verificações Básicas
- [ ] Site carrega corretamente
- [ ] Produtos são exibidos
- [ ] Modal de checkout abre

### 2. Testar Pagamento PIX
- [ ] Clicar em "Comprar agora" em um produto
- [ ] Preencher formulário
- [ ] Clicar em "Gerar PIX"
- [ ] QR Code é exibido (não precisa pagar, só verificar se gera)

### 3. Verificar Logs
Acesse Vercel Dashboard → Functions → Logs

- [ ] Função `create-pix` executou sem erros
- [ ] Logs mostram: "Creating PIX payment via Cakto"
- [ ] Logs mostram: "Sending webhook to n8n"
- [ ] Logs mostram: "Webhook response status: 200" (ou similar)

### 4. Verificar n8n
- [ ] n8n recebeu o webhook com status "pending"
- [ ] Dados estão completos no webhook
- [ ] Workflow executou corretamente

## 🐛 Troubleshooting

### ❌ Erro: "404 - Not Found" ao gerar PIX

**Causa**: Serverless functions não foram deployadas

**Solução**:
1. Verifique se a pasta `api/` está no repositório
2. Verifique se `vercel.json` existe
3. Force um novo deploy: `git commit --allow-empty -m "Redeploy" && git push`

### ❌ Erro: "Credenciais Cakto não configuradas"

**Causa**: Environment variables não foram adicionadas

**Solução**:
1. Vá em Vercel → Settings → Environment Variables
2. Adicione `CAKTO_CLIENT_ID` e `CAKTO_CLIENT_SECRET`
3. Redeploy: Deployments → [...] → Redeploy

### ❌ Erro: "Webhook URL not configured"

**Causa**: `VITE_WEBHOOK_URL` não foi configurado

**Solução**:
1. Adicione `VITE_WEBHOOK_URL` nas Environment Variables
2. Redeploy

### ❌ Webhook não chega no n8n

**Possíveis causas**:

1. **n8n não está acessível**
   - Teste: `curl https://seu-n8n.com/webhook/pagamento`
   - Deve retornar algo (não 404)

2. **URL incorreta**
   - Verifique se `VITE_WEBHOOK_URL` está correta
   - Não pode ter espaços ou caracteres especiais

3. **n8n workflow não está ativo**
   - Verifique se o workflow está ativo no n8n
   - Teste com cURL (ver WEBHOOK-N8N.md)

## 📊 Monitoramento Contínuo

### Diariamente
- [ ] Verificar logs de erros no Vercel
- [ ] Confirmar que webhooks chegam no n8n
- [ ] Testar geração de PIX

### Semanalmente
- [ ] Revisar taxa de sucesso de pagamentos
- [ ] Verificar se há erros recorrentes
- [ ] Testar fluxo completo (criar PIX + pagar)

## 🎉 Deploy Concluído!

Se você chegou até aqui e todos os itens estão ✅, parabéns! Seu sistema está pronto para processar pagamentos.

---

**Data**: _________
**Deploy por**: _________
**Notas**: _________

---

**Próximos passos**:
1. Configurar domínio customizado (opcional)
2. Adicionar Google Analytics (opcional)
3. Configurar monitoramento de uptime (opcional)
