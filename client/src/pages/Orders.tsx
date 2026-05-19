import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

interface Order {
  id: number;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  total: number;
  items: number;
}

const mockOrders: Order[] = [
  {
    id: 1001,
    date: "2026-05-15",
    status: "delivered",
    total: 114.80,
    items: 2,
  },
  {
    id: 1002,
    date: "2026-05-10",
    status: "shipped",
    total: 89.90,
    items: 1,
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const statusLabels = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
};

export default function Orders() {
  const [, navigate] = useLocation();

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
          <h1 className="text-4xl font-bold text-foreground">Meus Pedidos</h1>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {mockOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/60 text-lg mb-6">
              Você ainda não realizou nenhum pedido
            </p>
            <Button
              onClick={() => navigate("/produtos")}
              className="bg-accent text-accent-foreground"
            >
              Começar a Comprar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-sm text-foreground/60">Número do Pedido</p>
                    <p className="text-lg font-semibold text-foreground">
                      #{order.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-foreground/60">Data</p>
                    <p className="text-lg font-semibold text-foreground">
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-foreground/60">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-foreground/60">Total</p>
                    <p className="text-lg font-bold text-accent">
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => navigate(`/pedidos/${order.id}`)}
                      variant="outline"
                      className="text-accent border-accent hover:bg-accent/10"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
