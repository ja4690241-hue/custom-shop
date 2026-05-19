import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement payment processing with Stripe
    toast.success("Pedido realizado com sucesso!");
    navigate("/pedidos");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/carrinho")}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Carrinho
          </button>
          <h1 className="text-4xl font-bold text-foreground">Finalizar Compra</h1>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dados Pessoais */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="fullName"
                placeholder="Nome Completo"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                placeholder="Telefone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* Endereço de Entrega */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Endereço de Entrega
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Input
                name="address"
                placeholder="Rua e Número"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="city"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="state"
                  placeholder="Estado"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  maxLength={2}
                />
                <Input
                  name="zipCode"
                  placeholder="CEP"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Dados de Pagamento */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Dados de Pagamento
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Input
                name="cardNumber"
                placeholder="Número do Cartão"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                maxLength={19}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="cardExpiry"
                  placeholder="MM/AA"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  required
                  maxLength={5}
                />
                <Input
                  name="cardCVC"
                  placeholder="CVC"
                  value={formData.cardCVC}
                  onChange={handleChange}
                  required
                  maxLength={3}
                />
              </div>
            </div>
          </section>

          {/* Resumo do Pedido */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Resumo do Pedido
            </h2>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-foreground">
                <span>Subtotal</span>
                <span>R$ 99,80</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Frete</span>
                <span>R$ 15,00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="text-accent">R$ 114,80</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground py-3 text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Confirmar Pedido
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/carrinho")}
                variant="outline"
                className="w-full"
              >
                Voltar
              </Button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
