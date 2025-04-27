import { Header } from "../../Components/Header";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TituloPage = styled.p`
  text-align: center;
`;

const TituloBusca = styled.h1`
  text-align: center;
`;

const ContainerBusca = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  position: relative;
`;

const BuscaUser = styled.input`
  padding: 16px;
  width: 400px;
`;

const ListaResultados = styled.ul`
  position: absolute;
  top: 70px;
  width: 400px;
  background: white;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 8px;
  z-index: 10;
`;

const ItemResultado = styled.li`
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export function Comunidade() {
  const [busca, setBusca] = useState("");
  const [todosUsuarios, setTodosUsuarios] = useState<any[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const response = await axios.get(`http://localhost:3000/users`);
        setTodosUsuarios(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar usuários");
      }
    }
    carregarUsuarios();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const valor = event.target.value;
    setBusca(valor);

    const filtrados = todosUsuarios.filter((user) =>
      user.name.toLowerCase().includes(valor.toLowerCase())
    );
    setUsuariosFiltrados(filtrados);
  }

  function handleSelecionarUsuario(id: string) {
    navigate(`/perfilbusca/${id}`);
  }

  return (
    <div>
      <Header />
      <TituloPage>#Comunidade</TituloPage>
      <TituloBusca>O que está procurando hoje?</TituloBusca>

      <ContainerBusca>
        <BuscaUser
          type="text"
          value={busca}
          onChange={handleChange}
          placeholder="Digite o nome da pessoa"
        />

        {usuariosFiltrados.length > 0 && (
          <ListaResultados>
            {usuariosFiltrados.map((user) => (
              <ItemResultado
                key={user._id}
                onClick={() => handleSelecionarUsuario(user._id)}
              >
                {user.name}
              </ItemResultado>
            ))}
          </ListaResultados>
        )}
      </ContainerBusca>
    </div>
  );
}
