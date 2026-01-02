import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Gift, Sparkles, Clock, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  product_name: string | null;
  product_price: number | null;
  pix_id: string | null;
  created_at: string;
}

// Extract coupon code from message content
const extractCouponFromContent = (content: string): { code: string; discount: number } | null => {
  // Look for patterns like "Cupom: VOLTE20" or "Use o cupom: DESCONTO25"
  const couponMatch = content.match(/[Cc]upom[:\s]+([A-Z]+\d+)/);
  if (couponMatch) {
    const code = couponMatch[1];
    const discountMatch = code.match(/\d+/);
    if (discountMatch) {
      return { code, discount: parseInt(discountMatch[0]) };
    }
  }
  return null;
};

const Messages = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchMessages();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [newMessage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (message: Message) => {
    if (!message.is_read) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', message.id);
      
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, is_read: true } : m)
      );
    }
    setSelectedMessage(message);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = profile?.name?.split(' ')[0] || 'Visitante';
  const unreadCount = messages.filter(m => !m.is_read).length;

  if (selectedMessage) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setSelectedMessage(null)}
              className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Mensagem</h1>
              <p className="text-xs text-muted-foreground">{formatDate(selectedMessage.created_at)}</p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Message Card */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary/20 via-emerald-500/20 to-primary/20 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.3),transparent_70%)]" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-emerald-500 mb-4">
                    {selectedMessage.type === 'remarketing' ? (
                      <Gift className="h-8 w-8 text-white" />
                    ) : (
                      <Mail className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-foreground">{selectedMessage.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>

                {selectedMessage.product_name && selectedMessage.product_price && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{selectedMessage.product_name}</p>
                        <p className="text-sm text-muted-foreground">Oferta especial para você</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-primary">R$ {selectedMessage.product_price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 text-primary">
                          <Sparkles className="h-3 w-3" />
                          <span className="text-xs font-medium">Desconto exclusivo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    // Extract coupon from content if exists
                    const couponData = extractCouponFromContent(selectedMessage.content);
                    
                    if (couponData && selectedMessage.product_name && selectedMessage.product_price) {
                      // Save coupon and product info for auto-apply in checkout
                      localStorage.setItem('remarketing_offer', JSON.stringify({
                        code: couponData.code,
                        discount: couponData.discount,
                        productName: selectedMessage.product_name,
                        productPrice: selectedMessage.product_price,
                        pixId: selectedMessage.pix_id
                      }));
                    } else if (selectedMessage.product_name && selectedMessage.product_price) {
                      // Save just product info without coupon
                      localStorage.setItem('remarketing_offer', JSON.stringify({
                        productName: selectedMessage.product_name,
                        productPrice: selectedMessage.product_price,
                        pixId: selectedMessage.pix_id
                      }));
                    }
                    
                    // Navigate to home with product param to open checkout
                    navigate(`/?produto=${encodeURIComponent(selectedMessage.product_name || '')}&remarketing=true`);
                  }}
                  className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  {selectedMessage.product_name ? 'Ver Esta Oferta' : 'Ver Ofertas'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Mensagens</h1>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Todas lidas'}
            </p>
          </div>
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20">
          <h2 className="text-lg font-bold text-foreground">{getTimeOfDay()}, {firstName}! 👋</h2>
          <p className="text-sm text-muted-foreground">Confira suas mensagens e ofertas exclusivas</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma mensagem</h3>
            <p className="text-sm text-muted-foreground">
              Suas mensagens e ofertas aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => markAsRead(message)}
                className={`w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                  message.is_read 
                    ? 'bg-card border-border' 
                    : 'bg-gradient-to-r from-primary/5 to-emerald-500/5 border-primary/30 shadow-glow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.is_read 
                      ? 'bg-secondary' 
                      : 'bg-gradient-to-br from-primary to-emerald-500'
                  }`}>
                    {message.type === 'remarketing' ? (
                      <Gift className={`h-5 w-5 ${message.is_read ? 'text-muted-foreground' : 'text-white'}`} />
                    ) : (
                      <Mail className={`h-5 w-5 ${message.is_read ? 'text-muted-foreground' : 'text-white'}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${message.is_read ? 'text-foreground' : 'text-primary'}`}>
                        {message.title}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                    
                    {!message.is_read && (
                      <div className="flex items-center gap-1 mt-2 text-primary">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-xs font-medium">Nova mensagem</span>
                      </div>
                    )}
                  </div>

                  {message.is_read ? (
                    <CheckCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
