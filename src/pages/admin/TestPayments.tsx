import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CreditCard, 
  QrCode, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Copy,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface PixPayment {
  pixId: string;
  qrCode: string;
  qrCodeBase64?: string;
  status: string;
  value: number;
  productName: string;
  createdAt: Date;
}

const TestPayments = () => {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState<string | null>(null);
  const [payments, setPayments] = useState<PixPayment[]>([]);
  
  // Form state
  const [value, setValue] = useState('1.00');
  const [productName, setProductName] = useState('Produto Teste');
  const [customerName, setCustomerName] = useState('Cliente Teste');
  const [customerEmail, setCustomerEmail] = useState('teste@teste.com');
  const [customerPhone, setCustomerPhone] = useState('11999999999');

  const createTestPayment = async () => {
    setLoading(true);
    
    try {
      const numericValue = parseFloat(value);
      
      if (isNaN(numericValue) || numericValue < 0.50) {
        toast.error('Valor mínimo é R$ 0,50');
        return;
      }
      
      if (numericValue > 150) {
        toast.error('Valor máximo é R$ 150,00 (limite PushinPay)');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-pix', {
        body: {
          value: numericValue,
          productName,
          productId: 'test-product',
          customerName,
          customerEmail,
          customerPhone: `55${customerPhone.replace(/\D/g, '')}`,
        },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Erro ao criar PIX');
      }

      const newPayment: PixPayment = {
        pixId: data.pixId,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        status: data.status || 'pending',
        value: numericValue,
        productName,
        createdAt: new Date(),
      };

      setPayments(prev => [newPayment, ...prev]);
      toast.success('PIX de teste criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar PIX:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar PIX');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (pixId: string) => {
    setCheckingStatus(pixId);
    
    try {
      const payment = payments.find(p => p.pixId === pixId);
      
      const { data, error } = await supabase.functions.invoke('check-pix-status', {
        body: {
          pixId,
          productName: payment?.productName,
          value: payment ? payment.value * 100 : undefined,
        },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Erro ao verificar status');
      }

      setPayments(prev => 
        prev.map(p => 
          p.pixId === pixId 
            ? { ...p, status: data.status } 
            : p
        )
      );

      const statusMessages: Record<string, string> = {
        paid: 'Pagamento confirmado!',
        approved: 'Pagamento aprovado!',
        completed: 'Pagamento concluído!',
        pending: 'Aguardando pagamento...',
        expired: 'PIX expirado',
        cancelled: 'PIX cancelado',
      };

      toast.info(statusMessages[data.status] || `Status: ${data.status}`);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao verificar status');
    } finally {
      setCheckingStatus(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; label: string }> = {
      paid: { variant: 'default', icon: <CheckCircle className="h-3 w-3" />, label: 'Pago' },
      approved: { variant: 'default', icon: <CheckCircle className="h-3 w-3" />, label: 'Aprovado' },
      completed: { variant: 'default', icon: <CheckCircle className="h-3 w-3" />, label: 'Concluído' },
      pending: { variant: 'secondary', icon: <Clock className="h-3 w-3" />, label: 'Pendente' },
      expired: { variant: 'destructive', icon: <XCircle className="h-3 w-3" />, label: 'Expirado' },
      cancelled: { variant: 'destructive', icon: <XCircle className="h-3 w-3" />, label: 'Cancelado' },
    };

    const config = statusConfig[status] || { variant: 'outline' as const, icon: <Clock className="h-3 w-3" />, label: status };

    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Pagamentos de Teste</h1>
          <p className="text-muted-foreground">Simule pagamentos reais com a API PushinPay</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
        <p className="text-sm text-amber-600 dark:text-amber-400">
          <strong>Atenção:</strong> Estes são pagamentos reais via PushinPay. Use valores baixos para testes.
          Limite: R$ 0,50 a R$ 150,00.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Criar PIX de Teste
            </CardTitle>
            <CardDescription>
              Preencha os dados para gerar um PIX real de teste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="value">Valor (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0.50"
                  max="150"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="1.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Produto Teste"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Dados do Cliente (Simulado)</p>
              
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="email@teste.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefone</Label>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground text-sm font-medium">
                    +55
                  </div>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="11999999999"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={createTestPayment} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Gerar PIX de Teste
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              PIX Gerados
            </CardTitle>
            <CardDescription>
              {payments.length === 0 
                ? 'Nenhum PIX gerado ainda' 
                : `${payments.length} PIX gerado(s) nesta sessão`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Gere um PIX de teste para ver aqui</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {payments.map((payment) => (
                  <div 
                    key={payment.pixId} 
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{payment.productName}</p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(payment.value)}
                        </p>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>ID: {payment.pixId.slice(0, 20)}...</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(payment.pixId, 'PIX ID')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    {payment.qrCode && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input 
                            value={payment.qrCode} 
                            readOnly 
                            className="text-xs font-mono"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(payment.qrCode, 'Código PIX')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {payment.qrCodeBase64 && (
                          <div className="flex justify-center p-4 bg-white rounded-lg">
                            <img 
                              src={`data:image/png;base64,${payment.qrCodeBase64}`} 
                              alt="QR Code PIX"
                              className="w-32 h-32"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => checkPaymentStatus(payment.pixId)}
                      disabled={checkingStatus === payment.pixId}
                    >
                      {checkingStatus === payment.pixId ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Verificar Status
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPayments;
