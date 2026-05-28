import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Zap, Shield, Truck, Award, Users } from "lucide-react";

export default function About() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Zap,
      title: "Rápido",
      description: "Entrega em até 7 dias úteis para todo o Brasil"
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Pagamento 100% seguro com PIX e cartão de crédito"
    },
    {
      icon: Heart,
      title: "Qualidade",
      description: "Produtos de alta qualidade com acabamento premium"
    },
    {
      icon: Truck,
      title: "Frete Grátis",
      description: "Frete grátis em compras acima de R$ 100"
    },
    {
      icon: Award,
      title: "Garantia",
      description: "Garantia de satisfação ou seu dinheiro de volta"
    },
    {
      icon: Users,
      title: "Suporte",
      description: "Atendimento ao cliente 24/7 via WhatsApp"
    }
  ];

  const team = [
    { name: "João Silva", role: "Fundador & Designer", image: "👨‍💼" },
    { name: "Maria Santos", role: "Gerente de Produção", image: "👩‍💼" },
    { name: "Carlos Oliveira", role: "Especialista em Logística", image: "👨‍💼" }
  ];

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

      <main className="container max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <section className="mb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Sobre a Custom Shop
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Somos uma loja especializada em personalização de produtos. Desde 2020, transformamos ideias em realidade com qualidade e criatividade.
          </p>
        </section>

        {/* Story */}
        <section className="mb-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-6">Nossa História</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Tudo começou com uma simples ideia: criar produtos únicos e personalizados que refletissem a personalidade de cada cliente.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Hoje, somos referência no mercado de customização, com milhares de clientes satisfeitos em todo o Brasil.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Cada produto é feito com cuidado e atenção aos detalhes, garantindo qualidade e satisfação total.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-12 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-2xl font-black text-slate-900">Criatividade em Primeiro Lugar</p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">Por Que Escolher a Gente?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-black text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">Nosso Time</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg text-center hover:shadow-xl transition">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{member.name}</h3>
                <p className="text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20 grid gap-8 md:grid-cols-4">
          {[
            { number: "5K+", label: "Clientes Felizes" },
            { number: "10K+", label: "Produtos Personalizados" },
            { number: "4.9★", label: "Avaliação Média" },
            { number: "24/7", label: "Suporte ao Cliente" }
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg text-center">
              <p className="text-4xl font-black text-blue-600 mb-2">{stat.number}</p>
              <p className="text-slate-600 font-semibold">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center shadow-lg">
          <h2 className="text-3xl font-black text-white mb-4">Pronto para Personalizar?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore nossa coleção de produtos e crie algo único e especial para você.
          </p>
          <Button
            onClick={() => navigate("/produtos")}
            className="bg-white text-blue-600 hover:bg-slate-100 h-12 px-8 text-base font-bold rounded-lg"
          >
            Explorar Produtos
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-white py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <h3 className="font-black text-lg mb-4">Custom Shop</h3>
              <p className="text-slate-400 text-sm">Personalizando produtos desde 2020</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produtos</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Bonés</a></li>
                <li><a href="#" className="hover:text-white transition">Camisetas</a></li>
                <li><a href="#" className="hover:text-white transition">Moletons</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <p className="text-slate-400 text-sm">
                📧 contato@customshop.com<br />
                📱 (11) 99999-9999<br />
                📍 São Paulo, SP
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 Custom Shop. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
