import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { ArrowRight, Layers, Palette, Zap } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-foreground">PaverBrasil</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#catalogo" className="text-foreground hover:text-accent transition-colors">
              Catálogo
            </a>
            <a href="#galeria" className="text-foreground hover:text-accent transition-colors">
              Galeria
            </a>
            <a href="#contato" className="text-foreground hover:text-accent transition-colors">
              Contato
            </a>
            {isAuthenticated && user?.role === "admin" ? (
              <Button
                onClick={() => navigate("/admin")}
                className="bg-accent text-accent-foreground hover:opacity-90"
              >
                Painel Admin
              </Button>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-accent text-accent-foreground hover:opacity-90">
                  Admin
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Transforme seus <span className="text-accent">espaços</span> com qualidade
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Pavers e blocos de concreto de alta qualidade para suas obras. Fabricação profissional com acabamento impecável.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/catalogo")}
                  className="bg-accent text-accent-foreground hover:opacity-90 px-8 py-6 text-lg"
                >
                  Ver Catálogo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => navigate("/orcamento")}
                  variant="outline"
                  className="px-8 py-6 text-lg border-accent text-accent hover:bg-accent/5"
                >
                  Solicitar Orçamento
                </Button>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-muted-foreground">Galeria de Produtos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-card">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            Por que escolher a <span className="text-accent">PaverBrasil</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: "Variedade de Cores",
                description: "Ampla gama de cores e modelos para se adequar ao seu projeto",
              },
              {
                icon: Layers,
                title: "Qualidade Premium",
                description: "Fabricação de alta qualidade com acabamento profissional",
              },
              {
                icon: Zap,
                title: "Entrega Rápida",
                description: "Prazos competitivos e entrega eficiente em toda a região",
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-xl border border-border hover:border-accent/50 transition-colors">
                <feature.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Solicite um orçamento gratuito e descubra como podemos ajudar seu projeto
          </p>
          <Button
            onClick={() => navigate("/orcamento")}
            className="bg-accent text-accent-foreground hover:opacity-90 px-8 py-6 text-lg"
          >
            Solicitar Orçamento Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-foreground">PaverBrasil</h4>
              <p className="text-muted-foreground text-sm">
                Qualidade e profissionalismo em pavimentação
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Produtos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Pavers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blocos</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Catálogo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Galeria</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contato</h4>
              <p className="text-sm text-muted-foreground">
                📍 Quilombo, SC<br />
                📧 paverbrasilqbo@gmail.com<br />
                📱 (49) 3346-XXXX
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 PaverBrasil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
