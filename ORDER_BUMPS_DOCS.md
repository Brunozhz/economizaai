# Order Bumps - Documentação

## 📋 Visão Geral

Os **Order Bumps** foram implementados no checkout do sistema para maximizar o valor médio de cada pedido (AOV - Average Order Value). Cada order bump é opcional e pode ser selecionado pelo usuário antes de finalizar a compra.

## 🎯 Funcionalidades Implementadas

### ✅ Componentes Criados

1. **OrderBump.tsx** (`src/components/OrderBump.tsx`)
   - Componente reutilizável para exibir cada order bump
   - Design responsivo com temas personalizáveis (gold, green, purple, yellow)
   - Animações suaves e estados interativos
   - Suporta ícones, badges, descrições e call-to-actions

2. **orderBumps.ts** (`src/data/orderBumps.ts`)
   - Arquivo de dados contendo os 4 order bumps configurados:
     - **Order Bump 1**: Lista de Ouro (R$ 19,90)
     - **Order Bump 2**: Kit Técnico Backend (R$ 14,90)
     - **Order Bump 3**: Grupo VIP Networking (R$ 9,90)
     - **Order Bump 4**: Pack de Prompts (R$ 9,90)

### 💰 Sistema de Somatória

O sistema calcula automaticamente o valor total baseado em:
- Preço base do plano selecionado
- Order bumps selecionados (somados ao total)
- Desconto de 15% (se aplicável, aplicado apenas ao plano base)

**Exemplo de cálculo:**
```
Plano: R$ 67,99
Order Bump 1: R$ 19,90
Order Bump 2: R$ 14,90
Desconto 15%: -R$ 10,20 (aplicado apenas no plano)
-------------------------
Total: R$ 92,59
```

### 📡 Integração com Webhook

Os order bumps são enviados para o webhook nas seguintes variáveis:
```typescript
{
  orderBumps: {
    orderbump_1: boolean,  // true se selecionado
    orderbump_2: boolean,
    orderbump_3: boolean,
    orderbump_4: boolean
  }
}
```

Isso permite que o backend saiba exatamente quais order bumps foram adquiridos pelo cliente.

## 📱 Responsividade

Todos os order bumps foram implementados com design totalmente responsivo:

### Mobile (< 640px)
- Tamanhos de fonte reduzidos
- Espaçamentos compactos
- Ícones menores
- Textos com `line-clamp` para evitar overflow
- Layout vertical otimizado

### Tablet/Desktop (≥ 640px)
- Tamanhos padrão
- Espaçamentos amplos
- Melhor legibilidade
- Todos os textos visíveis

## 🎨 Temas Disponíveis

Cada order bump pode ter um dos seguintes temas:

1. **Gold** (Dourado)
   - Cores: Yellow-400, Amber-500, Orange-500
   - Ideal para ofertas premium

2. **Green** (Verde)
   - Cores: Emerald-400, Cyan-400
   - Ideal para economia de tempo/recursos

3. **Purple** (Roxo)
   - Cores: Purple-500, Violet-500, Fuchsia-500
   - Ideal para comunidade/networking

4. **Yellow** (Amarelo)
   - Cores: Yellow-300, Yellow-400, Amber-400
   - Ideal para ferramentas/recursos

## 🔧 Como Adicionar um Novo Order Bump

1. Abra `src/data/orderBumps.ts`
2. Adicione um novo objeto ao array `orderBumps`:

```typescript
{
  id: "orderbump_5",  // Incrementar o número
  title: "Título do Order Bump",
  subtitle: "SUBTÍTULO EM MAIÚSCULAS",
  description: "Descrição completa do que está sendo oferecido...",
  price: 29.90,
  icon: "sparkles",  // crown, zap, dollar, code, sparkles, users
  theme: "gold",     // gold, green, purple, yellow
  proofText: "🔥 90% dos clientes aproveitam",
  badges: ["Benefício 1", "Benefício 2"],  // Opcional
  callToAction: "Oferta Limitada"  // Opcional
}
```

3. Atualizar o tipo no `paymentService.ts` se necessário:

```typescript
orderBumps?: {
  orderbump_1?: boolean;
  orderbump_2?: boolean;
  orderbump_3?: boolean;
  orderbump_4?: boolean;
  orderbump_5?: boolean;  // Adicionar nova linha
};
```

4. Atualizar as chamadas de webhook no `CheckoutModal.tsx`:

```typescript
orderBumps: {
  orderbump_1: selectedOrderBumps.has('orderbump_1'),
  orderbump_2: selectedOrderBumps.has('orderbump_2'),
  orderbump_3: selectedOrderBumps.has('orderbump_3'),
  orderbump_4: selectedOrderBumps.has('orderbump_4'),
  orderbump_5: selectedOrderBumps.has('orderbump_5'),  // Adicionar
},
```

## 📊 Benefícios da Implementação

1. **Aumento do AOV**: Mais opções de compra aumentam o valor médio do pedido
2. **Melhor UX**: Interface clara e intuitiva para adicionar produtos extras
3. **Rastreamento**: Cada order bump é rastreado individualmente via webhook
4. **Flexibilidade**: Fácil adicionar, remover ou modificar order bumps
5. **Responsivo**: Funciona perfeitamente em todos os dispositivos
6. **Performance**: Componentes otimizados com estados locais

## 🚀 Próximos Passos (Opcional)

- [ ] A/B Testing de diferentes order bumps
- [ ] Analytics de conversão por order bump
- [ ] Order bumps dinâmicos baseados no plano selecionado
- [ ] Animações de confetti ao selecionar order bumps
- [ ] Recomendações personalizadas de order bumps

## 📝 Notas Técnicas

- **Estado persistente**: Os order bumps selecionados são salvos no `sessionStorage` para manter o estado mesmo se o usuário recarregar a página
- **Validação**: O sistema garante que apenas order bumps válidos sejam enviados para o webhook
- **Performance**: Uso de `Set` para gerenciar seleções de forma eficiente
- **Acessibilidade**: Componentes seguem boas práticas de acessibilidade (contraste, tamanhos de toque, etc.)

---

**Desenvolvido com ❤️ para maximizar conversões e melhorar a experiência do usuário**
