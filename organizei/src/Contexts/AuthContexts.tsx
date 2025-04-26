import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Usuario } from "../Types/User";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Definindo a interface do contexto
interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado ao iniciar
  useEffect(() => {
    const checkUserAuthentication = async () => {
      const token = localStorage.getItem("authenticacao");
      const userId = localStorage.getItem("idUsuario");

      if (token && userId) {
        try {
          // Configura o token no header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // Busca os dados do usuário
          const response = await axios.get(`http://localhost:3000/users/${userId}`);
          setUser(response.data.data);
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          localStorage.removeItem("authenticacao");
          localStorage.removeItem("idUsuario");
          localStorage.removeItem("email");
        }
      }
      
      setIsLoading(false);
    };

    checkUserAuthentication();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const token = response.data.data.token;
      const id = response.data.data.user.id;

      if (token) {
        localStorage.setItem("authenticacao", token);
        localStorage.setItem("idUsuario", id);
        localStorage.setItem("email", email);

        // Configura o token no header para requisições futuras
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Busca os dados do usuário
        const userResponse = await axios.get(`http://localhost:3000/users/${id}`);
        setUser(userResponse.data.data);
        
        toast.success("Login realizado com sucesso!");
        navigate("/perfil");
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.response?.data || error.message);
      toast.error("Login ou senha incorretos");
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem("authenticacao");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("email");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/");
    toast.info("Você saiu do sistema");
  };

  // Função para verificar autenticação
  const checkAuth = (): boolean => {
    const token = localStorage.getItem("authenticacao");
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
}
