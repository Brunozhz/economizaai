import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, Gamepad2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import FlappyBirdGame from "./FlappyBirdGame";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [waitingForAdmin, setWaitingForAdmin] = useState(false);
  const [hasNewResponse, setHasNewResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { playNotificationSound } = useNotificationSound();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for existing conversation in localStorage
    const savedConversationId = localStorage.getItem('support_conversation_id');
    if (savedConversationId) {
      setConversationId(savedConversationId);
      loadConversation(savedConversationId);
    }
  }, []);

  // Subscribe to realtime updates for admin responses
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`support-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'support_conversations',
          filter: `id=eq.${conversationId}`
        },
        (payload: any) => {
          if (payload.new?.admin_response && payload.new?.status === 'answered') {
            setMessages(prev => [
              ...prev,
              { role: "assistant", content: `👨‍💼 Atendente: ${payload.new.admin_response}` }
            ]);
            setWaitingForAdmin(false);
            
            // Play notification sound and show visual indicator
            playNotificationSound();
            if (!isOpen) {
              setHasNewResponse(true);
            }
            
            toast({
              title: "🔔 Resposta do suporte!",
              description: "Um atendente respondeu sua mensagem.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, toast]);

  const loadConversation = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .eq('id', id)
        .single();

      if (data && !error) {
        const msgs = (data.messages as unknown) as Message[];
        setMessages(Array.isArray(msgs) ? msgs : []);
        setEmail(data.email || "");
        if (data.status === 'waiting_admin') {
          setWaitingForAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const createConversation = async (): Promise<string> => {
    const { data, error } = await supabase
      .from('support_conversations')
      .insert({
        messages: [],
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    
    localStorage.setItem('support_conversation_id', data.id);
    setConversationId(data.id);
    return data.id;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = await createConversation();
      }

      // Extract email if user provides one
      const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
      const extractedEmail = emailMatch ? emailMatch[0] : email;
      if (extractedEmail && !email) {
        setEmail(extractedEmail);
      }

      const allMessages = [...messages, { role: "user" as const, content: userMessage }];

      const { data, error } = await supabase.functions.invoke('support-chat', {
        body: {
          messages: allMessages,
          conversationId: currentConversationId,
          email: extractedEmail || email
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);

      // Check if should escalate to admin
      if (data.message.includes("atendente") || data.message.includes("humano")) {
        setWaitingForAdmin(true);
        await supabase
          .from('support_conversations')
          .update({ status: 'waiting_admin' })
          .eq('id', currentConversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewConversation = () => {
    localStorage.removeItem('support_conversation_id');
    setConversationId(null);
    setMessages([]);
    setEmail("");
    setWaitingForAdmin(false);
    setShowGame(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send/?phone=558796760040&text&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse" />
      </a>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] h-[500px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showGame && (
                <button onClick={() => setShowGame(false)} className="hover:opacity-80">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h3 className="font-semibold">{showGame ? 'Flappy Bird' : 'Suporte'}</h3>
                <p className="text-xs opacity-80">
                  {showGame ? 'Divirta-se enquanto espera!' : 'Estamos aqui para ajudar'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
              <X className="w-5 h-5" />
            </button>
          </div>

          {showGame ? (
            <div className="flex-1 overflow-auto p-2">
              <FlappyBirdGame onClose={() => setShowGame(false)} />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Olá! 👋</p>
                    <p>Como posso ajudar você hoje?</p>
                  </div>
                )}
                
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}

                {waitingForAdmin && !isLoading && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      ⏳ Aguardando resposta do atendente...
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGame(true)}
                      className="gap-2"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      Jogar enquanto espera
                    </Button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={startNewConversation}
                    className="text-xs text-muted-foreground hover:text-foreground mt-2 underline"
                  >
                    Iniciar nova conversa
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SupportChatWidget;
