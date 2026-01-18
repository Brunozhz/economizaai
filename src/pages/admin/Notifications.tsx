import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bell, Send, Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Notifications = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [testType, setTestType] = useState<'sale_generated' | 'sale_approved'>('sale_generated');

  const sendTestNotification = async () => {
    if (!title || !body) {
      toast.error('Preencha título e mensagem');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-push', {
        body: {
          title,
          body,
          admin_only: true,
          data: { type: testType },
        },
      });

      if (error) throw error;

      toast.success(`Notificação enviada! (${data?.sent || 0} dispositivos)`);
      setTitle('');
      setBody('');
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error('Erro ao enviar notificação');
    } finally {
      setSending(false);
    }
  };

  const sendQuickTest = async (type: 'sale_generated' | 'sale_approved') => {
    setSending(true);
    try {
      const notifications = {
        sale_generated: {
          title: '💰 Venda Iniciada!',
          body: 'Nova venda de R$ 99,90 gerada - Produto Teste',
        },
        sale_approved: {
          title: '✅ Venda Aprovada!',
          body: 'Venda de R$ 99,90 foi confirmada - Produto Teste',
        },
      };

      const { data, error } = await supabase.functions.invoke('send-push', {
        body: {
          ...notifications[type],
          admin_only: true,
          data: { type },
        },
      });

      if (error) throw error;

      toast.success(`Notificação "${type}" enviada!`);
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error('Erro ao enviar notificação');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notificações</h1>
        <p className="text-muted-foreground">Envie notificações push para admins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Teste Rápido
            </CardTitle>
            <CardDescription>
              Simule notificações de vendas para testar o som de caixa registradora
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => sendQuickTest('sale_generated')}
              disabled={sending}
              className="w-full justify-start gap-3 h-auto py-4"
              variant="outline"
            >
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold">💰 Venda Iniciada</div>
                <div className="text-sm text-muted-foreground">Simula nova venda criada</div>
              </div>
            </Button>

            <Button
              onClick={() => sendQuickTest('sale_approved')}
              disabled={sending}
              className="w-full justify-start gap-3 h-auto py-4"
              variant="outline"
            >
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold">✅ Venda Aprovada</div>
                <div className="text-sm text-muted-foreground">Simula pagamento confirmado</div>
              </div>
            </Button>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Como funciona:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ative as notificações push (ícone de sino no site)</li>
                    <li>Clique em um dos botões acima</li>
                    <li>Você receberá a notificação com som de caixa registradora</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Notificação Personalizada
            </CardTitle>
            <CardDescription>
              Envie uma notificação personalizada para todos os admins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Nova promoção disponível!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Mensagem</Label>
              <Textarea
                id="body"
                placeholder="Ex: Confira as ofertas especiais..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo (define o som)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={testType === 'sale_generated' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTestType('sale_generated')}
                >
                  💰 Venda Iniciada
                </Button>
                <Button
                  type="button"
                  variant={testType === 'sale_approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTestType('sale_approved')}
                >
                  ✅ Aprovado
                </Button>
              </div>
            </div>

            <Button
              onClick={sendTestNotification}
              disabled={sending || !title || !body}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? 'Enviando...' : 'Enviar Notificação'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
