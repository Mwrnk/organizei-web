import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";

export function Perfil() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <p>Carregando perfil...</p>;

  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Header />
      <h1>Perfil de {user.name}</h1>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <p>
          <strong>Código:</strong> {user.coduser}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Data de nascimento:</strong>{" "}
          {new Date(user.dateOfBirth).toLocaleDateString()}
        </p>
        
        <button 
          onClick={logout}
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
          Sair
        </button>
      </div>
    </div>
  );
}
