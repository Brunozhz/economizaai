# 📸 Como Adicionar as Imagens dos Order Bumps

## Passo 1: Preparar as Imagens

Você precisa de 4 imagens, uma para cada order bump:

1. **Imagem do Grupo VIP** - `orderbump-vip.png`
2. **Imagem da Lista de Ouro** - `orderbump-lista.png`
3. **Imagem do Kit Backend** - `orderbump-backend.png`
4. **Imagem dos Prompts** - `orderbump-prompts.png`

### Recomendações para as imagens:
- **Formato**: PNG ou JPG
- **Tamanho recomendado**: 200x200px a 400x400px
- **Peso**: Menos de 100KB cada (para carregamento rápido)
- **Aspecto**: Quadrado (1:1) ou próximo disso
- **Qualidade**: Alta resolução mas otimizada

## Passo 2: Adicionar as Imagens ao Projeto

### Opção A: Via Upload Manual

1. Navegue até a pasta do projeto:
   ```
   c:\Users\Usuário\Documents\GitHub\economizaai\public\lovable-uploads\
   ```

2. Cole as 4 imagens nesta pasta com os seguintes nomes:
   - `orderbump-vip.png`
   - `orderbump-lista.png`
   - `orderbump-backend.png`
   - `orderbump-prompts.png`

### Opção B: Via Comando (PowerShell)

Se suas imagens estiverem em outro lugar, você pode copiá-las usando:

```powershell
# Exemplo: se suas imagens estiverem na área de trabalho
Copy-Item "C:\Users\Usuário\Desktop\orderbump-*.png" -Destination "C:\Users\Usuário\Documents\GitHub\economizaai\public\lovable-uploads\"
```

## Passo 3: Verificar se Funcionou

1. Abra o navegador em `http://localhost:8080/`
2. Clique em qualquer plano de créditos
3. Role até o final do formulário
4. Você deverá ver os 4 order bumps com suas respectivas imagens

## 🎨 Sugestões de Ícones/Imagens

Se você não tiver as imagens ainda, aqui estão algumas sugestões:

### Order Bump 1 - Grupo VIP (Roxo)
- Ícone de coroa dourada
- Símbolo VIP
- Grupo de pessoas
- Badge premium

### Order Bump 2 - Lista de Ouro (Dourado)
- Saco de dinheiro com cifrão
- Moeda de ouro
- Lista com estrelas
- Troféu dourado

### Order Bump 3 - Kit Backend (Verde)
- Código {} com brilho
- Banco de dados
- Webhook/API
- Terminal de código

### Order Bump 4 - Pack de Prompts (Amarelo)
- Cérebro digital
- Estrela brilhante
- Lâmpada com IA
- Prompt de comando

## 🔧 Trocar as Imagens Depois

Se você quiser trocar as imagens posteriormente, basta:

1. Substituir os arquivos em `public/lovable-uploads/`
2. Manter o mesmo nome do arquivo
3. O navegador carregará automaticamente a nova imagem

## 📝 Imagens Customizadas

Se você quiser usar imagens de outras URLs ou com outros nomes, edite:

```typescript
// Arquivo: src/data/orderBumps.ts

imageUrl: "/lovable-uploads/SEU-NOME-AQUI.png"
```

## ⚠️ Troubleshooting

### As imagens não aparecem?

1. **Verifique o nome do arquivo**: Deve ser exatamente como especificado
2. **Verifique a extensão**: .png, .jpg, .jpeg, .webp são suportadas
3. **Limpe o cache**: Pressione Ctrl+Shift+R no navegador
4. **Verifique o caminho**: As imagens devem estar em `public/lovable-uploads/`
5. **Verifique o console**: Abra DevTools (F12) e veja se há erros

### Imagens muito grandes/pequenas?

O componente OrderBump já está configurado para exibir as imagens em:
- Mobile: 40x40px
- Desktop: 48x48px

As imagens serão automaticamente redimensionadas para caber nestes tamanhos.

---

**Dica**: Você pode usar ícones temporários até ter as imagens definitivas. Os ícones fallback já estão configurados!
