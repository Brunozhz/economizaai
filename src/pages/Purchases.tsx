import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, ShoppingBag, Clock, CheckCircle, XCircle, Sparkles, Settings } from 'lucide-react';
import logoImage from '@/assets/logo-new.jpeg';

interface Purchase {
  id: string;
  product_name: string;
  product_image: string | null;
  original_price: number;
  discounted_price: number;
  quantity: number;
  status: string;
  created_at: string;
}

const Purchases = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching purchases:', error);
      } else {
        setPurchases(data || []);
      }
      setLoadingPurchases(false);
    };

    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getUserName = () => {
    if (profile?.name) {
      return profile.name.split(' ')[0];
    }
    return 'amigo(a)';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src={logoImage} alt="EconomizaAI" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-foreground">Minha Conta</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="p-4 max-w-2xl mx-auto">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {getGreeting()}, {getUserName()}! 👋
                </h2>
                <p className="text-sm text-muted-foreground">
                  Bem-vindo(a) ao <span className="font-semibold text-primary">EconomizaAI</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchases Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Minhas Compras
          </h3>
        </div>

        {loadingPurchases ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Nenhuma compra ainda</h2>
            <p className="text-muted-foreground mb-6">
              Suas compras aparecerão aqui depois que você fizer seu primeiro pedido.
            </p>
            <Button onClick={() => navigate('/')}>
              Ver Ofertas
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      {purchase.product_image ? (
                        <img 
                          src={purchase.product_image} 
                          alt={purchase.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                        {purchase.product_name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(purchase.discounted_price)}
                        </span>
                        {purchase.original_price > purchase.discounted_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(purchase.original_price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(purchase.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(purchase.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
