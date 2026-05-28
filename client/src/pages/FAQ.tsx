import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Pedidos",
    questions: [
      {
        q: "Quanto tempo leva para meu pedido chegar?",
        a: "Os pedidos são processados em até 3 dias úteis e entregues em até 7 dias úteis via transportadora. Você receberá um código de rastreamento por email."
      },
      {
        q: "Posso rastrear meu pedido?",
        a: "Sim! Após o envio, você receberá um código de rastreamento que pode ser acompanhado no site da transportadora."
      },
      {
        q: "Qual é o prazo de entrega para outras regiões?",
        a: "Para regiões remotas, o prazo pode ser de até 15 dias úteis. O valor do frete varia conforme a localização."
      }
    ]
  },
  {
    category: "Pagamento",
    questions: [
      {
        q: "Quais são as formas de pagamento?",
        a: "Aceitamos PIX (instantâneo), cartão de crédito (parcelado em até 12x) e boleto (vencimento em 3 dias)."
      },
      {
        q: "Meu pagamento é seguro?",
        a: "Sim! Todos os pagamentos são criptografados e processados por gateways de pagamento certificados."
      },
      {
        q: "Posso parcelar minha compra?",
        a: "Sim! Você pode parcelar em até 12x sem juros no cartão de crédito."
      }
    ]
  },
  {
    category: "Personalização",
    questions: [
      {
        q: "Como funciona a personalização?",
        a: "Você escolhe o produto, seleciona a cor, tamanho e adiciona texto/imagem. Pode usar a IA para sugestões de design!"
      },
      {
        q: "Posso usar meu próprio logo?",
        a: "Sim! Você pode fazer upload de imagens e logos para personalizar seus produtos."
      },
      {
        q: "Há limite de caracteres para o texto?",
        a: "Recomendamos até 50 caracteres para garantir uma boa visualização no produto."
      }
    ]
  },
  {
    category: "Devoluções",
    questions: [
      {
        q: "Qual é a política de devolução?",
        a: "Oferecemos 30 dias de garantia de satisfação. Se não gostar, devolvemos seu dinheiro."
      },
      {
        q: "Como faço uma devolução?",
        a: "Entre em contato conosco via WhatsApp ou email e enviaremos um código de devolução."
      },
      {
        q: "Quanto tempo leva para receber o reembolso?",
        a: "Após recebermos o produto devolvido, o reembolso é processado em até 5 dias úteis."
      }
    ]
  },
  {
    category: "Produtos",
    questions: [
      {
        q: "Os produtos são de boa qualidade?",
        a: "Sim! Usamos materiais premium e processos de personalização de alta qualidade."
      },
      {
        q: "Posso encomendar produtos em quantidade?",
        a: "Sim! Para pedidos em lote, entre em contato para orçamento especial."
      },
      {
        q: "Quais tamanhos estão disponíveis?",
        a: "Oferecemos tamanhos P, M, G e GG. Consulte a tabela de medidas antes de comprar."
      }
    ]
  }
];

export default function FAQ() {
  const [, navigate] = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Perguntas Frequentes</h1>
          <p className="text-xl text-slate-600">Encontre respostas para as dúvidas mais comuns</p>
        </section>

        {/* FAQs by Category */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <section key={categoryIndex}>
              <h2 className="text-2xl font-black text-slate-900 mb-6 pb-4 border-b-2 border-blue-600">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const globalIndex = categoryIndex * 100 + index;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-white shadow-lg hover:shadow-xl transition overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition"
                      >
                        <h3 className="text-lg font-bold text-slate-900 text-left">{faq.q}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 border-t border-slate-200 bg-slate-50">
                          <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <section className="mt-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center shadow-lg">
          <h2 className="text-3xl font-black text-white mb-4">Não encontrou sua resposta?</h2>
          <p className="text-blue-100 mb-8">Entre em contato conosco! Estamos aqui para ajudar.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-white text-blue-600 hover:bg-slate-100 h-12 px-8 font-bold rounded-lg">
              📧 Email
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-slate-100 h-12 px-8 font-bold rounded-lg">
              💬 WhatsApp
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-slate-100 h-12 px-8 font-bold rounded-lg">
              📞 Telefone
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
