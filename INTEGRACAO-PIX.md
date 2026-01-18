# Integração de Pagamento PIX - Economiza.IA

## 📋 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Credenciais da API de Pagamento PIX
PAYMENT_CLIENT_ID=oTcdkZ3jbIn5XIYBeRSdls77m3emMoQdbBVi9SiJ
PAYMENT_CLIENT_SECRET=UXtdFNN3NVJTtMc5HkppxmgAMQPPcH42fqFHghYWbMbMDJ6SwIc6wOc5M6voFbnQvLY6zFJLqhVeLiDsPWeaTPzTUo12YYxlZagB5mGImNIdP75XXQWVoBPjwEd2u4cG

# URL da API de Pagamento
PAYMENT_API_URL=https://api.openpix.com.br/api/v1
```

**⚠️ IMPORTANTE:** Este arquivo já está no `.gitignore` e não será commitado. Mantenha suas credenciais seguras!

### 2. Configuração na Vercel

Para produção, adicione as variáveis de ambiente no painel da Vercel:

1. Acesse o dashboard do seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis:
   - `PAYMENT_CLIENT_ID`
   - `PAYMENT_CLIENT_SECRET`
   - `PAYMENT_API_URL`

## 🚀 Como Funciona

### Arquitetura

```
Frontend (React)
    ↓
    ├─ CheckoutModal.tsx (Interface do usuário)
    ├─ paymentService.ts (Funções de pagamento)
    ↓
Backend (Vercel Serverless Functions)
    ├─ /api/create-pix.ts (Gera cobrança PIX)
    ├─ /api/check-pix-status.ts (Verifica status)
    ↓
OpenPix API (Processamento PIX)
```

### Fluxo de Pagamento

1. **Usuário clica em "Comprar Agora"** em qualquer plano
2. **Modal de Checkout abre** com informações do produto
3. **Usuário clica em "Gerar PIX"**
4. **Sistema gera:**
   - QR Code para pagamento
   - Código PIX Copia e Cola
   - Tempo de expiração (padrão: 30 minutos)
5. **Verificação automática de status** a cada 5 segundos
6. **Ao confirmar pagamento:**
   - Modal exibe mensagem de sucesso
   - Fecha automaticamente após 3 segundos

## 📁 Arquivos Criados/Modificados

### APIs Serverless (Vercel Functions)

- **`/api/create-pix.ts`**
  - Cria cobrança PIX via OpenPix
  - Gera QR Code e código Copia e Cola
  - Retorna dados do pagamento

- **`/api/check-pix-status.ts`**
  - Verifica status de pagamento
  - Suporta GET e POST
  - Retorna se foi pago, expirou ou está ativo

### Frontend

- **`/src/services/paymentService.ts`**
  - Funções para criar e verificar pagamentos
  - Helpers para copiar código PIX
  - Formatação de valores e tempo

- **`/src/components/CheckoutModal.tsx`** (atualizado)
  - Interface completa de pagamento PIX
  - Exibe QR Code e código Copia e Cola
  - Verificação automática de status
  - Timer de expiração
  - Estados: inicial, carregando, PIX gerado, pago, expirado, erro

## 🎨 Features Implementadas

### ✅ Segurança
- Credenciais em variáveis de ambiente
- Nunca expostas no frontend
- APIs serverless protegidas

### ✅ UX/UI
- Modal responsivo e moderno
- QR Code visual para escaneamento
- Botão de copiar código PIX
- Timer de expiração em tempo real
- Feedback visual para todos os estados
- Animações suaves
- Toast notifications

### ✅ Funcionalidades
- Geração de PIX dinâmica por plano
- Verificação automática de pagamento (polling a cada 5s)
- Suporte a todos os planos existentes
- Tratamento de erros robusto
- Timeout e expiração de pagamento
- Cancelamento de verificação ao fechar modal

## 🧪 Como Testar

### Desenvolvimento Local

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:8080`

3. **Teste o fluxo:**
   - Clique em qualquer plano
   - Clique em "Comprar Agora"
   - Clique em "Gerar PIX"
   - Aguarde a geração do QR Code

### Produção (Vercel)

1. **Deploy:**
   ```bash
   vercel --prod
   ```

2. **Configure as variáveis de ambiente** no dashboard

3. **Teste em produção**

## 🔧 Personalização

### Alterar tempo de expiração

Edite em `/api/create-pix.ts`:

```typescript
const pixPayload = {
  correlationID: finalCorrelationID,
  value: Math.round(value * 100),
  comment: `Pagamento - ${productName}`,
  expiresIn: 1800, // 30 minutos (em segundos)
};
```

### Alterar intervalo de verificação

Edite em `/src/components/CheckoutModal.tsx`:

```typescript
// Verifica a cada 5 segundos (padrão)
statusCheckInterval.current = setInterval(checkStatus, 5000);
```

## 📚 API OpenPix

A integração usa a [API OpenPix](https://developers.openpix.com.br/) para processar pagamentos PIX.

### Endpoints Utilizados

- **POST** `/api/v1/charge` - Cria nova cobrança
- **GET** `/api/v1/charge?correlationID=xxx` - Verifica status

### Status de Pagamento

- `ACTIVE` - Aguardando pagamento
- `COMPLETED` - Pago com sucesso
- `EXPIRED` - Expirado

## 🐛 Troubleshooting

### Erro ao gerar PIX

1. Verifique se as variáveis de ambiente estão configuradas
2. Confirme que as credenciais são válidas
3. Verifique logs no console da Vercel

### Pagamento não detectado

1. Verifique se o webhook está configurado (opcional)
2. O polling detecta pagamentos em até 5 segundos
3. Verifique logs da API no backend

### Erro de CORS

As APIs serverless da Vercel não têm problema de CORS pois estão no mesmo domínio.

## 📞 Suporte

Para problemas com a API OpenPix:
- Documentação: https://developers.openpix.com.br/
- Suporte: contato@openpix.com.br

## ✨ Próximos Passos (Opcional)

- [ ] Webhook para notificação instantânea de pagamento
- [ ] Histórico de pagamentos no perfil do usuário
- [ ] Integração com sistema de créditos
- [ ] Envio de email de confirmação
- [ ] Dashboard admin para visualizar pagamentos
