import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContexts";
import { UserRole, getUserPermissions } from "../Types/User";
import { ReactNode } from "react";

// Componente para rotas protegidas que requerem autenticação
export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se estiver autenticado, renderiza o componente filho
  return <Outlet />;
};

// Componente para rotas públicas que não podem ser acessadas quando autenticado
export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se estiver autenticado, redireciona para o perfil
  if (isAuthenticated) {
    return <Navigate to="/perfil" replace />;
  }

  // Se não estiver autenticado, renderiza o componente filho
  return <Outlet />;
};

interface PermissionRouteProps {
  requiredPermission: keyof ReturnType<typeof getUserPermissions>;
  fallbackPath?: string;
  children: ReactNode;
}

// Componente para rotas que requerem permissões específicas
export const PermissionRoute = ({ 
  requiredPermission, 
  fallbackPath = "/perfil",
  children 
}: PermissionRouteProps) => {
  const { user, isLoading } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não tiver usuário ou não tiver a permissão requerida
  if (!user || !getUserPermissions(user.role)[requiredPermission]) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Se tiver a permissão, renderiza o componente filho
  return <>{children}</>;
};

// Componente para rotas que requerem role premium
export const PremiumRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Se estiver carregando, mostra um indicador de carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não tiver usuário ou não for premium
  if (!user || user.role !== UserRole.PREMIUM && user.role !== UserRole.ADMIN) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px" }}>
        <h2>Acesso Restrito</h2>
        <p>Esta funcionalidade é exclusiva para usuários premium.</p>
        <button
          onClick={() => window.location.href = "/planos"}
          style={{
            backgroundColor: "#1d1b20",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            marginTop: "20px",
            cursor: "pointer"
          }}
        >
          Ver Planos
        </button>
        <button
          onClick={() => window.location.href = "/perfil"}
          style={{
            backgroundColor: "transparent",
            color: "#1d1b20",
            padding: "10px 20px",
            border: "1px solid #1d1b20",
            borderRadius: "4px",
            marginTop: "20px",
            marginLeft: "10px",
            cursor: "pointer"
          }}
        >
          Voltar para Perfil
        </button>
      </div>
    );
  }

  // Se for premium, renderiza o componente filho
  return <>{children}</>;
};
