import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface GalleryForm {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  completedAt?: string;
}

const defaultForm: GalleryForm = {
  title: "",
  description: "",
  imageUrl: "",
  location: "",
};

export default function AdminGallery() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<GalleryForm>(defaultForm);

  const { data: works = [], refetch } = trpc.gallery.list.useQuery();
  const createWork = trpc.gallery.create.useMutation({
    onSuccess: () => {
      toast.success("Obra adicionada com sucesso!");
      setShowForm(false);
      setFormData(defaultForm);
      refetch();
    },
    onError: () => toast.error("Erro ao adicionar obra"),
  });

  const updateWork = trpc.gallery.update.useMutation({
    onSuccess: () => {
      toast.success("Obra atualizada com sucesso!");
      setEditingId(null);
      setShowForm(false);
      setFormData(defaultForm);
      refetch();
    },
    onError: () => toast.error("Erro ao atualizar obra"),
  });

  const deleteWork = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Obra deletada com sucesso!");
      refetch();
    },
    onError: () => toast.error("Erro ao deletar obra"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      location: formData.location,
      completedAt: formData.completedAt ? new Date(formData.completedAt) : undefined,
    };

    if (editingId) {
      updateWork.mutate({ id: editingId, ...payload });
    } else {
      createWork.mutate(payload);
    }
  };

  const handleEdit = (work: any) => {
    setFormData({
      title: work.title,
      description: work.description || "",
      imageUrl: work.imageUrl,
      location: work.location || "",
      completedAt: work.completedAt ? new Date(work.completedAt).toISOString().split("T")[0] : "",
    });
    setEditingId(work.id);
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
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Galeria</h1>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData(defaultForm);
            }}
            className="bg-accent text-accent-foreground hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Obra
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {editingId ? "Editar Obra" : "Adicionar Obra"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Título *
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Pavimentação Residencial"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Localização
                  </label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Quilombo, SC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    URL da Imagem *
                  </label>
                  <Input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data de Conclusão
                  </label>
                  <Input
                    type="date"
                    name="completedAt"
                    value={formData.completedAt || ""}
                    onChange={handleChange}
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
                  placeholder="Descreva os detalhes da obra..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createWork.isPending || updateWork.isPending}
                  className="bg-accent text-accent-foreground hover:opacity-90"
                >
                  {editingId ? "Atualizar" : "Adicionar"}
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhuma obra cadastrada
            </div>
          ) : (
            works.map((work: any) => (
              <div key={work.id} className="bg-card rounded-lg border border-border overflow-hidden hover:border-accent/50 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center overflow-hidden">
                  {work.imageUrl ? (
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">🏗️</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{work.title}</h3>
                  {work.location && (
                    <p className="text-sm text-muted-foreground mb-2">📍 {work.location}</p>
                  )}
                  {work.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {work.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(work)}
                      className="flex-1 border-accent text-accent hover:bg-accent/5"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteWork.mutate({ id: work.id })}
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
