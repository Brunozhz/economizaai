import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Purchase {
  id: string;
  product_name: string;
  original_price: number;
  discounted_price: number;
  status: string;
  created_at: string;
  user_id: string;
}

const Orders = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPurchases(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pago
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'expired':
      case 'cancelled':
        return (
          <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            {status === 'expired' ? 'Expirado' : 'Cancelado'}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  const paidOrders = purchases.filter(p => p.status === 'paid' || p.status === 'completed');
  const totalRevenue = paidOrders.reduce((sum, p) => sum + p.discounted_price, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pedidos</h1>
        <p className="text-muted-foreground">{purchases.length} pedidos no total</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pedidos Pagos</p>
                <p className="text-2xl font-bold">{paidOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Package className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Lista de Pedidos
          </CardTitle>
          <CardDescription>Todos os pedidos realizados na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {purchases.length > 0 ? (
            <div className="divide-y divide-border">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-medium">{purchase.product_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(purchase.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-green-600">
                        {formatCurrency(purchase.discounted_price)}
                      </div>
                      {getStatusBadge(purchase.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum pedido encontrado</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
