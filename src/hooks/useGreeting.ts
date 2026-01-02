import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const motivationalMessages = [
  "Quem tenta falar com todo mundo não vende pra ninguém. 🎯",
  "Nicho não limita, nicho acelera. 🚀",
  "Autoridade vem da repetição certa. 💪",
  "Branding sem venda é hobby caro. 💰",
  "Marca forte reduz custo de aquisição. 📈",
  "Posicionamento claro atrai lead certo. 🎯",
  "Confiança converte mais que hype. ✨",
  "Quem educa vende melhor. 📚",
  "Prova social acelera decisões. ⚡",
  "Clareza gera confiança. 💎",
  "Quem age lento paga caro. ⏰",
  "Feito hoje vale mais que perfeito amanhã. 🔥",
  "Teste pequeno evita prejuízo grande. 🧪",
  "Ajustar rápido é vantagem competitiva. 🏆",
  "Quem lança aprende, quem espera estagna. 🚀",
  "Execução diária vence talento esporádico. 💪",
  "O mercado recompensa velocidade. ⚡",
  "Melhorar 1% por dia cria impérios. 👑",
  "Quem mede, cresce. 📊",
  "Quem não testa, depende da sorte. 🎲",
  "Quem espera o momento perfeito nunca lança. ⏳",
  "Resultado vem de execução imperfeita, não de planejamento infinito. 🎯",
  "O mercado paga quem resolve problemas, não quem reclama. 💰",
  "Se ninguém está reclamando do seu preço, você está barato. 💎",
  "Conforto é o maior inimigo da escala. 🔥",
  "Quem copia aprende, quem testa domina. 🧠",
  "O jogo é longo, mas o caixa é diário. 💵",
  "Não existe tráfego caro, existe oferta fraca. 📢",
  "Autoridade é construída com consistência, não com sorte. 🏗️",
  "Quem entende números manda no jogo. 📊",
  "Consistência cria vantagem injusta. 💪",
  "Disciplina vence motivação. 🎖️",
  "Quem some perde espaço. 👀",
  "O mercado esquece rápido. ⏰",
  "Constância constrói autoridade. 🏆",
  "Jogar todo dia muda o jogo. 🎮",
  "Quem persiste aprende mais rápido. 📈",
  "Resultado não gosta de preguiça. 💪",
  "Processo vence ansiedade. 🧘",
  "Pequenas vitórias constroem confiança. ✨",
  "Nem todo teste vai dar certo. 🧪",
  "Prejuízo pequeno ensina caro. 📚",
  "Fracasso rápido é aprendizado barato. 💡",
  "Quem nunca perdeu nunca escalou. 📈",
  "O jogo não é justo, é lucrativo. 💰",
  "O mercado não tem dó. 🎯",
  "Emoção quebra estratégia. 🧠",
  "Lucro é disciplina. 💵",
  "Caixa é oxigênio. 🌬️",
  "Sem margem não existe escala. 📊",
  "Ativo próprio vale mais que hype. 💎",
  "Venda resolve tudo. 🛒",
  "Produto bom encontra mercado. 🎯",
  "Oferta certa muda o jogo. 🔥",
  "Simples escala. ⚡",
  "Testar é obrigatório. 🧪",
  "Melhorar nunca acaba. 📈",
  "O mercado paga execução. 💰",
  "Quem entende o jogo dita regra. 👑",
  "Resultado não mente. 📊",
  "Marketing é alavanca, não milagre. 🚀",
  "Lista é poder. 📋",
  "Quem domina audiência domina vendas. 🎤",
  "Comunidade sustenta marcas. 🤝",
  "Longo prazo nasce do curto bem feito. ⏳",
  "Quem pensa como dono cresce diferente. 👔",
  "Negócio bom sobrevive a crises. 💪",
  "Marca forte atravessa ciclos. 🔄",
  "Escala consciente dura mais. 🌱",
];

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const getRandomMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};

export const useGreeting = () => {
  const { profile, user } = useAuth();
  const hasShownGreeting = useRef(false);

  useEffect(() => {
    if (hasShownGreeting.current) return;
    if (!user) return;

    const greeting = getGreeting();
    const name = profile?.name?.split(' ')[0] || 'amigo(a)';
    const motivationalMessage = getRandomMessage();

    toast.success(
      `${greeting}, ${name}! ${motivationalMessage}`,
      {
        duration: 5000,
        position: 'top-center',
      }
    );

    hasShownGreeting.current = true;
  }, [user, profile]);
};
