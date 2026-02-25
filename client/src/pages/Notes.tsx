import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Pin, PinOff, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const colorOptions = [
  { value: "yellow", label: "Amarelo", bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-900" },
  { value: "blue", label: "Azul", bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-900" },
  { value: "green", label: "Verde", bg: "bg-green-100", border: "border-green-300", text: "text-green-900" },
  { value: "pink", label: "Rosa", bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-900" },
  { value: "purple", label: "Roxo", bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-900" },
];

export default function Notes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "yellow",
  });

  const { data: notes = [] } = trpc.notes.list.useQuery();
  const createMutation = trpc.notes.create.useMutation({
    onSuccess: () => {
      toast.success("Anotação criada com sucesso!");
      setFormData({ title: "", content: "", color: "yellow" });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar anotação");
    },
  });

  const updateMutation = trpc.notes.update.useMutation({
    onSuccess: () => {
      toast.success("Anotação atualizada com sucesso!");
      setFormData({ title: "", content: "", color: "yellow" });
      setEditingId(null);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar anotação");
    },
  });

  const deleteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => {
      toast.success("Anotação deletada com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar anotação");
    },
  });

  const togglePinMutation = trpc.notes.update.useMutation({
    onSuccess: () => {
      toast.success("Anotação atualizada!");
    },
  });

  const handleOpenDialog = (note?: any) => {
    if (note) {
      setEditingId(note.id);
      setFormData({
        title: note.title,
        content: note.content,
        color: note.color || "yellow",
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", content: "", color: "yellow" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        title: formData.title,
        content: formData.content,
        color: formData.color,
      });
    } else {
      createMutation.mutate({
        title: formData.title,
        content: formData.content,
        color: formData.color,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta anotação?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleTogglePin = (note: any) => {
    togglePinMutation.mutate({
      id: note.id,
      isPinned: !note.isPinned,
    });
  };

  const pinnedNotes = notes.filter((n: any) => n.isPinned);
  const unpinnedNotes = notes.filter((n: any) => !n.isPinned);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Anotações</h1>
            <p className="text-muted-foreground mt-1">
              Organize suas notas e lembretes importantes
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Anotação
          </Button>
        </div>

        {/* Dialog para criar/editar anotação */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Anotação" : "Nova Anotação"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Título
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Título da anotação"
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">
                  Conteúdo
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Escreva sua anotação aqui..."
                  className="mt-2 w-full h-32 bg-slate-700 border border-slate-600 rounded-md text-white p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Cor
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color.value
                          ? "border-accent scale-110"
                          : "border-slate-600"
                      } ${color.bg}`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-accent hover:bg-accent/90"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Anotações Fixadas */}
        {pinnedNotes.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Fixadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map((note: any) => {
                const color = colorOptions.find((c) => c.value === note.color);
                return (
                  <Card
                    key={note.id}
                    className={`p-4 border-2 ${color?.border} ${color?.bg} cursor-pointer hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold text-sm ${color?.text}`}>
                        {note.title}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleTogglePin(note)}
                          className="p-1 hover:bg-black/10 rounded"
                          title="Desafixar"
                        >
                          <Pin className={`w-4 h-4 ${color?.text}`} />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm mb-3 ${color?.text} opacity-90`}>
                      {note.content}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenDialog(note)}
                        className="flex-1 px-2 py-1 text-xs rounded hover:bg-black/10 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 inline mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="flex-1 px-2 py-1 text-xs rounded hover:bg-red-500/20 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Deletar
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Anotações Normais */}
        {unpinnedNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Outras Anotações
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpinnedNotes.map((note: any) => {
                const color = colorOptions.find((c) => c.value === note.color);
                return (
                  <Card
                    key={note.id}
                    className={`p-4 border-2 ${color?.border} ${color?.bg} cursor-pointer hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold text-sm ${color?.text}`}>
                        {note.title}
                      </h3>
                      <button
                        onClick={() => handleTogglePin(note)}
                        className="p-1 hover:bg-black/10 rounded"
                        title="Fixar"
                      >
                        <PinOff className={`w-4 h-4 ${color?.text}`} />
                      </button>
                    </div>
                    <p className={`text-sm mb-3 ${color?.text} opacity-90`}>
                      {note.content}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenDialog(note)}
                        className="flex-1 px-2 py-1 text-xs rounded hover:bg-black/10 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 inline mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="flex-1 px-2 py-1 text-xs rounded hover:bg-red-500/20 text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Deletar
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Vazio */}
        {notes.length === 0 && (
          <Card className="p-12 text-center bg-card border border-border">
            <p className="text-muted-foreground mb-4">
              Nenhuma anotação criada ainda
            </p>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Anotação
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
