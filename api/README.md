# API Routes - Economiza.IA

Este diretório contém as API routes que executam no servidor Vercel.

## 🔒 Segurança

Todas as rotas neste diretório:
- ✅ Executam 100% no servidor (Vercel)
- ✅ Usam variáveis de ambiente seguras (`process.env`)
- ✅ Nunca expõem chaves de API para o frontend
- ✅ Autenticam com APIs externas via Bearer Token

## 📁 Endpoints Disponíveis

### 1. `/api/check-status` ✅ RECOMENDADO
Verifica o status de um pagamento PIX.

**Método:** `GET` ou `POST`

**Parâmetros:**
- `correlationID` (string, obrigatório) - ID da transação

**Exemplo de uso:**
```javascript
const response = await fetch(`/api/check-status?correlationID=${id}`);
const data = await response.json();
// { success: true, status: "PAID", isPaid: true, ... }
```

**Retorno simplificado:**
```json
{
  "success": true,
  "correlationID": "abc123",
  "status": "PAID",
  "isPaid": true,
  "isExpired": false,
  "isActive": false
}
```

### 2. `/api/check-pix-status-pushinpay` (alias)
Mesmo funcionamento que `/api/check-status`. Mantido para compatibilidade.

### 3. `/api/create-pix-pushinpay`
Cria uma nova cobrança PIX via PushinPay.

**Método:** `POST`

**Body:**
```json
{
  "value": 24.90,
  "productName": "Plano Básico"
}
```

### 4. `/api/send-webhook`
Envia webhook para URL externa (evita CORS).

**Método:** `POST`

**Body:**
```json
{
  "status": "pending" | "paid",
  "correlationID": "abc123",
  "value": 24.90,
  "product": { ... },
  "customer": { ... }
}
```

## 🔐 Variáveis de Ambiente Necessárias

Configure no painel da Vercel:

```env
PUSHINPAY_API_KEY=seu_token_aqui
PUSHINPAY_API_URL=https://api.pushinpay.com.br/api
WEBHOOK_URL=https://seu-webhook.com/endpoint
```

## 🚀 Deploy

As API routes são automaticamente deployadas com o projeto no Vercel.

## 📝 Logs

Para debug, todos os endpoints logam no console do Vercel:
- `[API CHECK-STATUS]` - Verificação de pagamento
- `[API CREATE-PIX]` - Criação de PIX
- `[API SEND-WEBHOOK]` - Envio de webhook
