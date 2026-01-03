import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RotateCw, Gift, ShoppingCart, ArrowLeft, Copy, Ticket, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Roulette segments with weighted probabilities
// Higher weight = more likely to land on
const SEGMENTS = [
  { discount: 5, color: "#22c55e", weight: 30 },    // Very common
  { discount: 10, color: "#3b82f6", weight: 25 },   // Common
  { discount: 15, color: "#8b5cf6", weight: 20 },   // Moderate
  { discount: 20, color: "#f59e0b", weight: 15 },   // Less common
  { discount: 25, color: "#ec4899", weight: 5 },    // Rare
  { discount: 30, color: "#14b8a6", weight: 3 },    // Very rare
  { discount: 50, color: "#ef4444", weight: 1.5 },  // Ultra rare
  { discount: 85, color: "#fbbf24", weight: 0.5 },  // Legendary
];

const SPIN_PRICE = 2; // R$ 2.00 per spin

const Roulette = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [canFreeSpin, setCanFreeSpin] = useState(false);
  const [purchasedSpins, setPurchasedSpins] = useState(0);
  const [userCoupons, setUserCoupons] = useState<any[]>([]);
  const [wonDiscount, setWonDiscount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadUserData();
    loadUserCoupons();
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from("user_spins")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading spins:", error);
        return;
      }

      if (!data) {
        // Create initial record
        const { error: insertError } = await supabase
          .from("user_spins")
          .insert({
            user_id: user.id,
            email: profile.email,
            last_free_spin_at: null,
            purchased_spins: 0,
          });

        if (insertError) {
          console.error("Error creating spins record:", insertError);
        }
        setCanFreeSpin(true);
        setPurchasedSpins(0);
      } else {
        setPurchasedSpins(data.purchased_spins || 0);
        
        // Check if user can spin for free today
        if (!data.last_free_spin_at) {
          setCanFreeSpin(true);
        } else {
          const lastSpin = new Date(data.last_free_spin_at);
          const now = new Date();
          const isSameDay = lastSpin.toDateString() === now.toDateString();
          setCanFreeSpin(!isSameDay);
        }
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserCoupons = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_coupons")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUserCoupons(data);
    }
  };

  const getWeightedRandomDiscount = (): number => {
    const totalWeight = SEGMENTS.reduce((sum, seg) => sum + seg.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const segment of SEGMENTS) {
      random -= segment.weight;
      if (random <= 0) {
        return segment.discount;
      }
    }
    
    return SEGMENTS[0].discount; // Fallback
  };

  const generateCouponCode = (): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "ROLETA";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const spin = async (useFree: boolean) => {
    if (isSpinning) return;
    if (!user || !profile) return;

    if (useFree && !canFreeSpin) {
      toast.error("Você já usou seu giro grátis hoje!");
      return;
    }

    if (!useFree && purchasedSpins <= 0) {
      toast.error("Você não tem giros comprados!");
      return;
    }

    setIsSpinning(true);
    setWonDiscount(null);

    // Get weighted random discount
    const wonSegment = getWeightedRandomDiscount();
    const segmentIndex = SEGMENTS.findIndex(s => s.discount === wonSegment);
    
    // Calculate rotation to land on the winning segment
    const segmentAngle = 360 / SEGMENTS.length;
    const baseRotation = 360 * 5; // 5 full rotations
    const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2;
    const finalRotation = baseRotation + (360 - targetAngle) + Math.random() * (segmentAngle * 0.6) - (segmentAngle * 0.3);
    
    setRotation(prev => prev + finalRotation);

    // Wait for animation to finish
    setTimeout(async () => {
      setIsSpinning(false);
      setWonDiscount(wonSegment);

      // Generate coupon
      const couponCode = generateCouponCode();

      try {
        // Save coupon to database
        await supabase.from("user_coupons").insert({
          user_id: user.id,
          email: profile.email,
          coupon_code: couponCode,
          discount_percent: wonSegment,
        });

        // Update spins record
        if (useFree) {
          await supabase
            .from("user_spins")
            .update({ last_free_spin_at: new Date().toISOString() })
            .eq("user_id", user.id);
          setCanFreeSpin(false);
        } else {
          await supabase
            .from("user_spins")
            .update({ purchased_spins: purchasedSpins - 1 })
            .eq("user_id", user.id);
          setPurchasedSpins(prev => prev - 1);
        }

        loadUserCoupons();

        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-bold">🎉 Parabéns!</span>
            <span>Você ganhou {wonSegment}% de desconto!</span>
            <span className="text-xs">Cupom: {couponCode}</span>
          </div>
        );
      } catch (error) {
        console.error("Error saving coupon:", error);
        toast.error("Erro ao salvar cupom. Tente novamente.");
      }
    }, 4000);
  };

  const buySpins = async () => {
    // TODO: Integrate with PIX payment
    toast.info("Função de compra de giros em desenvolvimento!");
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Cupom copiado!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">🎰 Roleta de Descontos</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Roulette Wheel */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Gire e Ganhe!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative w-full max-w-[300px] mx-auto aspect-square">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
                </div>

                {/* Wheel */}
                <div
                  ref={wheelRef}
                  className="w-full h-full rounded-full border-4 border-yellow-400 shadow-2xl overflow-hidden relative"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                  }}
                >
                  {SEGMENTS.map((segment, index) => {
                    const angle = 360 / SEGMENTS.length;
                    const startAngle = index * angle;
                    
                    return (
                      <div
                        key={index}
                        className="absolute w-full h-full origin-center"
                        style={{
                          transform: `rotate(${startAngle}deg)`,
                        }}
                      >
                        <div
                          className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-center justify-end pr-4"
                          style={{
                            backgroundColor: segment.color,
                            transform: `rotate(${angle}deg) skewY(${90 - angle}deg)`,
                          }}
                        >
                          <span
                            className="text-white font-bold text-sm drop-shadow-md"
                            style={{
                              transform: `skewY(${-(90 - angle)}deg) rotate(${-angle / 2 - 45}deg)`,
                            }}
                          >
                            {segment.discount}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <Gift className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Won Discount Display */}
              {wonDiscount !== null && !isSpinning && (
                <div className="mt-6 text-center animate-fade-in">
                  <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg animate-pulse">
                    🎉 {wonDiscount}% OFF 🎉
                  </div>
                </div>
              )}

              {/* Spin Buttons */}
              <div className="mt-6 space-y-3">
                {canFreeSpin && (
                  <Button
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    onClick={() => spin(true)}
                    disabled={isSpinning}
                  >
                    <RotateCw className={`mr-2 h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
                    {isSpinning ? "Girando..." : "🎁 Giro Grátis do Dia!"}
                  </Button>
                )}

                {purchasedSpins > 0 && (
                  <Button
                    className="w-full h-14 text-lg font-bold"
                    onClick={() => spin(false)}
                    disabled={isSpinning}
                  >
                    <RotateCw className={`mr-2 h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
                    {isSpinning ? "Girando..." : `Usar Giro Comprado (${purchasedSpins} restantes)`}
                  </Button>
                )}

                {!canFreeSpin && purchasedSpins === 0 && !isSpinning && (
                  <div className="text-center text-muted-foreground py-4">
                    <p>Você já usou seu giro grátis hoje.</p>
                    <p className="text-sm">Volte amanhã ou compre mais giros!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Buy Spins & My Coupons */}
          <div className="space-y-6">
            {/* Buy Spins Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Comprar Giros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-semibold">1 Giro Extra</p>
                      <p className="text-sm text-muted-foreground">Mais chances de ganhar!</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">R$ {SPIN_PRICE.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">via PIX</p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={buySpins}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Comprar Giro por R$ {SPIN_PRICE.toFixed(2)}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Giros comprados não expiram e podem ser usados a qualquer momento.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* My Coupons Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Meus Cupons
                  {userCoupons.length > 0 && (
                    <Badge variant="secondary">{userCoupons.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userCoupons.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Você ainda não tem cupons. Gire a roleta para ganhar!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {userCoupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-primary">
                              {coupon.discount_percent}% OFF
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Expira em {format(new Date(coupon.expires_at), "dd/MM", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                            {coupon.coupon_code}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyCoupon(coupon.coupon_code)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">ℹ️ Como funciona?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Você ganha 1 giro grátis por dia</li>
                  <li>• Gire a roleta e ganhe descontos de até 85%</li>
                  <li>• Os cupons são válidos por 7 dias</li>
                  <li>• Você pode comprar giros extras por R$ {SPIN_PRICE.toFixed(2)} cada</li>
                  <li>• Use os cupons no checkout para aplicar o desconto</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roulette;