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
import { Plus, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface GalleryForm {
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
}

const defaultForm: GalleryForm = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
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
    if (!formData.title) {
      toast.error("Preencha o título da obra");
      return;
    }

    const payload = {
      title: formData.title,
      imageUrl: formData.imageUrl || "",
      description: formData.description,
      location: formData.location,
    };

    if (editingId) {
      updateWork.mutate({ id: editingId, ...payload });
    } else {
      createWork.mutate(payload);
    }
  };

  const handleEdit = (work: any) => {
    setFormData(work);
    setEditingId(work.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(defaultForm);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Galeria de Obras</h1>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Obra
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Obra" : "Nova Obra"}
                </DialogTitle>
                <DialogDescription>
                  Adicione detalhes e fotos da obra realizada
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Título *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Pavimentação Residencial - Quilombo"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Localização</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Quilombo, SC"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">URL da Imagem</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    type="url"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Cole o link da imagem hospedada na nuvem
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva os detalhes da obra..."
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-accent text-accent-foreground">
                    {editingId ? "Atualizar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Gallery Grid */}
        {works.length === 0 ? (
          <Card className="p-12 text-center bg-card border border-border">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Nenhuma obra cadastrada</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Obra
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work: any) => (
              <Card
                key={work.id}
                className="overflow-hidden bg-card border border-border hover:border-accent/50 transition-all group"
              >
                <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center overflow-hidden relative">
                  {work.imageUrl ? (
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-5xl">🏗️</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(work)}
                      className="bg-background/80 hover:bg-background"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteWork.mutate({ id: work.id })}
                      className="bg-background/80 hover:bg-red-500/20 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{work.title}</h3>
                  {work.location && (
                    <p className="text-sm text-muted-foreground mb-2">📍 {work.location}</p>
                  )}
                  {work.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {work.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
