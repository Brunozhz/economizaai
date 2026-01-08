import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "Como funciona a entrega do acesso?",
    answer: "Após a confirmação do pagamento via PIX, você recebe o acesso imediatamente no seu e-mail cadastrado. O processo é 100% automático e leva menos de 5 minutos."
  },
  {
    question: "O acesso é vitalício?",
    answer: "Sim! Você paga uma única vez e tem acesso para sempre. Sem mensalidades, sem taxas escondidas. O conteúdo é seu para sempre."
  },
  {
    question: "E se eu não gostar ou não funcionar?",
    answer: "Oferecemos garantia incondicional de 24 horas. Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu dinheiro, sem perguntas."
  },
  {
    question: "Posso acessar pelo celular?",
    answer: "Com certeza! Nossa plataforma é 100% responsiva e funciona perfeitamente em qualquer dispositivo: celular, tablet, notebook ou computador."
  },
  {
    question: "O pagamento é seguro?",
    answer: "Totalmente seguro! Utilizamos PIX, o sistema de pagamento mais seguro do Brasil, regulamentado pelo Banco Central. Seus dados estão protegidos."
  },
  {
    question: "Preciso ter conhecimento técnico?",
    answer: "Não! Nossos produtos são desenvolvidos para serem simples e intuitivos. Qualquer pessoa consegue usar, mesmo sem experiência prévia."
  },
  {
    question: "Como entro em contato com o suporte?",
    answer: "Nosso suporte está disponível via WhatsApp para tirar todas as suas dúvidas. Respondemos rapidamente e estamos sempre prontos para ajudar!"
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer: "Sim, emitimos nota fiscal para todas as compras. Basta solicitar via WhatsApp após a confirmação do pagamento."
  }
];

const FAQ = () => {
  return (
    <section className="py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Tire suas dúvidas</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Perguntas <span className="text-primary">Frequentes</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns dos nossos clientes
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm px-4 md:px-6 overflow-hidden hover:border-primary/30 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA after FAQ */}
        <div className="mt-10 md:mt-14 text-center">
          <p className="text-muted-foreground mb-4">
            Ainda tem dúvidas? Fale diretamente conosco!
          </p>
          <a
            href="https://wa.me/5521965987305?text=Olá! Tenho uma dúvida sobre os produtos."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
