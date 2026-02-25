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
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, Calendar, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isEditingRevenue, setIsEditingRevenue] = useState(false);
  const [editedRevenue, setEditedRevenue] = useState("");
  const [manualRevenue, setManualRevenue] = useState<number | null>(null);
  
  const { data: quotations = [] } = trpc.quotations.list.useQuery();
  const { data: products = [] } = trpc.products.list.useQuery();

  // Load manual revenue from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('manualRevenue');
    if (saved) {
      setManualRevenue(parseFloat(saved));
    }
  }, []);

  // Calculate statistics
  let totalRevenue = quotations.reduce((sum, q: any) => {
    const price = parseFloat(q.totalPrice || "0");
    return sum + price;
  }, 0);
  
  // Use manual revenue if set
  if (manualRevenue !== null) {
    totalRevenue = manualRevenue;
  }
  
  const totalOrders = quotations.length;
  const activeClients = new Set(quotations.map((q: any) => q.clientEmail)).size;
  const totalProducts = products.length;

  // Monthly data for chart
  const monthlyData = [
    { month: "24/02", value: 25000 },
    { month: "24/02", value: 45000 },
  ];

  const handleEditRevenue = () => {
    setEditedRevenue(totalRevenue.toString());
    setIsEditingRevenue(true);
  };
  
  const handleSaveRevenue = () => {
    const newRevenue = parseFloat(editedRevenue);
    if (!isNaN(newRevenue)) {
      setManualRevenue(newRevenue);
      localStorage.setItem('manualRevenue', newRevenue.toString());
      setIsEditingRevenue(false);
    }
  };

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
          <Card className="p-6 bg-card border border-border hover:border-accent/50 transition-colors cursor-pointer" onClick={handleEditRevenue}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Receita Total
                </p>
                <p className="text-3xl font-bold text-accent mt-2">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Edit2 className="w-6 h-6 text-accent" />
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

        {/* Dialog para editar receita */}
        <Dialog open={isEditingRevenue} onOpenChange={setIsEditingRevenue}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle>Editar Receita Total</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Valor da Receita (R$)</label>
                <Input
                  type="number"
                  value={editedRevenue}
                  onChange={(e) => setEditedRevenue(e.target.value)}
                  placeholder="0.00"
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingRevenue(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveRevenue} className="bg-accent hover:bg-accent/90">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Fluxo de Vendas */}
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Fluxo de Vendas</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Volume dos últimos pedidos registrados</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Bar dataKey="value" fill="#FF6B35" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Próximas Entregas */}
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Próximas Entregas</h3>
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div className="flex items-center justify-center h-[300px] text-center">
              <p className="text-muted-foreground">Nenhuma entrega programada.</p>
            </div>
          </Card>
        </div>

        {/* Orçamentos Recentes */}
        {quotations.length > 0 && (
          <Card className="p-6 bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Orçamentos Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 text-muted-foreground">ID</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Cliente</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Valor</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.slice(0, 5).map((q: any, idx: number) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-accent/5">
                      <td className="py-3 px-4">#{q.id}</td>
                      <td className="py-3 px-4">{q.clientName}</td>
                      <td className="py-3 px-4 text-accent">R$ {parseFloat(q.totalPrice || "0").toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          q.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                          q.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                          q.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {q.status === 'approved' ? 'Aprovado' :
                           q.status === 'pending' ? 'Pendente' :
                           q.status === 'completed' ? 'Concluído' :
                           'Rejeitado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
