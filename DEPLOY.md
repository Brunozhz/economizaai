# 🚀 Deploy - Economiza.IA

## Último Deploy: Verificação de Pagamento Segura

### Alterações Importantes

1. **Novo endpoint `/api/check-status`** ✅
   - Executa 100% no servidor (Vercel)
   - Usa `process.env.PUSHINPAY_API_KEY` (seguro)
   - Autentica com Bearer Token
   - Nunca expõe chaves para o frontend

2. **Frontend atualizado** ✅
   - Agora chama `/api/check-status` em vez de endpoint antigo
   - Polling a cada 3 segundos
   - Tratamento de erros silencioso

3. **Persistência do PIX** ✅
   - Salva estado no sessionStorage
   - Modal reabre com QR Code se sair e voltar

### Após o Deploy

1. **Limpar cache do navegador:**
   ```
   Ctrl + Shift + Del (Chrome/Edge)
   Ou fazer Hard Refresh: Ctrl + Shift + R
   ```

2. **Verificar logs no Vercel:**
   ```
   Vercel Dashboard → Projeto → Logs
   Procurar por: [API CHECK-STATUS]
   ```

3. **Testar endpoint:**
   ```
   https://seu-dominio.com/api/check-status?correlationID=test
   ```

### Variáveis de Ambiente Necessárias

Configure no painel da Vercel (Settings → Environment Variables):

```env
PUSHINPAY_API_KEY=seu_bearer_token_aqui
PUSHINPAY_API_URL=https://api.pushinpay.com.br/api
WEBHOOK_URL=https://n8n.infinityunlocker.com.br/webhook-test/e2bdd7b8-2639-4ea8-8800-64f2e92b5401
```

### Estrutura de API Routes

```
api/
├── check-status.ts           ✅ NOVO - Use este
├── check-pix-status-pushinpay.ts  (compatibilidade)
├── create-pix-pushinpay.ts
├── send-webhook.ts
└── README.md
```

### Fluxo de Verificação

```
Frontend (Browser)
    ↓ GET /api/check-status?correlationID=xxx
Vercel Edge Function (Servidor Seguro)
    ↓ GET https://api.pushinpay.com.br/api/transaction/xxx
    ↓ Authorization: Bearer [CHAVE_SEGURA]
PushinPay API
    ↓ Responde status completo
Vercel
    ↓ Filtra e retorna apenas essencial
    ↓ { status: "paid", isPaid: true }
Frontend
```

### Comandos para Deploy

```bash
# Commit e push
git add .
git commit -m "feat: verificação segura via servidor"
git push origin main

# Vercel faz deploy automático
```

### Checklist Pós-Deploy

- [ ] Limpar cache do navegador
- [ ] Testar geração de PIX
- [ ] Verificar polling a cada 3 segundos
- [ ] Confirmar que não há erros 404
- [ ] Testar persistência ao sair e voltar
- [ ] Verificar webhook sendo enviado
- [ ] Testar pagamento completo

### Problemas Conhecidos

❌ **Erro 404 em `/api/check-pix-status-pushinpay`**
- **Causa:** Cache do navegador com build antigo
- **Solução:** Ctrl + Shift + Del ou Ctrl + Shift + R

❌ **CORS no webhook**
- **Causa:** Chamada direta do frontend
- **Solução:** Já implementado `/api/send-webhook` (proxy)

### Suporte

Para verificar se o deploy funcionou:
1. Abra DevTools (F12)
2. Vá em Network
3. Filtre por "check-status"
4. Deve aparecer requisições para `/api/check-status` (não mais check-pix-status-pushinpay)

---

**Versão:** 2.0  
**Data:** 2025-01-18  
**Status:** ✅ Pronto para produção
