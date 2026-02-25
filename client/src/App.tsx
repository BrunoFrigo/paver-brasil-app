import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import AdminGallery from "./pages/AdminGallery";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import { useEffect, useState } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setLocation("/login");
    }
  }, [setLocation]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedRoute component={AdminDashboard} />} />
      <Route path="/produtos" component={() => <ProtectedRoute component={AdminProducts} />} />
      <Route path="/clientes" component={() => <ProtectedRoute component={Clients} />} />
      <Route path="/pedidos" component={() => <ProtectedRoute component={Orders} />} />
      <Route path="/galeria" component={() => <ProtectedRoute component={AdminGallery} />} />
      <Route path="/anotacoes" component={() => <ProtectedRoute component={Notes} />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
