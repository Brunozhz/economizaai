# 🔧 Correção Aplicada - Erro 401

## ❌ Problema Identificado

Erro HTTP 401 (Não autorizado) ao tentar gerar PIX:

```
Failed to load resource: the server responded with a status of 401 ()
Erro ao criar pagamento PIX: Error: Falha ao criar cobrança PIX
```

## ✅ Solução Aplicada

### O que estava errado:

A API OpenPix usa um sistema de autenticação específico. Estávamos usando o `PAYMENT_CLIENT_SECRET` no header `Authorization`, mas a OpenPix na verdade requer o **`PAYMENT_CLIENT_ID`** (também chamado de AppID).

### O que foi corrigido:

**Arquivo: `api/create-pix.ts`**
```typescript
// ANTES (ERRADO):
headers: {
  'Authorization': clientSecret,  // ❌ Estava usando o SECRET
  'Content-Type': 'application/json',
}

// DEPOIS (CORRETO):
headers: {
  'Authorization': clientId,  // ✅ Agora usa o CLIENT_ID (AppID)
  'Content-Type': 'application/json',
}
```

**Arquivo: `api/check-pix-status.ts`**
```typescript
// Mesma correção aplicada
```

## 📝 Detalhes Técnicos

A OpenPix usa o seguinte formato de autenticação:
- **Header:** `Authorization`
- **Valor:** O AppID (que corresponde ao `PAYMENT_CLIENT_ID`)
- **Não usa:** Bearer token ou CLIENT_SECRET no header

## 🧪 Como Testar Novamente

1. **Certifique-se de que o arquivo `.env.local` existe** com:
   ```env
   PAYMENT_CLIENT_ID=oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ
   PAYMENT_CLIENT_SECRET=UXtdFNN3NVJTtMc5HkppxmgAMQPPcH42fqFHghYWbMbMDJ6SwIc6wOc5M6voFbnQvLY6zFJLqhVeLiDsPWeaTPzTUo12YYxlZagB5mGImNIdP75XXQWVoBPjwEd2u4cG
   PAYMENT_API_URL=https://api.openpix.com.br/api/v1
   ```

2. **Se estiver rodando localmente**, reinicie o servidor:
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

3. **Se estiver em produção (Vercel)**, faça redeploy:
   - As variáveis de ambiente já devem estar configuradas
   - Faça um novo deploy para aplicar as mudanças no código

4. **Teste novamente:**
   - Acesse o site
   - Clique em qualquer plano
   - Clique em "Comprar Agora"
   - Clique em "Gerar PIX"
   - **Agora deve funcionar!** ✅

## 🎯 O que esperar agora:

Após a correção, você deve ver:
- ✅ QR Code aparecendo
- ✅ Código PIX Copia e Cola
- ✅ Timer de expiração
- ✅ Sem erros 401 no console

## 📚 Referência da API OpenPix

Documentação oficial sobre autenticação:
https://developers.openpix.com.br/docs/apis/api-getting-started

```
Authorization: {SEU_APP_ID}
```

## 🐛 Se ainda houver problemas:

1. **Verifique se as credenciais são válidas:**
   - Acesse o painel OpenPix
   - Confirme que o AppID está correto

2. **Verifique os logs:**
   ```bash
   # Console do navegador (F12)
   # Logs da Vercel (se em produção)
   ```

3. **Teste a API diretamente:**
   ```bash
   curl -X POST https://api.openpix.com.br/api/v1/charge \
     -H "Authorization: oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ" \
     -H "Content-Type: application/json" \
     -d '{
       "correlationID": "TEST_123",
       "value": 1000,
       "comment": "Teste"
     }'
   ```

## ✅ Status da Correção

- [x] Identificado o problema (autenticação incorreta)
- [x] Corrigido `api/create-pix.ts`
- [x] Corrigido `api/check-pix-status.ts`
- [x] Documentação atualizada
- [x] Sem erros de linting
- [ ] Aguardando teste do usuário

---

**Data:** 18/01/2026
**Erro:** HTTP 401 Unauthorized
**Causa:** Uso incorreto do CLIENT_SECRET ao invés do CLIENT_ID
**Solução:** Alterado para usar CLIENT_ID (AppID) no header Authorization
**Status:** ✅ Corrigido
