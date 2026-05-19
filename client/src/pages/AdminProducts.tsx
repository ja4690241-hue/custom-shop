import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Caneca Personalizada Premium",
    price: 49.90,
    category: "Canecas",
    stock: 15,
    active: true,
  },
  {
    id: 2,
    name: "Camiseta Básica Personalizada",
    price: 79.90,
    category: "Camisetas",
    stock: 8,
    active: true,
  },
];

export default function AdminProducts() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      // TODO: Implement delete
      alert("Produto deletado!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-foreground">Gerenciar Produtos</h1>
            <Button
              onClick={() => navigate("/admin/produtos/novo")}
              className="bg-accent text-accent-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">
                    Produto
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">
                    Categoria
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">
                    Preço
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">
                    Estoque
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-foreground font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-foreground/60">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-accent font-semibold">
                      R$ {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {product.stock} unidades
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/produtos/${product.id}/editar`)
                          }
                          className="p-2 text-accent hover:bg-accent/10 rounded transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
