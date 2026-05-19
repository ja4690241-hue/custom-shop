import { useLocation } from "wouter";
import { useCartContext } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function Cart() {
  const [, navigate] = useLocation();
  const { items, removeItem, updateQuantity, total } = useCartContext();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-foreground">Carrinho de Compras</h1>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground/60 text-lg mb-6">Seu carrinho está vazio</p>
            <Button
              onClick={() => navigate("/produtos")}
              className="bg-accent text-accent-foreground"
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-lg p-6 flex gap-6"
                >
                  <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-3">
                      {item.customization.text && (
                        <>Texto: {item.customization.text}<br /></>
                      )}
                      {item.customization.size && (
                        <>Tamanho: {item.customization.size}<br /></>
                      )}
                      {item.customization.color && (
                        <div className="flex items-center gap-2">
                          Cor:{" "}
                          <div
                            className="w-4 h-4 rounded border border-border"
                            style={{ backgroundColor: item.customization.color }}
                          />
                        </div>
                      )}
                    </p>
                    <p className="text-accent font-bold">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded border border-border hover:border-accent transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded border border-border hover:border-accent transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Resumo do Pedido
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal ({items.length} itens)</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Frete</span>
                    <span>Calcular</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-foreground mb-6">
                  <span>Total</span>
                  <span className="text-accent">R$ {total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-accent text-accent-foreground py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  Ir para Checkout
                </Button>

                <Button
                  onClick={() => navigate("/produtos")}
                  variant="outline"
                  className="w-full mt-3"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
