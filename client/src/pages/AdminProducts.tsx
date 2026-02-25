import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Minus } from "lucide-react";
import { toast } from "sonner";

interface ProductForm {
  name: string;
  type: string;
  description: string;
  color?: string;
  dimensions?: string;
  price?: string;
  imageUrl?: string;
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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductForm>(defaultForm);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products = [], refetch } = trpc.products.list.useQuery();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Produto adicionado com sucesso!");
      setShowForm(false);
      setFormData(defaultForm);
      refetch();
    },
    onError: () => toast.error("Erro ao adicionar produto"),
  });

  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      setEditingId(null);
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
    if (!formData.name) {
      toast.error("Preencha o nome do produto");
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

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(defaultForm);
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.color?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground mt-1">Catálogo de paver e blocos de concreto</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">Cadastrar Produto</DialogTitle>
                <DialogDescription>
                  Adicione um novo item ao catálogo.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-foreground">Nome do Produto</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Paver Retangular 6cm Natural"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">Preço</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">Categoria</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Selecione</option>
                      <option value="Paver">Paver</option>
                      <option value="Bloco">Bloco</option>
                      <option value="Guia">Guia</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">Unidade</label>
                  <select
                    value={formData.dimensions || "m2"}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="m2">Metro Quadrado (m²)</option>
                    <option value="un">Unidade (un)</option>
                    <option value="m">Metro Linear (m)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">Descrição (Opcional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detalhes técnicos..."
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:opacity-90 py-2 text-base font-semibold">
                  {editingId ? "Atualizar Produto" : "Salvar Produto"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div>
          <Input
            placeholder="Buscar por nome, tipo ou cor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center bg-card border border-border">
            <p className="text-muted-foreground mb-4">
              {products.length === 0 ? "Nenhum produto cadastrado" : "Nenhum produto encontrado"}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: any) => (
              <Card
                key={product.id}
                className="bg-card border border-border hover:border-accent/50 transition-all p-6 flex flex-col"
              >
                {/* Product Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-accent mb-1">
                    R$ {product.price || "0,00"}
                    <span className="text-sm text-muted-foreground ml-2">
                      /{product.type === "Paver" ? "m²" : "un"}
                    </span>
                  </p>
                </div>

                {/* Stock Section */}
                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Estoque
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-muted/30 rounded-md p-1">
                      <button className="p-1 hover:bg-muted rounded">
                        <Minus className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <span className="w-12 text-center text-foreground font-medium">0</span>
                      <button className="p-1 hover:bg-muted rounded">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <span className="text-accent font-semibold">
                      0 {product.type === "Paver" ? "m²" : "un"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    {product.description}
                  </p>
                )}

                {/* Product Details */}
                <div className="text-xs text-muted-foreground mb-4 space-y-1">
                  {product.color && <p>Cor: {product.color}</p>}
                  {product.dimensions && <p>Dimensões: {product.dimensions}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct.mutate({ id: product.id })}
                    className="flex-1 px-3 py-2 text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
