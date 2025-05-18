import { Header } from "../../Components/Header";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContexts";

const Container = styled.div`
  padding: 40px 60px;
`;
const Titulo = styled.h1`
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
`;
const Subtitulo = styled.p`
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
`;
const BuscaWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;
const InputBusca = styled.input`
  padding: 10px 16px;
  width: 300px;
  border-radius: 8px 0 0 8px;
  border: 1px solid #ccc;
  font-size: 14px;
`;
const BotaoBusca = styled.button`
  padding: 10px 16px;
  border-radius: 0 8px 8px 0;
  border: none;
  background-color: #333;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;
const GridCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
`;
const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;
const CardTitulo = styled.h3`
  font-size: 16px;
  margin: 10px 0 4px;
`;
const CardInfo = styled.p`
  font-size: 13px;
  color: #999;
  margin: 0;
`;
const VerMais = styled.button`
  margin: 32px auto 0;
  display: block;
  background-color: #eaeaea;
  border: none;
  padding: 12px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #ccc;
  }
`;
const ListaResultados = styled.ul`
  position: absolute;
  top: 305px;
  left: 38%;
  width: 20%;
  background: white;
  border: 1px solid #ddd;
  max-height: 100px;
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
  const [cards, setCards] = useState<any[]>([]);
  const [meusCards, setMeusCards] = useState<any[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCards();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user) fetchMeusCards();
  }, [user]);

  const fetchAllCards = async () => {
    try {
      const res = await axios.get("http://localhost:3000/comunidade/cards");
      setCards(res.data?.data || []);
      setVisibleCount(8);
    } catch (err) {
      console.error("Erro ao buscar cards:", err);
    }
  };

  const fetchMeusCards = async () => {
    try {
      const token = localStorage.getItem("authenticacao");
      const res = await axios.get("http://localhost:3000/cards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeusCards(res.data.data || []);
    } catch (error) {
      console.error("Erro ao buscar seus cards", error);
    }
  };

  const buscarCardPorTitulo = async () => {
    if (!searchTitle.trim()) {
      fetchAllCards();
      return;
    }
    try {
      const res = await axios.get(`http://localhost:3000/cards/${searchTitle}`);
      const card = res.data?.data;
      setCards(card ? [card] : []);
      setVisibleCount(1);
    } catch (error) {
      console.warn("Card não encontrado");
      setCards([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data.data);
    } catch (error) {
      console.error("Erro ao carregar usuários", error);
    }
  };

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTitle(value);
    const filtrados = users.filter((u) =>
      u.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtrados);
  };

  const handleSelectUser = (id: string) => {
    navigate(`/perfilbusca/${id}`);
  };

  const handlePublicar = async (cardId: string) => {
    try {
      const token = localStorage.getItem("authenticacao");

      await axios.post(
        `http://localhost:3000/comunidade/publish/${cardId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Card publicado com sucesso!");
      fetchMeusCards();
      fetchAllCards();
    } catch (err) {
      console.error("Erro ao publicar card", err);
      alert("Erro ao publicar card.");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Titulo>#comunidade</Titulo>
        <Subtitulo>O que está procurando hoje?</Subtitulo>

        <BuscaWrapper>
          <InputBusca
            type="text"
            placeholder="Digite o título do card ou nome do usuário"
            value={searchTitle}
            onChange={handleUserSearch}
          />
          <BotaoBusca onClick={buscarCardPorTitulo}>🔍</BotaoBusca>
        </BuscaWrapper>

        {filteredUsers.length > 0 && (
          <ListaResultados>
            {filteredUsers.map((user) => (
              <ItemResultado
                key={user._id}
                onClick={() => handleSelectUser(user._id)}
              >
                {user.name}
              </ItemResultado>
            ))}
          </ListaResultados>
        )}

        <GridCards>
          {cards.slice(0, visibleCount).map((card, index) => (
            <Card key={index}>
              <CardTitulo>{card.title}</CardTitulo>
              <CardInfo>Downloads: {card.downloads}</CardInfo>
              <CardInfo>Likes: {card.likes}</CardInfo>
              <CardInfo>Comentários: {card.comments?.length ?? 0}</CardInfo>
              <CardInfo>
                Criado por: {card.user?.name || "Desconhecido"}
              </CardInfo>
              <button
                style={{
                  marginTop: "8px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1d1b20",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  const token = localStorage.getItem("authenticacao");
                  if (!token) {
                    alert("Você precisa estar logado para curtir.");
                    return;
                  }
                  try {
                    const res = await axios.post(
                      `http://localhost:3000/cards/${card._id}/like`,
                      {},
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const updatedLikes = res.data?.data?.likes;
                    setCards((prev) =>
                      prev.map((c) =>
                        c._id === card._id ? { ...c, likes: updatedLikes } : c
                      )
                    );
                  } catch (err: any) {
                    if (err.response?.status === 400) {
                      alert("Você já curtiu este card.");
                    } else {
                      console.error("Erro ao curtir o card", err);
                      alert("Erro ao curtir. Tente novamente.");
                    }
                  }
                }}
              >
                Curtir
              </button>
            </Card>
          ))}
        </GridCards>

        {cards.length > 8 && (
          <VerMais
            onClick={() =>
              setVisibleCount((prev) =>
                prev < cards.length ? cards.length : 8
              )
            }
          >
            {visibleCount < cards.length ? "Ver mais" : "Ver menos"}
          </VerMais>
        )}

        {/* SEÇÃO #publique */}
        {user && (
          <>
            <Titulo id="publique">#publique</Titulo>
            <Subtitulo>
              Veja seus cards que ainda não estão visíveis na comunidade e
              publique com um clique.
            </Subtitulo>

            <GridCards style={{ marginTop: 40 }}>
              {meusCards
                .filter((card) => !card.is_published)
                .map((card) => (
                  <Card key={card._id}>
                    <CardTitulo>{card.title}</CardTitulo>
                    <CardInfo>Prioridade: {card.priority}</CardInfo>
                    <CardInfo>Downloads: {card.downloads}</CardInfo>
                    <CardInfo>Likes: {card.likes}</CardInfo>
                    <CardInfo>
                      Comentários: {card.comments?.length ?? 0}
                    </CardInfo>

                    <button
                      onClick={() => {
                        console.log("ID enviado:", card.id);

                        handlePublicar(card.id);
                      }}
                    >
                      Publicar
                    </button>
                  </Card>
                ))}
            </GridCards>
          </>
        )}
      </Container>
    </>
  );
}
