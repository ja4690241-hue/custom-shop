import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular envio
    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso! Responderemos em breve.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setLoading(false);
    }, 1500);
  };

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

      <main className="container max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Entre em Contato</h1>
          <p className="text-xl text-slate-600">Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.</p>
        </section>

        <div className="grid gap-12 lg:grid-cols-3 mb-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
              <Mail className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600 mb-2">contato@customshop.com</p>
              <p className="text-sm text-slate-500">Resposta em até 24 horas</p>
            </div>

            {/* Phone */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
              <Phone className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">WhatsApp</h3>
              <p className="text-slate-600 mb-2">(11) 99999-9999</p>
              <p className="text-sm text-slate-500">Atendimento 24/7</p>
            </div>

            {/* Address */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
              <MapPin className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Endereço</h3>
              <p className="text-slate-600 mb-2">Rua das Flores, 123</p>
              <p className="text-sm text-slate-500">São Paulo, SP - 01234-567</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Nome</label>
                  <Input
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-lg border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-lg border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Telefone</label>
                <Input
                  name="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-12 rounded-lg border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Assunto</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full h-12 rounded-lg border border-slate-300 px-4 bg-white text-slate-900 font-semibold"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida sobre Produto</option>
                  <option value="pedido">Problema com Pedido</option>
                  <option value="devolucao">Devolução/Reembolso</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Mensagem</label>
                <textarea
                  name="message"
                  placeholder="Digite sua mensagem aqui..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 font-sans resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-base"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Enviando..." : "Enviar Mensagem"}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Responderemos sua mensagem em até 24 horas
              </p>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50 p-12 text-center shadow-lg">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Nos Visite</h2>
          <p className="text-slate-600 mb-6">Venha conhecer nosso espaço e ver os produtos pessoalmente</p>
          <div className="w-full h-64 rounded-xl bg-slate-200 flex items-center justify-center">
            <p className="text-slate-500">Mapa será exibido aqui</p>
          </div>
        </section>
      </main>
    </div>
  );
}
