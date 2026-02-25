import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft } from "lucide-react";

export default function Gallery() {
  const [, navigate] = useLocation();
  const { data: works = [], isLoading } = trpc.gallery.list.useQuery();

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
          <h1 className="text-3xl font-bold text-foreground">Galeria de Obras</h1>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando galeria...</p>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma obra cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work: any) => (
              <div
                key={work.id}
                className="bg-card rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all hover:shadow-lg"
              >
                <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center overflow-hidden">
                  {work.imageUrl ? (
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl">🏗️</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{work.title}</h3>
                  {work.location && (
                    <p className="text-sm text-muted-foreground mb-2">📍 {work.location}</p>
                  )}
                  {work.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {work.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
