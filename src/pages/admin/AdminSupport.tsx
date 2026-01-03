import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { MessageCircle, Send, Clock, CheckCircle, User, Bell, Zap } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Quick responses for common support scenarios
const QUICK_RESPONSES = [
  {
    label: "Saudação",
    text: "Olá! 👋 Sou do suporte da Economiza.IA. Como posso ajudá-lo(a) hoje?"
  },
  {
    label: "Pagamento PIX",
    text: "Para realizar o pagamento via PIX, basta clicar no botão 'Comprar' do plano desejado. O QR Code será gerado automaticamente e você terá 30 minutos para efetuar o pagamento. Após a confirmação, seus créditos serão liberados instantaneamente! 💳"
  },
  {
    label: "Créditos não aparecem",
    text: "Seus créditos podem levar até 5 minutos para aparecer após a confirmação do pagamento. Se o problema persistir, por favor me envie seu email de cadastro e o comprovante do PIX para verificarmos. 🔍"
  },
  {
    label: "Cupom de desconto",
    text: "Para usar um cupom de desconto, basta inserir o código no campo 'Cupom' durante o checkout, antes de gerar o PIX. O desconto será aplicado automaticamente ao valor final! 🎫"
  },
  {
    label: "Como usar créditos",
    text: "Seus créditos podem ser usados para acessar todas as funcionalidades da plataforma Lovable. Basta fazer login e começar a criar seus projetos. Os créditos são debitados conforme o uso. 🚀"
  },
  {
    label: "Problema resolvido",
    text: "Fico feliz em saber que conseguimos resolver! 🎉 Se tiver mais alguma dúvida, estou à disposição. Obrigado por escolher a Economiza.IA!"
  },
  {
    label: "Aguardar verificação",
    text: "Estou verificando sua solicitação e retorno em alguns minutos. Agradeço sua paciência! ⏳"
  },
  {
    label: "Reembolso",
    text: "Para solicitar reembolso, por favor me envie: 1) Email de cadastro, 2) Comprovante do PIX, 3) Motivo da solicitação. Analisaremos seu caso em até 24 horas úteis. 📝"
  }
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  email: string | null;
  messages: Message[];
  status: string;
  created_at: string;
  updated_at: string;
  admin_response: string | null;
}

const AdminSupport = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const previousConversationsRef = useRef<Conversation[]>([]);
  const { toast } = useToast();
  const { playNotificationSound } = useNotificationSound();

  useEffect(() => {
    loadConversations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('admin-support')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_conversations'
        },
        (payload) => {
          // Check if it's a new message from a client
          if (payload.eventType === 'INSERT') {
            playNotificationSound();
            setNewMessageCount(prev => prev + 1);
            toast({
              title: "🔔 Nova conversa de suporte!",
              description: "Um cliente iniciou uma nova conversa.",
            });
          } else if (payload.eventType === 'UPDATE') {
            const newData = payload.new as Conversation;
            const oldData = payload.old as Partial<Conversation>;
            
            // Check if client sent new messages (not admin response)
            if (newData.status === 'waiting_admin' && oldData.status !== 'waiting_admin') {
              playNotificationSound();
              setNewMessageCount(prev => prev + 1);
              toast({
                title: "🔔 Cliente aguardando resposta!",
                description: newData.email || "Cliente precisa de atendimento.",
              });
            }
          }
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playNotificationSound, toast]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('support_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []).map(conv => ({
        ...conv,
        messages: (conv.messages as unknown) as Message[]
      }));

      setConversations(typedData);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendAdminResponse = async () => {
    if (!selectedConversation || !adminResponse.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('support_conversations')
        .update({
          admin_response: adminResponse,
          status: 'answered',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedConversation.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Resposta enviada ao cliente.",
      });

      setAdminResponse("");
      loadConversations();
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'waiting_admin':
        return <Badge variant="destructive" className="animate-pulse">Aguardando Resposta</Badge>;
      case 'answered':
        return <Badge variant="default" className="bg-green-500">Respondido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Conversas ({conversations.length})
            {newMessageCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse flex items-center gap-1">
                <Bell className="w-3 h-3" />
                {newMessageCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma conversa ainda
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    // Clear notification count when selecting a conversation
                    if (conv.status === 'waiting_admin') {
                      setNewMessageCount(prev => Math.max(0, prev - 1));
                    }
                  }}
                  className={`w-full p-4 text-left border-b hover:bg-muted/50 transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm truncate">
                      {conv.email || 'Sem email'}
                    </span>
                    {getStatusBadge(conv.status)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.messages.length > 0 
                      ? conv.messages[conv.messages.length - 1].content.substring(0, 50) + '...'
                      : 'Sem mensagens'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(conv.updated_at), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                </button>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Conversation Detail */}
      <Card className="lg:col-span-2">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {selectedConversation.email || 'Cliente sem email'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Iniciado em {format(new Date(selectedConversation.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                {getStatusBadge(selectedConversation.status)}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[400px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedConversation.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {selectedConversation.admin_response && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700">
                        <p className="text-xs text-green-700 dark:text-green-300 mb-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Resposta do Admin
                        </p>
                        <p className="text-sm whitespace-pre-wrap">{selectedConversation.admin_response}</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Responses */}
              <div className="px-4 pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium text-muted-foreground">Respostas Rápidas</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-[60px] overflow-y-auto">
                  {QUICK_RESPONSES.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => setAdminResponse(prev => prev ? `${prev}\n\n${response.text}` : response.text)}
                      className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors border border-border hover:border-primary/50"
                    >
                      {response.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Response Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Digite sua resposta ao cliente..."
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={sendAdminResponse}
                    disabled={!adminResponse.trim() || isSending}
                    className="self-end"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Selecione uma conversa para visualizar</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AdminSupport;
