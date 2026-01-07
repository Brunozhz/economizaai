import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, DollarSign, ShoppingCart, TrendingUp, AlertCircle, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
  image: string | null;
  lastSale: string;
}

interface RecentSale {
  id: string;
  productName: string;
  productImage: string | null;
  price: number;
  originalPrice: number;
  status: string;
  quantity: number;
  createdAt: string;
}

interface AdminStats {
  totalPageViews: number;
  uniqueSessions: number;
  totalRevenue: number;
  totalPurchases: number;
  completedPurchases: number;
  period: string;
  pageViewsByDate: { date: string; views: number }[];
  revenueByDate: { date: string; revenue: number }[];
  viewsByPage: { page: string; views: number }[];
  topProducts: TopProduct[];
  recentSales: RecentSale[];
}

type PeriodFilter = 'today' | 'yesterday' | '3d' | '7d' | '30d' | '1y';

const periodLabels: Record<PeriodFilter, string> = {
  today: 'Hoje',
  yesterday: 'Ontem',
  '3d': '3 dias',
  '7d': '7 dias',
  '30d': '30 dias',
  '1y': '1 ano'
};

const Dashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodFilter>('30d');

  const fetchStats = async (selectedPeriod: PeriodFilter) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Sessão expirada');
        return;
      }

      const response = await supabase.functions.invoke('admin-stats', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { period: selectedPeriod }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>;
      case 'cancelled':
      case 'expired':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={() => fetchStats(period)} className="ml-auto">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header with Period Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das métricas do seu app</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(Object.keys(periodLabels) as PeriodFilter[]).map((key) => (
            <Button
              key={key}
              variant={period === key ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(key)}
              className={period === key ? "bg-primary" : ""}
            >
              {periodLabels[key]}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPageViews.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{periodLabels[period]}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSessions.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Sessões únicas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Vendas confirmadas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPurchases} / {stats.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">Pagos / Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visualizações por Dia
            </CardTitle>
            <CardDescription>Acessos ao site - {periodLabels[period]}</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.pageViewsByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.pageViewsByDate}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                    formatter={(value: number) => [value, 'Visualizações']}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Faturamento por Dia
            </CardTitle>
            <CardDescription>Receita - {periodLabels[period]}</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.revenueByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    className="text-xs"
                  />
                  <YAxis 
                    className="text-xs"
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                    formatter={(value: number) => [formatCurrency(value), 'Receita']}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>Ranking por quantidade vendida</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topProducts && stats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      #{index + 1}
                    </div>
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} vendas • {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nenhuma venda registrada</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales - Notifications Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Vendas Recentes
            </CardTitle>
            <CardDescription>Últimas transações em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {stats.recentSales && stats.recentSales.length > 0 ? (
              <div className="space-y-3">
                {stats.recentSales.map((sale) => (
                  <div 
                    key={sale.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                      sale.status === 'paid' || sale.status === 'completed' 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : sale.status === 'pending'
                        ? 'bg-yellow-500/5 border-yellow-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    {sale.productImage ? (
                      <img 
                        src={sale.productImage} 
                        alt={sale.productName}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{sale.productName}</p>
                        {getStatusBadge(sale.status)}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-500">
                            {formatCurrency(sale.price)}
                          </span>
                          {sale.originalPrice > sale.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(sale.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(sale.createdAt)}
                        </span>
                      </div>
                      {sale.quantity > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Quantidade: {sale.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Nenhuma venda registrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Páginas Mais Acessadas</CardTitle>
          <CardDescription>Ranking de páginas por número de visualizações</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.viewsByPage.length > 0 ? (
            <div className="space-y-3">
              {stats.viewsByPage.slice(0, 10).map((item, index) => (
                <div key={item.page} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{item.page || '/'}</span>
                  </div>
                  <Badge variant="secondary">{item.views} views</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
