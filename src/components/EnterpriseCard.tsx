import { useState } from "react";
import { Rocket, Building2, Zap, Users, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnterpriseChatModal from "./EnterpriseChatModal";

const EnterpriseCard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Card Container */}
            <div className="relative rounded-3xl overflow-hidden">
              {/* Animated gradient border */}
              <div 
                className="absolute inset-0 rounded-3xl p-[2px] animate-border-glow"
                style={{
                  background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #3b82f6, #8b5cf6, #06b6d4)',
                  backgroundSize: '300% 100%',
                }}
              >
                <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950" />
              </div>

              {/* Content */}
              <div className="relative p-8 md:p-12">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

                {/* Header */}
                <div className="relative z-10 text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">Grandes Volumes</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3 flex items-center justify-center gap-3">
                    <Rocket className="h-8 w-8 text-cyan-400" />
                    Enterprise & Agências
                  </h2>
                  
                  <p className="text-lg text-slate-300 max-w-xl mx-auto">
                    Volume máximo com tarifa de atacado para quem precisa de escala.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">A partir de</p>
                      <p className="text-lg font-bold text-white">1.000 créditos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Preço especial</p>
                      <p className="text-lg font-bold text-green-400">R$ 0,20/crédito</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Atendimento</p>
                      <p className="text-lg font-bold text-white">Personalizado</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="relative z-10 text-center">
                  <Button
                    onClick={() => setIsChatOpen(true)}
                    className="h-14 px-10 text-lg font-bold rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-105"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Solicitar Cotação de Volume
                  </Button>
                  
                  <p className="mt-4 text-sm text-slate-500">
                    Sem compromisso • Resposta em até 2 horas úteis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Modal */}
      <EnterpriseChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default EnterpriseCard;
