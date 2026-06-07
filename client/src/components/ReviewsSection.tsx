import { Star, User } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    name: "Maria Silva",
    rating: 5,
    text: "Adorei a qualidade! A caneca chegou perfeita e a personalização ficou excelente. Voltarei a comprar!",
    date: "2024-12-15",
  },
  {
    name: "João Santos",
    rating: 5,
    text: "Entrega rápida e produto de qualidade. Recomendo para todos os meus amigos!",
    date: "2024-12-10",
  },
  {
    name: "Ana Costa",
    rating: 4,
    text: "Muito bom! Apenas achei o frete um pouco alto, mas o produto vale a pena.",
    date: "2024-12-05",
  },
  {
    name: "Carlos Oliveira",
    rating: 5,
    text: "Perfeito para presente! Minha mãe amou a camiseta personalizada. Obrigado!",
    date: "2024-11-28",
  },
];

export function ReviewsSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            O que nossos clientes dizem
          </h2>
          <p className="text-slate-600">
            Mais de {DEFAULT_REVIEWS.length} clientes satisfeitos com nossos produtos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEFAULT_REVIEWS.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Estrelas */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-slate-700 mb-4 italic">"{review.text}"</p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{review.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(review.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Deixe sua avaliação e ganhe <strong>10% de desconto</strong> na próxima compra!
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
            <Star className="h-5 w-5" />
            Deixar Avaliação
          </button>
        </div>
      </div>
    </section>
  );
}
