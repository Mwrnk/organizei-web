import { useEffect, useState } from "react";
import axios from "axios";
import{Usuario} from "../../Types/User"

export function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const idUsuario = localStorage.getItem("idUsuario");

    if (idUsuario) {
      axios
        .get(`http://localhost:3000/users/${idUsuario}`)
        .then((res) => {
          setUsuario(res.data.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar usuário:", err);
        })
        .finally(() => setCarregando(false));
    } else {
      console.warn("ID do usuário não encontrado no localStorage");
      setCarregando(false);
    }
  }, []);

  if (carregando) return <p>Carregando perfil...</p>;

  if (!usuario) return <p>Usuário não encontrado.</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Perfil de {usuario.name}</h1>
      <p>
        <strong>Código:</strong> {usuario.coduser}
      </p>
      <p>
        <strong>Email:</strong> {usuario.email}
      </p>
      <p>
        <strong>Data de nascimento:</strong>{" "}
        {new Date(usuario.dateOfBirth).toLocaleDateString()}
      </p>
    </div>
  );
}
