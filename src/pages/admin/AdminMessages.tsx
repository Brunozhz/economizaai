import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Clock } from 'lucide-react';

interface Message {
  id: string;
  title: string;
  content: string;
  email: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchMessages();
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'remarketing':
        return <Badge variant="secondary">Remarketing</Badge>;
      case 'notification':
        return <Badge className="bg-blue-500/20 text-blue-600">Notificação</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mensagens</h1>
        <p className="text-muted-foreground">{messages.length} mensagens enviadas</p>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Histórico de Mensagens
          </CardTitle>
          <CardDescription>Todas as mensagens enviadas aos usuários</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <div className="divide-y divide-border">
              {messages.map((message) => (
                <div key={message.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.title}</span>
                          {getTypeBadge(message.type)}
                          {!message.is_read && (
                            <Badge className="bg-amber-500/20 text-amber-600">Não lida</Badge>
                          )}
                        </div>
                        {message.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {message.email}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(message.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhuma mensagem encontrada</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
