import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { MessageCircle, Send, Clock, CheckCircle, User, Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
