import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/contexts/ProductsContext";
import { toast } from "sonner";

export default function AdminProducts() {
  const [, navigate] = useLocation();
  const { products, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar "${name}"?`)) {
      deleteProduct(id);
      toast.success("Produto deletado com sucesso!");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/produtos/${id}/editar`);
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
                          onClick={() => handleEdit(product.id)}
                          className="p-2 text-accent hover:bg-accent/10 rounded transition-colors"
                          title="Editar produto"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors"
                          title="Deletar produto"
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
              <p className="text-foreground/60">
                {products.length === 0
                  ? "Nenhum produto cadastrado. Clique em 'Novo Produto' para começar."
                  : "Nenhum produto encontrado com esses critérios de busca."}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-foreground/60">Total de Produtos</p>
            <p className="text-3xl font-bold text-accent">{products.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-foreground/60">Produtos Ativos</p>
            <p className="text-3xl font-bold text-green-600">
              {products.filter((p) => p.active).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-foreground/60">Total em Estoque</p>
            <p className="text-3xl font-bold text-blue-600">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
