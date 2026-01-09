import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaqs } from "@/hooks/useFaqs";

const FAQSection = () => {
  const { faqs, loading } = useFaqs();

  if (loading) {
    return null;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12">
          <span className="text-gradient">Perguntas Frequentes</span>
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={faq.id} 
              value={`item-${index}`}
              className="card-decree rounded-xl border-none px-6"
            >
              <AccordionTrigger className="font-display text-left text-foreground hover:text-primary hover:no-underline py-5">
                {faq.pergunta}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                {faq.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
