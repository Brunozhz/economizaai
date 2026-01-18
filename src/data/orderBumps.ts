import { OrderBumpData } from "@/components/OrderBump";

export const orderBumps: OrderBumpData[] = [
  // ORDER BUMP 3 - GRUPO VIP EM PRIMEIRO (conforme solicitado)
  {
    id: "orderbump_3",
    title: "Quero entrar no Grupo VIP",
    subtitle: "NETWORKING MARKETING BLACK + BÔNUS",
    description: "Não trave por falta de ajuda. Acesso vitalício ao nosso grupo de networking. Tire dúvidas, troque estratégias e receba feedbacks reais.",
    price: 9.90,
    // imageUrl: "/lovable-uploads/orderbump-vip.png", // Descomente quando adicionar a imagem
    icon: "crown", // Ícone enquanto não há imagem
    theme: "purple",
    proofText: "👑 93% não querem ficar sozinhos",
    badges: ["Acesso Vitalício", "Sem mensalidade"],
  },
  {
    id: "orderbump_1",
    title: "Incluir Lista de Ouro",
    subtitle: "LISTA DE OURO: 30 MICRO-SAAS VALIDADOS",
    description: "Tem a ferramenta mas está sem ideias? Baixe minha lista pessoal de 30 softwares que empresas pagam mensalidade para usar. Copie, cole e venda.",
    price: 19.90,
    // imageUrl: "/lovable-uploads/orderbump-lista.png", // Descomente quando adicionar a imagem
    icon: "dollar", // Ícone enquanto não há imagem
    theme: "gold",
    proofText: "💰 74% aproveitam essa oferta",
    callToAction: "Oferta Única",
  },
  {
    id: "orderbump_2",
    title: "Adicionar Kit Técnico",
    subtitle: "PACK BACKEND: WEBHOOK + SQL + STRIPE",
    description: "Não sabe configurar o pagamento? Leve o código do Webhook pronto e a estrutura do Banco de Dados Supabase. Só copiar e colar.",
    price: 14.90,
    // imageUrl: "/lovable-uploads/orderbump-backend.png", // Descomente quando adicionar a imagem
    icon: "code", // Ícone enquanto não há imagem
    theme: "green",
    proofText: "⚡ 82% preferem economizar tempo",
    badges: ["Economize 10h de Código"],
  },
  {
    id: "orderbump_4",
    title: "Adicionar Prompts",
    subtitle: "PACK DE PROMPTS \"MESTRE DA LOVABLE\"",
    description: "50+ Prompts Testados para Dashboards, Landings & CRMs Sem Erros. Pare de brigar com a IA. Copie e Cole.",
    price: 9.90,
    // imageUrl: "/lovable-uploads/orderbump-prompts.png", // Descomente quando adicionar a imagem
    icon: "sparkles", // Ícone enquanto não há imagem
    theme: "yellow",
    proofText: "🔥 87% dos alunos levam junto",
    badges: ["Economia de Tempo", "Testado & Validado"],
  },
];
