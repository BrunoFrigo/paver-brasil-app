import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Eye, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminQuotations() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: quotations = [], refetch } = trpc.quotations.list.useQuery();
  const updateQuotation = trpc.quotations.update.useMutation({
    onSuccess: () => {
      toast.success("Orçamento atualizado com sucesso!");
      refetch();
    },
    onError: () => toast.error("Erro ao atualizar orçamento"),
  });

  const selectedQuotation = quotations.find((q) => q.id === selectedId);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Orçamentos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quotations List */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border overflow-hidden">
            {quotations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Nenhum orçamento recebido
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((quotation: any) => (
                      <tr
                        key={quotation.id}
                        className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
                          selectedId === quotation.id ? "bg-accent/10" : ""
                        }`}
                      >
                        <td className="px-6 py-3 text-foreground">{quotation.clientName}</td>
                        <td className="px-6 py-3 text-foreground text-sm">{quotation.clientEmail}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(quotation.status)}
                            <span className="text-sm text-foreground">
                              {getStatusLabel(quotation.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedId(quotation.id)}
                            className="border-accent text-accent hover:bg-accent/5"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="bg-card rounded-lg border border-border p-6 h-fit sticky top-24">
            {selectedQuotation ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Detalhes do Orçamento</h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium text-foreground">{selectedQuotation.clientName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground text-sm break-all">
                      {selectedQuotation.clientEmail}
                    </p>
                  </div>

                  {selectedQuotation.clientPhone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium text-foreground">{selectedQuotation.clientPhone}</p>
                    </div>
                  )}

                  {selectedQuotation.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium text-foreground text-sm">{selectedQuotation.address}</p>
                    </div>
                  )}

                  {selectedQuotation.area && (
                    <div>
                      <p className="text-sm text-muted-foreground">Área</p>
                      <p className="font-medium text-foreground">{selectedQuotation.area} m²</p>
                    </div>
                  )}

                  {selectedQuotation.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Descrição</p>
                      <p className="font-medium text-foreground text-sm">
                        {selectedQuotation.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedQuotation.status)}
                      <span className="font-medium text-foreground">
                        {getStatusLabel(selectedQuotation.status)}
                      </span>
                    </div>
                  </div>

                  {selectedQuotation.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notas</p>
                      <p className="font-medium text-foreground text-sm">{selectedQuotation.notes}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <label className="block text-sm font-medium text-foreground">Atualizar Status</label>
                  <div className="space-y-2">
                    {["pending", "approved", "completed", "rejected"].map((status) => (
                      <Button
                        key={status}
                        onClick={() =>
                          updateQuotation.mutate({
                            id: selectedQuotation.id,
                            status: status as any,
                          })
                        }
                        variant={selectedQuotation.status === status ? "default" : "outline"}
                        className="w-full justify-start"
                      >
                        {getStatusIcon(status)}
                        <span className="ml-2">{getStatusLabel(status)}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notas</label>
                  <textarea
                    defaultValue={selectedQuotation.notes || ""}
                    onBlur={(e) => {
                      if (e.target.value !== (selectedQuotation.notes || "")) {
                        updateQuotation.mutate({
                          id: selectedQuotation.id,
                          notes: e.target.value,
                        });
                      }
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Selecione um orçamento para ver os detalhes
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
