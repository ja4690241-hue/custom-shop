import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Canecas", slug: "canecas", description: "Canecas personalizadas" },
  { id: "2", name: "Camisetas", slug: "camisetas", description: "Camisetas de alta qualidade" },
  { id: "3", name: "Kits", slug: "kits", description: "Kits de presentes" },
  { id: "4", name: "Acessórios", slug: "acessorios", description: "Acessórios diversos" },
];

export default function AdminCategoryForm() {
  const [, navigate] = useLocation();
  const params = useParams();
  const isEditing = !!params.id;

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("custom_shop_categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (isEditing && params.id) {
      const category = categories.find((c) => c.id === params.id);
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description,
        });
      }
    }
  }, [isEditing, params.id, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }

    let updatedCategories;
    if (isEditing && params.id) {
      updatedCategories = categories.map((c) =>
        c.id === params.id ? { ...c, ...formData } : c
      );
      toast.success("Categoria atualizada com sucesso!");
    } else {
      const newCategory = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      updatedCategories = [...categories, newCategory];
      toast.success("Categoria criada com sucesso!");
    }

    localStorage.setItem("custom_shop_categories", JSON.stringify(updatedCategories));
    navigate("/admin/categorias");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/admin/categorias")}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Categorias
          </button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </h1>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-8 rounded-xl shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome da Categoria *</label>
            <Input
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
                setFormData({ ...formData, name, slug });
              }}
              placeholder="Ex: Canecas"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug (URL) *</label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="ex: canecas"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a categoria..."
              rows={4}
            />
          </div>

          <div className="pt-6 flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-accent text-accent-foreground h-12 text-lg font-bold"
            >
              <Save className="w-5 h-5 mr-2" />
              {isEditing ? "Salvar Alterações" : "Cadastrar Categoria"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/categorias")}
              className="h-12 px-8"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
