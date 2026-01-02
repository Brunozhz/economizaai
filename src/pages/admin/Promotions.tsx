import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Gift, Send, Sparkles, Percent, Zap, Star } from "lucide-react";

const quickPromotions = [
  { title: "🔥 30% OFF", discount: 30, icon: Zap, color: "bg-red-500" },
  { title: "💎 25% VIP", discount: 25, icon: Star, color: "bg-purple-500" },
  { title: "🎁 20% Presente", discount: 20, icon: Gift, color: "bg-green-500" },
  { title: "⚡ 35% Mega", discount: 35, icon: Sparkles, color: "bg-yellow-500" },
];

export default function Promotions() {
  const [sending, setSending] = useState(false);
  const [useCustom, setUseCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [customDiscount, setCustomDiscount] = useState("");

  const sendRandomPromotion = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-promotion", {
        body: { useRandom: true },
      });

      if (error) throw error;

      toast.success(`Promoção enviada para ${data.sent} clientes!`, {
        description: `${data.promotion.title} - ${data.promotion.discountPercentage}% OFF`,
      });
    } catch (error) {
      console.error("Error sending promotion:", error);
      toast.error("Erro ao enviar promoção");
    } finally {
      setSending(false);
    }
  };

  const sendQuickPromotion = async (discount: number, title: string) => {
    setSending(true);
    try {
      const content = `🎉 **PROMOÇÃO ESPECIAL!**\n\nVocê ganhou **${discount}% de desconto** em todos os nossos créditos!\n\n⏰ Oferta por tempo limitado!\n\n💰 Aproveite agora e economize!`;

      const { data, error } = await supabase.functions.invoke("send-promotion", {
        body: {
          useRandom: false,
          title,
          content,
          discountPercentage: discount,
        },
      });

      if (error) throw error;

      toast.success(`Promoção de ${discount}% enviada para ${data.sent} clientes!`);
    } catch (error) {
      console.error("Error sending promotion:", error);
      toast.error("Erro ao enviar promoção");
    } finally {
      setSending(false);
    }
  };

  const sendCustomPromotion = async () => {
    if (!customTitle.trim() || !customContent.trim()) {
      toast.error("Preencha título e conteúdo");
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-promotion", {
        body: {
          useRandom: false,
          title: customTitle,
          content: customContent,
          discountPercentage: parseInt(customDiscount) || 0,
        },
      });

      if (error) throw error;

      toast.success(`Promoção customizada enviada para ${data.sent} clientes!`);
      setCustomTitle("");
      setCustomContent("");
      setCustomDiscount("");
    } catch (error) {
      console.error("Error sending promotion:", error);
      toast.error("Erro ao enviar promoção");
    } finally {
      setSending(false);
    }
  };

  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Promoções
          </h1>
          <p className="text-muted-foreground">
            Envie promoções e descontos para todos os clientes
          </p>
        </div>

        {/* Envio Rápido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Envio Rápido
            </CardTitle>
            <CardDescription>
              Clique para enviar uma promoção instantânea para todos os clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickPromotions.map((promo) => (
                <Button
                  key={promo.discount}
                  variant="outline"
                  className="h-20 flex flex-col gap-1"
                  disabled={sending}
                  onClick={() => sendQuickPromotion(promo.discount, promo.title)}
                >
                  <promo.icon className={`h-6 w-6`} />
                  <span className="font-bold">{promo.discount}% OFF</span>
                </Button>
              ))}
            </div>

            <div className="border-t pt-4">
              <Button
                onClick={sendRandomPromotion}
                disabled={sending}
                className="w-full"
                size="lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {sending ? "Enviando..." : "Enviar Promoção Aleatória"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Promoção Customizada */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-green-500" />
                  Promoção Customizada
                </CardTitle>
                <CardDescription>
                  Crie uma promoção personalizada
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="use-custom">Ativar</Label>
                <Switch
                  id="use-custom"
                  checked={useCustom}
                  onCheckedChange={setUseCustom}
                />
              </div>
            </div>
          </CardHeader>
          {useCustom && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Promoção</Label>
                <Input
                  id="title"
                  placeholder="Ex: 🔥 SUPER PROMOÇÃO! 50% OFF"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  placeholder="Ex: 30"
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo da Mensagem</Label>
                <Textarea
                  id="content"
                  placeholder="Escreva a mensagem promocional aqui..."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  rows={6}
                />
              </div>

              <Button
                onClick={sendCustomPromotion}
                disabled={sending}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? "Enviando..." : "Enviar Promoção Customizada"}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Dicas */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Dicas para Promoções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use emojis para chamar atenção 🔥💎🎁</li>
              <li>• Crie urgência com prazos limitados</li>
              <li>• Descontos entre 20-35% têm melhor conversão</li>
              <li>• Envie promoções nos horários de pico (12h, 18h, 21h)</li>
              <li>• Personalize as mensagens com o nome do produto</li>
            </ul>
          </CardContent>
        </Card>
      </div>
  );
}
