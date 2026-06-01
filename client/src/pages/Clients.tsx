import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Users, Mail, Phone, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Clients() {
  const { data: clients = [], isLoading } = trpc.clients.list.useQuery();
  const { data: quotations = [] } = trpc.quotations.list.useQuery();
  const createMutation = trpc.clients.create.useMutation();
  const deleteMutation = trpc.clients.delete.useMutation();
  const utils = trpc.useUtils();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Nome e email são obrigatórios");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        notes: formData.notes || undefined,
      });
      toast.success("Cliente criado com sucesso");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        notes: "",
      });
      setIsOpen(false);
      await utils.clients.list.invalidate();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar cliente");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Cliente deletado com sucesso");
      await utils.clients.list.invalidate();
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar cliente");
    }
  };

  const getQuotationCount = (clientId: number) => {
    // Since quotations don't have a direct clientId field, we'll count based on email matching
    // This is a temporary solution until quotations are properly linked to clients
    return 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus clientes e informações de contato</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Nome *</Label>
                  <Input
                    placeholder="Nome do cliente"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Email *</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Telefone</Label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Endereço</Label>
                  <Input
                    placeholder="Rua, número"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">Cidade</Label>
                    <Input
                      placeholder="São Paulo"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Estado</Label>
                    <Input
                      placeholder="SP"
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-foreground">CEP</Label>
                  <Input
                    placeholder="01310-100"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-foreground">Notas</Label>
                  <Input
                    placeholder="Observações adicionais"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-black"
                >
                  {createMutation.isPending ? "Criando..." : "Criar Cliente"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total de Clientes
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{clients.length}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Orçamentos
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{quotations.length}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Mail className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Média por Cliente
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {clients.length > 0 ? (quotations.length / clients.length).toFixed(1) : "0"}
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="p-6 bg-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Lista de Clientes</h2>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Carregando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum cliente cadastrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Telefone</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cidade</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client: any) => (
                    <tr key={client.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-foreground">{client.name}</td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {client.phone || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{client.city || "-"}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Deletar cliente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
