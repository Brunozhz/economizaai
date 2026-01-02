import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Eye, DollarSign, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminStats {
  totalPageViews: number;
  uniqueSessions: number;
  totalRevenue: number;
  totalPurchases: number;
  completedPurchases: number;
  pageViewsByDate: { date: string; views: number }[];
  revenueByDate: { date: string; revenue: number }[];
  viewsByPage: { page: string; views: number }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError('Sessão expirada');
          return;
        }

        const response = await supabase.functions.invoke('admin-stats', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
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

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
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
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das métricas do seu app</p>
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
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
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
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
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
            <CardDescription>Acessos ao site nos últimos 30 dias</CardDescription>
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
            <CardDescription>Receita nos últimos 30 dias</CardDescription>
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
                <div key={item.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{item.page || '/'}</span>
                  </div>
                  <span className="text-muted-foreground">{item.views} views</span>
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
