import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Mail, Phone, MapPin } from "lucide-react";

export default function Clients() {
  const { data: quotations = [] } = trpc.quotations.list.useQuery();

  // Extract unique clients from quotations
  const clients = Array.from(
    new Map(
      quotations.map((q: any) => [
        q.clientEmail,
        {
          name: q.clientName,
          email: q.clientEmail,
          phone: q.clientPhone,
          address: q.address,
          quotationCount: 0,
        },
      ])
    ).values()
  ).map((client: any) => ({
    ...client,
    quotationCount: quotations.filter((q: any) => q.clientEmail === client.email).length,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus clientes e informações de contato</p>
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
          {clients.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum cliente cadastrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Telefone</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Endereço</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Orçamentos</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client: any, index: number) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-foreground">{client.name}</td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {client.phone || "-"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {client.address || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                          {client.quotationCount}
                        </span>
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
