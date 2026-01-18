import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const correlationID = searchParams.get('correlationID');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula um pequeno delay para melhorar a experiência
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-2 border-emerald-500/30 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 animate-bounce">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            🎉 Pagamento Confirmado!
          </CardTitle>
          <p className="text-muted-foreground">
            Seu pagamento foi processado com sucesso
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <p className="mt-4 text-muted-foreground">Carregando informações...</p>
            </div>
          ) : (
            <>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="h-6 w-6 text-emerald-500" />
                  <span className="text-lg font-bold text-emerald-500">
                    Seus créditos serão liberados em instantes!
                  </span>
                  <Sparkles className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Você receberá um e-mail de confirmação com todos os detalhes do seu pedido.
                </p>
              </div>

              {correlationID && (
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    ID da Transação:
                  </p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {correlationID}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Próximos passos:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Verifique seu e-mail para receber os detalhes do acesso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Seus créditos serão adicionados automaticamente à sua conta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Em caso de dúvidas, entre em contato com nosso suporte via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => navigate('/')}
                  className="flex-1 h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar para o Início
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
