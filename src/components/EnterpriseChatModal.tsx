import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, CheckCircle2 } from "lucide-react";

interface EnterpriseChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChatStep = 'welcome' | 'quantity' | 'comparison' | 'name' | 'whatsapp' | 'email' | 'complete';

interface Message {
  role: 'bot' | 'user';
  content: string;
  isTyping?: boolean;
}

const EnterpriseChatModal = ({ isOpen, onClose }: EnterpriseChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<ChatStep>('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Olá! 👋 Sou o consultor da Economiza.IA. Para projetos que exigem grande escala (acima de 1.000 créditos), oferecemos condições especiais.\n\nQuantos créditos você planeja contratar?");
      setStep('quantity');
    }
  }, [isOpen]);

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("");

    switch (step) {
      case 'quantity':
        const qty = parseInt(userMessage.replace(/\D/g, ''));
        if (isNaN(qty) || qty < 1000) {
          addBotMessage("Para quantidades menores que 1.000 créditos, recomendo utilizar nossos pacotes padrão na tabela acima. Eles oferecem ótimo custo-benefício!\n\nSe precisar de escala maior (1.000+), me informe a quantidade desejada.");
        } else {
          setQuantity(qty);
          const lovablePrice = (qty * 1.35).toFixed(2);
          const ourPrice = (qty * 0.20).toFixed(2);
          const savings = (qty * 1.35 - qty * 0.20).toFixed(2);
          
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              role: 'bot', 
              content: `Excelente escolha! Veja a comparação para ${qty.toLocaleString('pt-BR')} créditos:\n\n❌ Valor na plataforma oficial: R$ ${parseFloat(lovablePrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n✅ Valor na Economiza.IA: R$ ${parseFloat(ourPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n💰 Você economiza R$ ${parseFloat(savings).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} nesta operação!`
            }]);
            setIsTyping(false);
            
            setTimeout(() => {
              addBotMessage("Para processarmos seu desconto e verificarmos a disponibilidade de carga, informe os dados para contato.\n\nQual é o seu nome completo?");
              setStep('name');
            }, 1500);
          }, 800);
          setIsTyping(true);
        }
        break;

      case 'name':
        if (userMessage.length < 3) {
          addBotMessage("Por favor, informe seu nome completo.");
        } else {
          setFormData(prev => ({ ...prev, name: userMessage }));
          addBotMessage(`Prazer, ${userMessage.split(' ')[0]}! 😊\n\nAgora, qual é o seu WhatsApp para contato?`);
          setStep('whatsapp');
        }
        break;

      case 'whatsapp':
        const cleanPhone = userMessage.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          addBotMessage("Por favor, informe um número de WhatsApp válido com DDD.");
        } else {
          setFormData(prev => ({ ...prev, whatsapp: userMessage }));
          addBotMessage("Ótimo! Por último, qual é o e-mail da conta Lovable que receberá os créditos?");
          setStep('email');
        }
        break;

      case 'email':
        if (!userMessage.includes('@') || !userMessage.includes('.')) {
          addBotMessage("Por favor, informe um e-mail válido.");
        } else {
          setFormData(prev => ({ ...prev, email: userMessage }));
          addBotMessage("Excelente! 🚀 Seus dados foram enviados para nossa central de grandes contas.\n\nUm especialista entrará em contato via WhatsApp em breve para finalizar o procedimento e liberar seu saldo.\n\nObrigado por escolher a Economiza.IA!");
          setStep('complete');
        }
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setStep('welcome');
    setInput("");
    setQuantity(0);
    setFormData({ name: '', whatsapp: '', email: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-cyan-500/30 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Consultor Economiza.IA</h3>
              <p className="text-xs text-cyan-400">Online • Especialista em Grandes Contas</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {msg.role === 'bot' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md'
                    : 'bg-slate-800/80 text-gray-100 rounded-bl-md border border-slate-700/50'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('❌')) {
                      return <span key={i} className="text-red-400 line-through block">{line}</span>;
                    }
                    if (line.startsWith('✅')) {
                      return <span key={i} className="text-green-400 font-bold block text-base">{line}</span>;
                    }
                    if (line.startsWith('💰')) {
                      return <span key={i} className="text-yellow-400 font-bold block text-base">{line}</span>;
                    }
                    return <span key={i} className="block">{line}</span>;
                  })}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 justify-start animate-fade-in">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-700/50">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-cyan-500/20 bg-slate-900/80">
          {step === 'complete' ? (
            <Button 
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Finalizar Conversa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  step === 'quantity' ? "Digite a quantidade de créditos..." :
                  step === 'name' ? "Digite seu nome completo..." :
                  step === 'whatsapp' ? "Ex: (11) 99999-9999" :
                  step === 'email' ? "Digite seu e-mail..." :
                  "Digite sua mensagem..."
                }
                className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnterpriseChatModal;
