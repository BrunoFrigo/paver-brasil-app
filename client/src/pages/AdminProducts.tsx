import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface ProductForm {
  name: string;
  type: string;
  description: string;
  color: string;
  dimensions: string;
  price: string;
  imageUrl: string;
}

const defaultForm: ProductForm = {
  name: "",
  type: "",
  description: "",
  color: "",
  dimensions: "",
  price: "",
  imageUrl: "",
};

export default function AdminProducts() {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductForm>(defaultForm);

  const { data: products = [], refetch } = trpc.products.list.useQuery();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      setShowForm(false);
      setFormData(defaultForm);
      refetch();
    },
    onError: () => toast.error("Erro ao criar produto"),
  });

  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      setEditingId(null);
      setShowForm(false);
      setFormData(defaultForm);
      refetch();
    },
    onError: () => toast.error("Erro ao atualizar produto"),
  });

  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto deletado com sucesso!");
      refetch();
    },
    onError: () => toast.error("Erro ao deletar produto"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateProduct.mutate({ id: editingId, ...formData });
    } else {
      createProduct.mutate(formData);
    }
  };

  const handleEdit = (product: any) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Produtos</h1>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData(defaultForm);
            }}
            className="bg-accent text-accent-foreground hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {editingId ? "Editar Produto" : "Novo Produto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tipo *
                  </label>
                  <Input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Ex: Paver, Bloco"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cor
                  </label>
                  <Input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Ex: Vermelho, Cinza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dimensões
                  </label>
                  <Input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="Ex: 20x10x8 cm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preço (R$)
                  </label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    URL da Imagem
                  </label>
                  <Input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="bg-accent text-accent-foreground hover:opacity-90"
                >
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {products.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Nenhum produto cadastrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Cor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-3 text-foreground">{product.name}</td>
                      <td className="px-6 py-3 text-foreground">{product.type}</td>
                      <td className="px-6 py-3 text-foreground">{product.color || "-"}</td>
                      <td className="px-6 py-3 text-foreground">
                        {product.price ? `R$ ${parseFloat(product.price).toFixed(2)}` : "-"}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="border-accent text-accent hover:bg-accent/5"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProduct.mutate({ id: product.id })}
                            className="border-destructive text-destructive hover:bg-destructive/5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
