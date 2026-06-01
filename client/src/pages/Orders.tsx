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
import { Plus, Trash2, Download, Filter } from "lucide-react";
import { toast } from "sonner";

interface OrderForm {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  address?: string;
  description: string;
  area?: string;
  totalPrice?: string;
  deliveryPrice?: string;
}

const defaultForm: OrderForm = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  address: "",
  description: "",
  area: "",
  totalPrice: "",
  deliveryPrice: "",
};

export default function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<OrderForm>(defaultForm);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: quotations = [], refetch } = trpc.quotations.list.useQuery();
  
  const createQuotation = trpc.quotations.create.useMutation({
    onSuccess: () => {
      toast.success("Pedido criado com sucesso!");
      setShowForm(false);
      setFormData(defaultForm);
      refetch();
    },
    onError: () => toast.error("Erro ao criar pedido"),
  });

  const updateQuotation = trpc.quotations.update.useMutation({
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso!");
      refetch();
    },
    onError: () => toast.error("Erro ao atualizar pedido"),
  });

  const deleteQuotation = trpc.quotations.delete.useMutation({
    onSuccess: () => {
      toast.success("Pedido deletado com sucesso!");
      refetch();
    },
    onError: () => toast.error("Erro ao deletar pedido"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Preencha nome e email do cliente");
      return;
    }

    createQuotation.mutate(formData);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(defaultForm);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    updateQuotation.mutate({
      id,
      status: newStatus as "pending" | "approved" | "completed" | "rejected",
    });
  };

  const filteredQuotations = quotations.filter((q: any) =>
    q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      approved: { label: "Aprovado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      completed: { label: "Concluído", color: "bg-green-500/20 text-green-400 border-green-500/30" },
      rejected: { label: "Rejeitado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const config = statusMap[status] || statusMap.pending;
    return config;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: string | number | null | undefined) => {
    if (!value) return "R$ 0,00";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
            <p className="text-muted-foreground mt-1">Controle de orçamentos e vendas</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">Novo Pedido</DialogTitle>
                <DialogDescription>
                  Crie um novo pedido/orçamento para o cliente.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground">Nome do Cliente *</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Ex: João Silva"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">Email *</label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="Ex: joao@email.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">Telefone</label>
                  <Input
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="Ex: (11) 99999-9999"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">Endereço</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ex: Rua Principal, 123"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">Descrição *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o pedido/orçamento..."
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">Área (m²)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Ex: 500"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">Valor Total (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.totalPrice}
                      onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                      placeholder="Ex: 5000.00"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">Valor Entrega (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.deliveryPrice}
                      onChange={(e) => setFormData({ ...formData, deliveryPrice: e.target.value })}
                      placeholder="Ex: 500.00"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-accent text-accent-foreground">
                    Criar Pedido
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Buscar por cliente ou pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>

        {/* Orders Table */}
        {filteredQuotations.length === 0 ? (
          <Card className="p-12 text-center bg-card border border-border">
            <p className="text-muted-foreground mb-4">
              {quotations.length === 0 ? "Nenhum pedido cadastrado" : "Nenhum pedido encontrado"}
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-accent-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Pedido
            </Button>
          </Card>
        ) : (
          <Card className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Área (m²)</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Valor Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Entrega</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotations.map((quotation: any) => {
                    const statusConfig = getStatusBadge(quotation.status);
                    return (
                      <tr key={quotation.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          #{String(quotation.id).padStart(4, "0")}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {quotation.clientName}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                          {quotation.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(quotation.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {quotation.area ? parseFloat(quotation.area).toFixed(0) : "0"} m²
                        </td>
                        <td className="px-6 py-4 text-sm text-accent font-semibold">
                          {quotation.totalPrice ? formatCurrency(quotation.totalPrice) : "R$ 0,00"}
                        </td>
                        <td className="px-6 py-4 text-sm text-accent font-semibold">
                          {quotation.deliveryPrice ? formatCurrency(quotation.deliveryPrice) : "R$ 0,00"}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={quotation.status}
                            onChange={(e) => handleStatusChange(quotation.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color} bg-transparent cursor-pointer`}
                          >
                            <option value="pending">Pendente</option>
                            <option value="approved">Aprovado</option>
                            <option value="completed">Concluído</option>
                            <option value="rejected">Rejeitado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteQuotation.mutate({ id: quotation.id })}
                            className="p-2 hover:bg-red-500/10 rounded transition-colors text-muted-foreground hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
