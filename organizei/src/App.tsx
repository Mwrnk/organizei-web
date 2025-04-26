import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Perfil } from "./pages/Perfil/Perfil";
import { Notificacoes } from "./pages/Notificacoes/Notificacoes";
import { Configuracoes } from "./pages/Configuracoes/Configuracoes";
import { IA } from "./pages/IA/IA";
import { Planos } from "./pages/Planos/Planos";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./Contexts/AuthContexts";
import { PrivateRoute, PublicRoute, PremiumRoute } from "./Routes/Rotas";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
          </Route>
          
          {/* Rotas protegidas para usuários autenticados */}
          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/planos" element={<Planos />} />
            
            {/* Rota para IA - apenas usuários premium */}
            <Route path="/ia" element={
              <PremiumRoute>
                <IA />
              </PremiumRoute>
            } />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
