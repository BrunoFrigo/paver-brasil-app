import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  FileText,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ImageIcon,
} from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { data: quotations = [] } = trpc.quotations.list.useQuery();
  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: gallery = [] } = trpc.gallery.list.useQuery();

  // Calculate statistics
  const totalQuotations = quotations.length;
  const pendingQuotations = quotations.filter((q: any) => q.status === "pending").length;
  const approvedQuotations = quotations.filter((q: any) => q.status === "approved").length;
  const completedQuotations = quotations.filter((q: any) => q.status === "completed").length;
  const rejectedQuotations = quotations.filter((q: any) => q.status === "rejected").length;

  // Status distribution data
  const statusData = [
    { name: "Pendente", value: pendingQuotations, fill: "#FFA500" },
    { name: "Aprovado", value: approvedQuotations, fill: "#10B981" },
    { name: "Concluído", value: completedQuotations, fill: "#3B82F6" },
    { name: "Rejeitado", value: rejectedQuotations, fill: "#EF4444" },
  ];

  // Monthly trend data
  const monthlyData = [
    { month: "Jan", orçamentos: 2 },
    { month: "Fev", orçamentos: 4 },
    { month: "Mar", orçamentos: 3 },
    { month: "Abr", orçamentos: 5 },
    { month: "Mai", orçamentos: 4 },
    { month: "Jun", orçamentos: 6 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao painel administrativo da PaverBrasil
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Orçamentos</p>
                <p className="text-3xl font-bold text-foreground">{totalQuotations}</p>
              </div>
              <FileText className="w-8 h-8 text-accent/50" />
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-500">{pendingQuotations}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500/50" />
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Produtos</p>
                <p className="text-3xl font-bold text-foreground">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-accent/50" />
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Obras Realizadas</p>
                <p className="text-3xl font-bold text-foreground">{gallery.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-accent/50" />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="p-6 bg-card border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Distribuição de Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Trend */}
          <Card className="p-6 bg-card border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Tendência de Orçamentos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="orçamentos"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold text-foreground">{approvedQuotations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold text-foreground">{completedQuotations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rejeitados</p>
                <p className="text-2xl font-bold text-foreground">{rejectedQuotations}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-card border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/produtos")}
              className="bg-accent text-accent-foreground hover:opacity-90 h-12"
            >
              <Package className="w-4 h-4 mr-2" />
              Gerenciar Produtos
            </Button>
            <Button
              onClick={() => navigate("/orcamentos")}
              className="bg-accent text-accent-foreground hover:opacity-90 h-12"
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Orçamentos
            </Button>
            <Button
              onClick={() => navigate("/galeria")}
              className="bg-accent text-accent-foreground hover:opacity-90 h-12"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Gerenciar Galeria
            </Button>
          </div>
        </Card>

        {/* Recent Quotations */}
        <Card className="p-6 bg-card border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Orçamentos Recentes</h2>
          {quotations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum orçamento recebido</p>
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
                    <tr key={q.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{q.clientName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{q.clientEmail}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            q.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : q.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : q.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
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
