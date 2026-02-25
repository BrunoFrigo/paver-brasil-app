import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Eye, Edit2, Trash2, ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Orders() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { data: quotations = [], refetch } = trpc.quotations.list.useQuery();
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

  const selectedOrder = quotations.find((q) => q.id === selectedOrderId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      approved: "Aprovado",
      completed: "Concluído",
      rejected: "Rejeitado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-blue-500/20 text-blue-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground mt-1">Gerencie todos os seus pedidos e orçamentos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{quotations.length}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pendentes
                </p>
                <p className="text-3xl font-bold text-yellow-400 mt-2">
                  {quotations.filter((q: any) => q.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Aprovados
                </p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {quotations.filter((q: any) => q.status === "approved").length}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Concluídos
                </p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {quotations.filter((q: any) => q.status === "completed").length}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="p-6 bg-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Lista de Pedidos</h2>
          {quotations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum pedido cadastrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((order: any) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-foreground">{order.clientName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.clientEmail}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedOrderId(order.id)}
                            className="hover:bg-muted"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteQuotation.mutate({ id: order.id })}
                            className="hover:bg-red-500/10 hover:text-red-500"
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
        </Card>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <Dialog open={!!selectedOrderId} onOpenChange={() => setSelectedOrderId(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Pedido</DialogTitle>
                <DialogDescription>
                  Informações completas do pedido #{selectedOrder.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                    <p className="text-foreground mt-1">{selectedOrder.clientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground mt-1">{selectedOrder.clientEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="text-foreground mt-1">{selectedOrder.clientPhone || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                  <p className="text-foreground mt-1">{selectedOrder.address || "-"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="text-foreground mt-1">{selectedOrder.description || "-"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Área (m²)</label>
                    <p className="text-foreground mt-1">{selectedOrder.area || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data</label>
                    <p className="text-foreground mt-1">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notas</label>
                    <p className="text-foreground mt-1">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrderId(null)}
                  >
                    Fechar
                  </Button>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateQuotation.mutate({
                        id: selectedOrder.id,
                        status: e.target.value as any,
                      })
                    }
                    className="px-3 py-2 bg-card border border-border rounded-md text-foreground"
                  >
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovado</option>
                    <option value="completed">Concluído</option>
                    <option value="rejected">Rejeitado</option>
                  </select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
