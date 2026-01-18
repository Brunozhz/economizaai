# ⚠️ INSTRUÇÕES DE CONFIGURAÇÃO MANUAL

## Passo 1: Criar arquivo .env.local

Crie um arquivo chamado `.env.local` na **raiz do projeto** com o seguinte conteúdo:

```
PAYMENT_CLIENT_ID=oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ
PAYMENT_CLIENT_SECRET=UXtdFNN3NVJTtMc5HkppxmgAMQPPcH42fqFHghYWbMbMDJ6SwIc6wOc5M6voFbnQvLY6zFJLqhVeLiDsPWeaTPzTUo12YYxlZagB5mGImNIdP75XXQWVoBPjwEd2u4cG
PAYMENT_API_URL=https://api.openpix.com.br/api/v1
```

**📂 Localização do arquivo:**
```
economizaai/
├── .env.local          ← CRIE ESTE ARQUIVO AQUI
├── api/
├── src/
├── package.json
└── ...
```

## Passo 2: Configurar na Vercel (Produção)

Se você vai fazer deploy na Vercel, adicione as mesmas variáveis:

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings** → **Environment Variables**
4. Adicione uma por uma:

   - **Name:** `PAYMENT_CLIENT_ID`
     **Value:** `oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ`

   - **Name:** `PAYMENT_CLIENT_SECRET`
     **Value:** `UXtdFNN3NVJTtMc5HkppxmgAMQPPcH42fqFHghYWbMbMDJ6SwIc6wOc5M6voFbnQvLY6zFJLqhVeLiDsPWeaTPzTUo12YYxlZagB5mGImNIdP75XXQWVoBPjwEd2u4cG`

   - **Name:** `PAYMENT_API_URL`
     **Value:** `https://api.openpix.com.br/api/v1`

5. Salve e faça redeploy

## Passo 3: Testar

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse: `http://localhost:8080`

Clique em qualquer plano → Comprar Agora → Gerar PIX

✅ Se tudo estiver configurado corretamente, você verá o QR Code PIX!

## ❓ Problemas Comuns

### "Configuração de pagamento não disponível"

**Solução:** Verifique se o arquivo `.env.local` foi criado corretamente na raiz do projeto.

### "Erro ao gerar PIX"

**Solução:** 
1. Verifique se as credenciais estão corretas
2. Verifique se tem internet
3. Abra o console do navegador (F12) e veja os erros

### Arquivo .env.local não é reconhecido

**Solução:** Reinicie o servidor de desenvolvimento (Ctrl+C e depois `npm run dev` novamente)

## 📚 Mais Informações

Leia o arquivo `INTEGRACAO-PIX.md` para documentação completa.
