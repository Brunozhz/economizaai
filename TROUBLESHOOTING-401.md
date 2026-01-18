# 🔍 Troubleshooting - Erro 401 (Não Autorizado)

## ⚠️ Problema

Você está recebendo o erro HTTP 401 ao tentar gerar um PIX:

```
Failed to load resource: the server responded with a status of 401 ()
Erro ao criar pagamento PIX: Error: Falha ao criar cobrança PIX
```

## 🔍 Diagnóstico Passo a Passo

### 1. Verificar se o Deploy foi Atualizado

**O erro 401 pode estar ocorrendo porque o código em produção ainda está com a versão antiga.**

#### Como verificar:

1. **Veja a data/hora do último deploy na Vercel:**
   - Acesse o dashboard da Vercel
   - Veja quando foi o último deploy
   - Se foi ANTES da correção, você precisa fazer um novo deploy

2. **Verifique os logs da Vercel:**
   - Acesse: Dashboard → Seu Projeto → Deployments → Clique no último deploy
   - Veja se há erros nos logs
   - Procure por mensagens como "Credenciais de pagamento não configuradas"

#### Solução:

```bash
# Faça commit e push das mudanças
git add api/create-pix.ts api/check-pix-status.ts
git commit -m "fix: corrige autenticação OpenPix com CLIENT_ID"
git push

# Aguarde o deploy automático na Vercel
# OU force um novo deploy manualmente
```

### 2. Verificar Variáveis de Ambiente na Vercel

**As variáveis de ambiente podem não estar configuradas corretamente.**

#### Como verificar:

1. Acesse: **Vercel Dashboard** → Seu Projeto → **Settings** → **Environment Variables**

2. Verifique se TODAS estas variáveis existem:
   - ✅ `PAYMENT_CLIENT_ID` = `oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ`
   - ✅ `PAYMENT_CLIENT_SECRET` = `UXtdFNN3NVJTtMc5HkppxmgAMQPPcH42fqFHghYWbMbMDJ6SwIc6wOc5M6voFbnQvLY6zFJLqhVeLiDsPWeaTPzTUo12YYxlZagB5mGImNIdP75XXQWVoBPjwEd2u4cG`
   - ✅ `PAYMENT_API_URL` = `https://api.openpix.com.br/api/v1`

3. Verifique se estão configuradas para o ambiente correto:
   - ✅ Production
   - ✅ Preview (opcional, mas recomendado)
   - ✅ Development (opcional)

#### Solução:

1. Adicione/atualize as variáveis se estiverem faltando ou incorretas
2. **IMPORTANTE:** Após adicionar/atualizar, faça um **novo deploy**
   - Vercel não atualiza variáveis em deploys existentes automaticamente
   - Você precisa fazer um redeploy para que as variáveis sejam carregadas

### 3. Verificar se o CLIENT_ID está Correto

**O AppID/CLIENT_ID pode estar incorreto ou inválido.**

#### Como verificar:

1. Acesse o painel da OpenPix: https://app.openpix.com.br/
2. Vá em **Configurações** ou **API**
3. Verifique o **AppID** (deve ser igual ao `PAYMENT_CLIENT_ID`)

#### Solução:

- Se o AppID estiver diferente, atualize a variável `PAYMENT_CLIENT_ID` na Vercel
- Faça um novo deploy após atualizar

### 4. Verificar Logs Detalhados

**Os logs podem revelar mais informações sobre o erro.**

#### Como verificar:

1. **Logs da Vercel:**
   - Acesse: Dashboard → Seu Projeto → Deployments → Clique no último deploy
   - Clique em **Functions** → `/api/create-pix`
   - Veja os logs em tempo real

2. **Console do Navegador:**
   - Abra o DevTools (F12)
   - Aba **Network**
   - Tente gerar um PIX novamente
   - Clique na requisição `/api/create-pix`
   - Veja a aba **Response** para ver a mensagem de erro completa

#### O que procurar nos logs:

```
✅ Bom sinal:
"Criando cobrança PIX: { correlationID: '...', value: ..., clientIdPresent: true }"

❌ Problema:
"Credenciais de pagamento não configuradas"
"Criando cobrança PIX: { ..., clientIdPresent: false }"
```

### 5. Testar a API OpenPix Diretamente

**Teste se as credenciais funcionam diretamente com a API OpenPix.**

#### Teste com cURL:

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

#### Respostas esperadas:

- ✅ **200/201**: Credenciais estão corretas, problema está no código/deploy
- ❌ **401**: Credenciais estão incorretas, verifique o AppID
- ❌ **403**: AppID pode estar inativo ou sem permissões
- ❌ **400**: Formato da requisição pode estar errado

### 6. Limpar Cache e Testar Novamente

**O navegador pode estar usando uma versão antiga do código.**

#### Solução:

1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Ou abra em **Modo Anônimo/Privado**
3. Ou force refresh: **Ctrl+Shift+R** (Windows) ou **Cmd+Shift+R** (Mac)

## ✅ Checklist de Verificação Rápida

Use este checklist para diagnosticar o problema:

- [ ] Código foi atualizado (usando `clientId` no header `Authorization`)
- [ ] Deploy foi feito APÓS a correção
- [ ] Variáveis de ambiente estão configuradas na Vercel
- [ ] `PAYMENT_CLIENT_ID` está correto (igual ao AppID da OpenPix)
- [ ] Redeploy foi feito após atualizar variáveis de ambiente
- [ ] Cache do navegador foi limpo
- [ ] Teste direto na API OpenPix funcionou

## 🚀 Solução Rápida (Mais Comum)

**Na maioria dos casos, o problema é que o deploy não foi atualizado.**

### Passo 1: Verificar Variáveis de Ambiente

1. Vercel Dashboard → Settings → Environment Variables
2. Confirme que `PAYMENT_CLIENT_ID` está configurada

### Passo 2: Fazer Novo Deploy

```bash
# Opção A: Deploy via Git (recomendado)
git add .
git commit -m "fix: atualiza autenticação OpenPix"
git push origin main  # ou sua branch

# Opção B: Deploy manual via CLI
vercel --prod
```

### Passo 3: Aguardar Deploy Completar

- Veja o status no dashboard da Vercel
- Aguarde até mostrar "Ready"

### Passo 4: Testar Novamente

- Limpe cache do navegador (Ctrl+Shift+R)
- Tente gerar um PIX novamente

## 📞 Se Nada Funcionar

1. **Verifique os logs da Vercel** para ver a mensagem de erro exata
2. **Teste a API OpenPix diretamente** com cURL (ver seção 5 acima)
3. **Verifique a documentação da OpenPix**: https://developers.openpix.com.br/
4. **Entre em contato com suporte OpenPix**: contato@openpix.com.br

## 🔐 Informações Importantes

- **O código usa `CLIENT_ID` no header `Authorization`** (correto)
- **NÃO usa `Bearer` ou `CLIENT_SECRET`** no header
- **A OpenPix requer apenas o AppID** (que é o CLIENT_ID)

---

**Última atualização:** 18/01/2026
**Versão do código:** Corrigido para usar CLIENT_ID
