import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const motivationalMessages = [
  "Hoje é o dia perfeito para conquistar seus objetivos! 💪",
  "Você é capaz de coisas incríveis! ✨",
  "Cada dia é uma nova oportunidade de brilhar! 🌟",
  "Acredite em você, o sucesso está próximo! 🚀",
  "Sua determinação vai te levar longe! 🎯",
  "O melhor ainda está por vir! 🌈",
  "Você é mais forte do que imagina! 💎",
  "Grandes conquistas começam com pequenos passos! 👣",
  "Seu potencial é ilimitado! ⚡",
  "Hoje você vai arrasar! 🔥",
  "A persistência é o caminho do êxito! 🏆",
  "Você nasceu para vencer! 👑",
  "Confie no processo, os resultados virão! 🌻",
  "Seu esforço vai valer a pena! 💫",
  "Mantenha o foco e siga em frente! 🎖️",
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
