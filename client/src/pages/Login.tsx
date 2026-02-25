import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("userSession", JSON.stringify(data.user));
        toast.success("Login realizado com sucesso!");
        setLocation("/");
        // Reload page to update auth state
        window.location.href = "/";
      }
    },
    onError: (error) => {
      toast.error(error.message || "Falha ao fazer login");
      setIsLoading(false);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PB</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-2">
            PaverBrasil
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Painel Administrativo
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">
                Usuário
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Credenciais de Demo:</strong>
              <br />
              Usuário: claudineifrigo
              <br />
              Senha: paverbrasil2026
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
