# 🔗 Integração com n8n - Webhook de Pagamentos

Este documento descreve a estrutura dos dados enviados para o webhook do n8n.

## 📡 Endpoint do Webhook

Configure no Vercel a variável:
```
VITE_WEBHOOK_URL=https://seu-n8n.com/webhook/pagamento
```

## 📦 Estrutura de Dados Enviados

O webhook recebe requisições POST com `Content-Type: application/json`.

### Status: PENDING (Pedido Criado)

Enviado quando o PIX é gerado (função: `create-pix`):

```json
{
  "pix_id": "12345",
  "produto": "1.000.000 créditos Lovable",
  "produto_id": "credits-1000000",
  "valor": 500.00,
  "nome": "João Silva",
  "email": "joao@example.com",
  "whatsapp": "5511999999999",
  "lovable_invite_link": "https://lovable.ai/invite/abc123",
  "user_id": "",
  "status": "pending",
  "qr_code": "00020101021226...código PIX completo...",
  "created_at": "2026-01-18T04:30:00.000Z"
}
```

### Status: PAID (Pagamento Confirmado)

Enviado quando o pagamento é confirmado (função: `check-pix-status`):

```json
{
  "pix_id": "12345",
  "produto": "1.000.000 créditos Lovable",
  "produto_id": "credits-1000000",
  "valor": 500.00,
  "nome": "João Silva",
  "email": "joao@example.com",
  "whatsapp": "5511999999999",
  "lovable_invite_link": "https://lovable.ai/invite/abc123",
  "user_id": "",
  "status": "paid",
  "qr_code": "",
  "created_at": "2026-01-18T04:35:00.000Z",
  "payer_name": "João Silva",
  "payer_document": "12345678900",
  "end_to_end_id": "E123456789202601180435000000001"
}
```

## 📋 Descrição dos Campos

### Campos Principais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `pix_id` | string | ID único do pedido na Cakto |
| `produto` | string | Nome do produto comprado |
| `produto_id` | string | ID interno do produto (ex: credits-1000000) |
| `valor` | number | Valor em reais (R$) |
| `nome` | string | Nome completo do cliente |
| `email` | string | Email do cliente |
| `whatsapp` | string | Telefone no formato: 5511999999999 |
| `lovable_invite_link` | string | Link de convite do Lovable fornecido pelo cliente |
| `user_id` | string | ID do usuário (vazio se não logado) |
| `status` | string | Status do pedido: "pending" ou "paid" |
| `qr_code` | string | Código PIX Copia e Cola (só em pending) |
| `created_at` | string | Data/hora ISO 8601 |

### Campos Adicionais (apenas quando status = "paid")

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `payer_name` | string | Nome de quem pagou (pode ser diferente do cliente) |
| `payer_document` | string | CPF/CNPJ de quem pagou |
| `end_to_end_id` | string | ID da transação PIX (E2E) |

## 🔄 Fluxo de Webhook

```
1. Cliente clica em "Gerar PIX"
   └─> Webhook enviado: status = "pending"
       └─> n8n pode enviar email de confirmação

2. Cliente paga o PIX
   └─> Frontend consulta status a cada 5s
       └─> Quando pago: Webhook enviado: status = "paid"
           └─> n8n processa o pedido e envia os créditos
```

## 🛠️ Configuração no n8n

### Exemplo de Workflow

1. **Webhook Trigger**
   - Method: POST
   - Path: /webhook/pagamento

2. **IF Node** - Verificar Status
   - Se `status === "pending"`: 
     - Salvar pedido no banco de dados
     - Enviar email: "Aguardando pagamento"
   
   - Se `status === "paid"`:
     - Atualizar pedido no banco
     - Processar créditos Lovable
     - Enviar email: "Pagamento confirmado! Créditos enviados"

3. **HTTP Request** - Enviar créditos Lovable
   - URL: API do Lovable
   - Dados: usar `lovable_invite_link` do webhook

4. **Email** - Notificar cliente
   - Para: `{{ $json.email }}`
   - Assunto: "Seus créditos Lovable foram enviados!"

### Exemplo de Código no n8n (Function Node)

```javascript
// Extrair dados do webhook
const status = $input.item.json.status;
const email = $input.item.json.email;
const nome = $input.item.json.nome;
const valor = $input.item.json.valor;
const produto = $input.item.json.produto;
const lovableLink = $input.item.json.lovable_invite_link;

if (status === 'paid') {
  // Processar pagamento confirmado
  return {
    json: {
      action: 'send_credits',
      customer: {
        name: nome,
        email: email,
        invite_link: lovableLink
      },
      product: produto,
      amount: valor
    }
  };
} else {
  // Apenas registrar pedido pendente
  return {
    json: {
      action: 'register_pending',
      pix_id: $input.item.json.pix_id
    }
  };
}
```

## 🔐 Segurança

### Recomendações

1. **Autenticação**: Adicione um token secreto no header
   ```javascript
   // No backend (create-pix.ts e check-pix-status.ts)
   headers: {
     'Content-Type': 'application/json',
     'X-Webhook-Secret': process.env.WEBHOOK_SECRET
   }
   
   // No n8n
   if (headers['x-webhook-secret'] !== 'seu_token_secreto') {
     return { error: 'Unauthorized' };
   }
   ```

2. **Validação de Origem**: Configure o n8n para aceitar apenas requisições do domínio da Vercel

3. **Logs**: Mantenha logs de todos os webhooks recebidos para auditoria

## 🧪 Teste do Webhook

### Usando cURL

```bash
# Teste: Pedido Pendente
curl -X POST https://seu-n8n.com/webhook/pagamento \
  -H "Content-Type: application/json" \
  -d '{
    "pix_id": "test-123",
    "produto": "Teste",
    "valor": 1.00,
    "nome": "Teste",
    "email": "teste@example.com",
    "whatsapp": "5511999999999",
    "lovable_invite_link": "https://lovable.ai/invite/test",
    "status": "pending",
    "qr_code": "00020101021226...",
    "created_at": "2026-01-18T04:30:00.000Z"
  }'

# Teste: Pagamento Confirmado
curl -X POST https://seu-n8n.com/webhook/pagamento \
  -H "Content-Type: application/json" \
  -d '{
    "pix_id": "test-123",
    "produto": "Teste",
    "valor": 1.00,
    "nome": "Teste",
    "email": "teste@example.com",
    "status": "paid",
    "payer_name": "Teste",
    "payer_document": "12345678900",
    "created_at": "2026-01-18T04:35:00.000Z"
  }'
```

## 📊 Monitoramento

### Logs no Vercel

Verifique os logs das functions:
1. Acesse seu projeto no Vercel
2. Vá em **Functions** → `create-pix` ou `check-pix-status`
3. Veja os logs em tempo real

Procure por:
- `"Sending webhook to n8n:"` - Webhook sendo enviado
- `"Webhook response status:"` - Resposta do n8n
- `"Webhook to n8n result:"` - Resultado final

## ❓ Troubleshooting

### Webhook não chega no n8n

1. Verifique se `VITE_WEBHOOK_URL` está configurado no Vercel
2. Teste o webhook diretamente com cURL
3. Verifique se o n8n está acessível publicamente
4. Veja os logs da função no Vercel

### Dados incompletos

- Todos os campos obrigatórios são validados no frontend
- Se algum campo estiver vazio, verifique o código do `CheckoutModal.tsx`

---

**Última atualização**: 18 de Janeiro de 2026
