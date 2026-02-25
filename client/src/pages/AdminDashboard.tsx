import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, FileText, Image, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: quotations = [] } = trpc.quotations.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: products = [] } = trpc.products.list.useQuery();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Calculate statistics
  const totalQuotations = quotations.length;
  const pendingQuotations = quotations.filter((q) => q.status === "pending").length;
  const approvedQuotations = quotations.filter((q) => q.status === "approved").length;
  const completedQuotations = quotations.filter((q) => q.status === "completed").length;
  const totalProducts = products.length;

  // Chart data
  const statusData = [
    { name: "Pendente", value: pendingQuotations, fill: "#f97316" },
    { name: "Aprovado", value: approvedQuotations, fill: "#22c55e" },
    { name: "Concluído", value: completedQuotations, fill: "#3b82f6" },
  ];

  const quotationTrend = [
    { month: "Jan", quotations: 0 },
    { month: "Fev", quotations: totalQuotations },
    { month: "Mar", quotations: 0 },
    { month: "Abr", quotations: 0 },
    { month: "Mai", quotations: 0 },
    { month: "Jun", quotations: 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Bem-vindo ao painel administrativo da PaverBrasil</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Orçamentos</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalQuotations}</p>
              </div>
              <FileText className="w-12 h-12 text-accent/20" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pendentes</p>
                <p className="text-3xl font-bold text-accent mt-2">{pendingQuotations}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-accent/20" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Produtos</p>
                <p className="text-3xl font-bold text-foreground mt-2">{totalProducts}</p>
              </div>
              <Package className="w-12 h-12 text-accent/20" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Concluídos</p>
                <p className="text-3xl font-bold text-foreground mt-2">{completedQuotations}</p>
              </div>
              <Image className="w-12 h-12 text-accent/20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Distribuição de Status</h2>
            {statusData.some((d) => d.value > 0) ? (
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
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </div>

          {/* Quotation Trend */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Tendência de Orçamentos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quotationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="quotations" fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/admin/produtos")}
              className="bg-accent text-accent-foreground hover:opacity-90"
            >
              Gerenciar Produtos
            </Button>
            <Button
              onClick={() => navigate("/admin/orcamentos")}
              className="bg-accent text-accent-foreground hover:opacity-90"
            >
              Ver Orçamentos
            </Button>
            <Button
              onClick={() => navigate("/admin/galeria")}
              className="bg-accent text-accent-foreground hover:opacity-90"
            >
              Gerenciar Galeria
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-accent text-accent hover:bg-accent/5"
            >
              Ver Site
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
