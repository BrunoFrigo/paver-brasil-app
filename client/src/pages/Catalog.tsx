import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Filter } from "lucide-react";

export default function Catalog() {
  const [, navigate] = useLocation();
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const { data: products = [], isLoading } = trpc.products.list.useQuery();

  const filteredProducts = products.filter((p) => {
    if (selectedType && p.type !== selectedType) return false;
    if (selectedColor && p.color !== selectedColor) return false;
    return true;
  });

  const types = Array.from(new Set(products.map((p) => p.type)));
  const colors = Array.from(new Set(products.map((p) => p.color).filter(Boolean)));

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
          <h1 className="text-3xl font-bold text-foreground">Catálogo de Produtos</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-accent" />
                <h2 className="font-semibold text-foreground">Filtros</h2>
              </div>

              <div className="space-y-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Tipo de Produto
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedType("")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedType === ""
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      Todos
                    </button>
                    {types.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type || "")}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedType === type
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Cor
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedColor("")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedColor === ""
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      Todas
                    </button>
                    {colors.map((color) => (
                      <button
                        key={color || "empty"}
                        onClick={() => setSelectedColor(color || "")}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedColor === color
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedType("");
                    setSelectedColor("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando produtos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum produto encontrado com os filtros selecionados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all hover:shadow-lg"
                  >
                    <div className="aspect-square bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                      <div className="text-5xl">📦</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                      <div className="space-y-2 mb-4">
                        {product.color && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Cor:</span>{" "}
                            <span className="font-medium text-foreground">{product.color}</span>
                          </p>
                        )}
                        {product.dimensions && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Dimensões:</span>{" "}
                            <span className="font-medium text-foreground">{product.dimensions}</span>
                          </p>
                        )}
                        {product.price && (
                          <p className="text-lg font-bold text-accent">
                            R$ {parseFloat(product.price.toString()).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => navigate("/orcamento")}
                        className="w-full bg-accent text-accent-foreground hover:opacity-90"
                      >
                        Solicitar Orçamento
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
