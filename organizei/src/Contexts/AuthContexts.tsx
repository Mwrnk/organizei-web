import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Usuario, UserRole } from "../Types/User";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  updateUser: (newData: Partial<Usuario>) => void;
  currentPlan: string | null;
  loadUserPlan: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadUserPlan = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${userId}/plan`
      );
      const planName = response.data.data?.name?.toLowerCase() || null;
      setCurrentPlan(planName);
      
      if (planName && user) {
        const newRole = planName === 'premium' ? UserRole.PREMIUM : 
                       planName === 'enterprise' ? UserRole.PREMIUM : 
                       UserRole.FREE;
        setUser(prevUser => prevUser ? { ...prevUser, role: newRole, plan: planName } : null);
      }
    } catch (err) {
      console.error('Erro ao carregar plano:', err);
      setCurrentPlan(null);
    }
  };

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const token = localStorage.getItem("authenticacao");
      const userId = localStorage.getItem("idUsuario");

      if (token && userId) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(
            `http://localhost:3000/users/${userId}`
          );
          setUser(response.data.data);
          await loadUserPlan(userId); // carrega o plano ao autenticar
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

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const userResponse = await axios.get(
          `http://localhost:3000/users/${id}`
        );
        const userData = userResponse.data.data;
        
        const planResponse = await axios.get(
          `http://localhost:3000/users/${id}/plan`
        );
        const planName = planResponse.data.data?.name?.toLowerCase() || null;
        
        const newRole = planName === 'premium' ? UserRole.PREMIUM : 
                       planName === 'enterprise' ? UserRole.PREMIUM : 
                       UserRole.FREE;
        
        setUser({ ...userData, role: newRole, plan: planName });
        setCurrentPlan(planName);

        toast.success("Login realizado com sucesso!");
        navigate("/escolar");
      }
    } catch (error: any) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message
      );
      toast.error("Login ou senha incorretos");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authenticacao");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("email");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setCurrentPlan(null);
    navigate("/login");
    toast.info("Você saiu do sistema");
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem("authenticacao");
    return !!token;
  };

  const updateUser = (newData: Partial<Usuario>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...newData };
      
      // Atualiza o localStorage se necessário
      if (newData.email) {
        localStorage.setItem("email", newData.email);
      }
      
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
        setUser,
        updateUser,
        currentPlan,
        loadUserPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
