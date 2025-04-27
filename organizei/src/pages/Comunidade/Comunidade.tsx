import { Header } from "../../Components/Header";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import fotoCard from "../../../assets/fotoCard.png";

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
  border-radius: 10px;
  border: 1px solid #1a1a1a;
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

const CardsRecomendados = styled.div`
  padding: 0px 30px;
`;

const ContainerCards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const Cards = styled.div`
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    border: 1px solid black;
  }
`;

const FotoNoCard = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;

const DadosCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
  padding: 5px;
  gap: 4px;
`;

const CategoriaCard = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

const ContainerBotao = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const BotaoVerMais = styled.button`
  padding: 15px 25px;
  border-radius: 10px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #bbb;
    cursor: pointer;
  }
`;

const ContainerPublicar = styled.div`
  margin: 30px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
`;

const InputPublicacao = styled.input`
  width: 90%;
  margin: 10px 10px 0px 3px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const CheckboxContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 20px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
`;
const PubliqueText = styled.p`
  padding-left: 30px;
`;
const BotaoPublicar = styled.button<{ disabled: boolean }>`
  margin-top: 20px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#4caf50")};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#45a049")};
  }
`;
const Publicar = styled.div`
  background-color: white;
`;

export function Comunidade() {
  const [busca, setBusca] = useState("");
  const [todosUsuarios, setTodosUsuarios] = useState<any[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([]);
  const [textoPublicacao, setTextoPublicacao] = useState("");
  const [escolar, setEscolar] = useState(false);
  const [profissional, setProfissional] = useState(false);
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

  function handlePublicar() {
    if (textoPublicacao.trim() !== "" && (escolar || profissional)) {
      alert("Publicação enviada com sucesso!");
      setTextoPublicacao("");
      setEscolar(false);
      setProfissional(false);
    } else {
      alert("Preencha o card e selecione uma categoria.");
    }
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

      <CardsRecomendados>
        <p>#Recomendado</p>
        <ContainerCards>
          {[1, 2, 3, 4].map((_, index) => (
            <Cards key={index}>
              <FotoNoCard src={fotoCard} alt="imagem card" />
              <DadosCard>
                <p>Nome Card</p>
                <p>Data: 12/10/25</p>
                <CategoriaCard>
                  <p>Categoria:</p>
                  <p>Estudo</p>
                </CategoriaCard>
              </DadosCard>
            </Cards>
          ))}
        </ContainerCards>

        <ContainerBotao>
          <BotaoVerMais>Ver mais</BotaoVerMais>
        </ContainerBotao>
      </CardsRecomendados>
      <PubliqueText>#publique</PubliqueText>
      <ContainerPublicar>
        <div>
          <h3>Publique os seus cards mais fácil!</h3>
          <p>
            Espalhe o seu método de estudar/trabalhar para ajudar mais pessoas
            com um só clique.
          </p>
        </div>
        <Publicar>
          <InputPublicacao
            type="text"
            placeholder="Escolha seu Card"
            value={textoPublicacao}
            onChange={(e) => setTextoPublicacao(e.target.value)}
          />

          <CheckboxContainer>
            <CheckboxItem>
              <input
                type="checkbox"
                checked={escolar}
                onChange={(e) => setEscolar(e.target.checked)}
              />
              <label>Escolar</label>
            </CheckboxItem>

            <CheckboxItem>
              <input
                type="checkbox"
                checked={profissional}
                onChange={(e) => setProfissional(e.target.checked)}
              />
              <label>Profissional</label>
            </CheckboxItem>
            <BotaoPublicar
              disabled={!textoPublicacao.trim() || (!escolar && !profissional)}
              onClick={handlePublicar}
            >
              Publicar
            </BotaoPublicar>
          </CheckboxContainer>
        </Publicar>
      </ContainerPublicar>
    </div>
  );
}
