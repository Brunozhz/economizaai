import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, DollarSign, ShoppingCart, TrendingUp, AlertCircle, Package, Clock, CheckCircle, XCircle, Download, Phone, Mail, MessageCircle, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

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

interface Customer {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string;
  createdAt: string;
  productInterest?: string;
  isConverted?: boolean;
}

interface AdminStats {
  totalPageViews: number;
  uniqueSessions: number;
  totalRevenue: number;
  totalPurchases: number;
  completedPurchases: number;
  totalCustomers: number;
  period: string;
  pageViewsByDate: { date: string; views: number }[];
  revenueByDate: { date: string; revenue: number }[];
  viewsByPage: { page: string; views: number }[];
  topProducts: TopProduct[];
  recentSales: RecentSale[];
  customers: Customer[];
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

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'registered':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Cadastrado</Badge>;
      case 'lead':
      case 'popup_cupom':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Lead</Badge>;
      case 'free_trial':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Trial Grátis</Badge>;
      case 'abandoned_cart':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Carrinho Abandonado</Badge>;
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };

  const formatWhatsAppLink = (phone: string | null) => {
    if (!phone) return null;
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${phoneWithCountry}`;
  };

  // Funções de exportação CSV
  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Relatório ${filename} exportado com sucesso!`);
  };

  const exportSalesCSV = () => {
    if (!stats?.recentSales || stats.recentSales.length === 0) {
      toast.error('Nenhuma venda para exportar');
      return;
    }
    
    const headers = ['ID', 'Produto', 'Preço', 'Preço Original', 'Quantidade', 'Status', 'Data'];
    const rows = stats.recentSales.map(sale => [
      sale.id,
      `"${sale.productName}"`,
      sale.price.toFixed(2).replace('.', ','),
      sale.originalPrice.toFixed(2).replace('.', ','),
      sale.quantity,
      sale.status === 'paid' || sale.status === 'completed' ? 'Pago' : sale.status === 'pending' ? 'Pendente' : 'Cancelado',
      new Date(sale.createdAt).toLocaleString('pt-BR')
    ]);
    
    const csv = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    downloadCSV(csv, `vendas_${periodLabels[period]}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportProductsCSV = () => {
    if (!stats?.topProducts || stats.topProducts.length === 0) {
      toast.error('Nenhum produto para exportar');
      return;
    }
    
    const headers = ['Posição', 'Produto', 'Quantidade Vendida', 'Faturamento', 'Última Venda'];
    const rows = stats.topProducts.map((product, index) => [
      index + 1,
      `"${product.name}"`,
      product.quantity,
      product.revenue.toFixed(2).replace('.', ','),
      product.lastSale ? new Date(product.lastSale).toLocaleString('pt-BR') : 'N/A'
    ]);
    
    const csv = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    downloadCSV(csv, `produtos_${periodLabels[period]}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportPageViewsCSV = () => {
    if (!stats?.pageViewsByDate || stats.pageViewsByDate.length === 0) {
      toast.error('Nenhuma visualização para exportar');
      return;
    }
    
    const headers = ['Data', 'Visualizações'];
    const rows = stats.pageViewsByDate.map(item => [
      new Date(item.date).toLocaleDateString('pt-BR'),
      item.views
    ]);
    
    const csv = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    downloadCSV(csv, `visualizacoes_${periodLabels[period]}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportRevenueCSV = () => {
    if (!stats?.revenueByDate || stats.revenueByDate.length === 0) {
      toast.error('Nenhum faturamento para exportar');
      return;
    }
    
    const headers = ['Data', 'Faturamento (R$)'];
    const rows = stats.revenueByDate.map(item => [
      new Date(item.date).toLocaleDateString('pt-BR'),
      item.revenue.toFixed(2).replace('.', ',')
    ]);
    
    const csv = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    downloadCSV(csv, `faturamento_${periodLabels[period]}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportFullReportCSV = () => {
    if (!stats) return;
    
    let csv = 'RELATÓRIO COMPLETO DO DASHBOARD\n';
    csv += `Período: ${periodLabels[period]}\n`;
    csv += `Data do Relatório: ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    // Resumo
    csv += '=== RESUMO ===\n';
    csv += `Total de Visualizações;${stats.totalPageViews}\n`;
    csv += `Visitantes Únicos;${stats.uniqueSessions}\n`;
    csv += `Faturamento Total;R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}\n`;
    csv += `Pedidos Pagos;${stats.completedPurchases}\n`;
    csv += `Total de Pedidos;${stats.totalPurchases}\n\n`;
    
    // Visualizações por data
    if (stats.pageViewsByDate.length > 0) {
      csv += '=== VISUALIZAÇÕES POR DIA ===\n';
      csv += 'Data;Visualizações\n';
      stats.pageViewsByDate.forEach(item => {
        csv += `${new Date(item.date).toLocaleDateString('pt-BR')};${item.views}\n`;
      });
      csv += '\n';
    }
    
    // Faturamento por data
    if (stats.revenueByDate.length > 0) {
      csv += '=== FATURAMENTO POR DIA ===\n';
      csv += 'Data;Faturamento (R$)\n';
      stats.revenueByDate.forEach(item => {
        csv += `${new Date(item.date).toLocaleDateString('pt-BR')};${item.revenue.toFixed(2).replace('.', ',')}\n`;
      });
      csv += '\n';
    }
    
    // Top Produtos
    if (stats.topProducts && stats.topProducts.length > 0) {
      csv += '=== PRODUTOS MAIS VENDIDOS ===\n';
      csv += 'Posição;Produto;Quantidade;Faturamento (R$)\n';
      stats.topProducts.forEach((product, index) => {
        csv += `${index + 1};"${product.name}";${product.quantity};${product.revenue.toFixed(2).replace('.', ',')}\n`;
      });
      csv += '\n';
    }
    
    // Vendas Recentes
    if (stats.recentSales && stats.recentSales.length > 0) {
      csv += '=== VENDAS RECENTES ===\n';
      csv += 'ID;Produto;Preço (R$);Status;Data\n';
      stats.recentSales.forEach(sale => {
        const status = sale.status === 'paid' || sale.status === 'completed' ? 'Pago' : sale.status === 'pending' ? 'Pendente' : 'Cancelado';
        csv += `${sale.id};"${sale.productName}";${sale.price.toFixed(2).replace('.', ',')};${status};${new Date(sale.createdAt).toLocaleString('pt-BR')}\n`;
      });
    }
    
    downloadCSV(csv, `relatorio_completo_${periodLabels[period]}_${new Date().toISOString().split('T')[0]}.csv`);
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
        
        <div className="flex flex-wrap items-center gap-2">
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
          
          <div className="h-6 w-px bg-border mx-2" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportFullReportCSV}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <User className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers?.toLocaleString('pt-BR') || 0}</div>
            <p className="text-xs text-muted-foreground">Total de contatos</p>
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

      {/* Customers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Clientes Recentes
          </CardTitle>
          <CardDescription>Contatos capturados - clique no WhatsApp para entrar em contato</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[500px] overflow-y-auto">
          {stats.customers && stats.customers.length > 0 ? (
            <div className="space-y-3">
              {stats.customers.map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{customer.name || 'Sem nome'}</p>
                      {getSourceBadge(customer.source)}
                      {customer.isConverted === false && customer.source === 'abandoned_cart' && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Não convertido</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email}
                      </span>
                      {customer.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {customer.phone}
                        </span>
                      )}
                    </div>
                    {customer.productInterest && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Interesse: {customer.productInterest}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Cadastrado em</p>
                      <p className="text-sm font-medium">{formatDate(customer.createdAt)}</p>
                    </div>
                    {customer.phone && formatWhatsAppLink(customer.phone) && (
                      <a
                        href={formatWhatsAppLink(customer.phone)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum cliente encontrado</p>
          )}
        </CardContent>
      </Card>

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
