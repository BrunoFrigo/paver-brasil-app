import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function QuotationRequest() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    address: "",
    description: "",
    area: "",
  });

  const createQuotation = trpc.quotations.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Orçamento enviado com sucesso!");
      setTimeout(() => navigate("/"), 3000);
    },
    onError: (error) => {
      toast.error("Erro ao enviar orçamento. Tente novamente.");
      console.error(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }
    createQuotation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-accent mx-auto" />
          <h1 className="text-4xl font-bold text-foreground">Orçamento Enviado!</h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Obrigado por sua solicitação. Entraremos em contato em breve com uma proposta personalizada.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-accent text-accent-foreground hover:opacity-90"
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Solicitar Orçamento</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Informações Pessoais</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleChange}
                      placeholder="(XX) XXXXX-XXXX"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Informações do Projeto</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Endereço do Projeto
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Rua, número, bairro, cidade"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Área (m²)
                    </label>
                    <Input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="Ex: 100"
                      step="0.01"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Descrição do Projeto
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descreva seu projeto, tipo de paver desejado, cores, etc."
                      rows={5}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createQuotation.isPending}
                  className="flex-1 bg-accent text-accent-foreground hover:opacity-90"
                >
                  {createQuotation.isPending ? "Enviando..." : "Enviar Orçamento"}
                </Button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Informações Importantes</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Responderemos seu orçamento em até 24 horas</li>
              <li>✓ Todos os dados são mantidos em sigilo</li>
              <li>✓ Orçamento sem compromisso</li>
              <li>✓ Atendimento personalizado para seu projeto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
