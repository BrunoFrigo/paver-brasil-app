import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { data: quotations = [] } = trpc.quotations.list.useQuery();
  const { data: products = [] } = trpc.products.list.useQuery();

  // Calculate statistics
  const totalRevenue = quotations.reduce((sum, q: any) => {
    const price = parseFloat(q.estimatedValue || "0");
    return sum + price;
  }, 0);

  const totalOrders = quotations.length;
  const activeClients = new Set(quotations.map((q: any) => q.clientEmail)).size;
  const totalProducts = products.length;

  // Monthly data for chart
  const monthlyData = [
    { month: "24/02", value: 25000 },
    { month: "24/02", value: 45000 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o desempenho da Paver Brasil em tempo real
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Receita Total */}
          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Receita Total
                </p>
                <p className="text-3xl font-bold text-accent mt-2">
                  R$ {(totalRevenue / 1000).toFixed(0)}.000,00
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          {/* Total de Pedidos */}
          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total de Pedidos
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalOrders}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          {/* Clientes Ativos */}
          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Clientes Ativos
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{activeClients}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          {/* Produtos */}
          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Produtos
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalProducts}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Package className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fluxo de Vendas */}
          <Card className="lg:col-span-2 p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Fluxo de Vendas</h2>
                <p className="text-sm text-muted-foreground">Volume dos últimos pedidos registrados</p>
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Bar dataKey="value" fill="rgb(249, 115, 22)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Próximas Entregas */}
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Próximas Entregas</h2>
            </div>
            <div className="flex items-center justify-center h-64">
              <p className="text-center text-muted-foreground">Nenhuma entrega programada.</p>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6 bg-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Pedidos Recentes</h2>
          {quotations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum pedido recebido</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.slice(0, 5).map((q: any) => (
                    <tr key={q.id} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4">{q.clientName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{q.clientEmail}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            q.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : q.status === "approved"
                                ? "bg-green-500/20 text-green-400"
                                : q.status === "completed"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {q.status === "pending"
                            ? "Pendente"
                            : q.status === "approved"
                              ? "Aprovado"
                              : q.status === "completed"
                                ? "Concluído"
                                : "Rejeitado"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(q.createdAt).toLocaleDateString("pt-BR")}
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
