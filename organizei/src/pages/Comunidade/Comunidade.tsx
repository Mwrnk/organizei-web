import { Header } from "../../Components/Header";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContexts";
import { toast } from "react-toastify";
import { Usuario } from "../../Types/User";

// Styled Components
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
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedCardId, setSelectedCardId] = useState("");

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
      const cardsCorrigidos = (res.data.data || []).map((card: any) => ({
        ...card,
        _id: card._id || card.id,
      }));
      setMeusCards(cardsCorrigidos);
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

  const handleLike = async (card: any) => {
    const token = localStorage.getItem("authenticacao");
    const cardId = card.id || card._id;

    if (!cardId) {
      toast.error("ID do card não encontrado.");
      console.error("Card sem ID:", card);
      return;
    }

    if (!token) {
      toast.error("Você precisa estar logado para curtir.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/cards/${cardId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedLikes = res.data?.data?.likes;
      setCards((prev) =>
        prev.map((c) =>
          (c.id || c._id) === cardId ? { ...c, likes: updatedLikes } : c
        )
      );

      toast.success("Curtido com sucesso! ❤️");
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 403) {
        toast.error(err.response?.data?.message || "Não foi possível curtir.");
      } else {
        console.error("Erro ao curtir o card", err);
        toast.error("Erro ao curtir. Tente novamente.");
      }
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
                onClick={() => handleLike(card)}
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

        {user && (
          <>
            <Titulo id="publique">#publique</Titulo>
            <Subtitulo>
              Veja seus cards que ainda não estão visíveis na comunidade e
              publique com um clique.
            </Subtitulo>

            <GridCards style={{ marginTop: 40 }}>
              <Card>
                <CardTitulo>Selecione um card</CardTitulo>

                <select
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    width: "100%",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                >
                  <option value="">Selecione um card</option>
                  {meusCards
                    .filter((card) => !card.is_published)
                    .map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.title}
                      </option>
                    ))}
                </select>

                <button
                  onClick={() => {
                    const selectedCard = meusCards.find(
                      (card) => card._id === selectedCardId
                    );

                    if (selectedCard) {
                      handlePublicar(selectedCard._id);
                    } else {
                      alert("Selecione um card válido.");
                    }
                  }}
                  style={{
                    marginTop: "12px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1d1b20",
                    color: "white",
                    cursor: selectedCardId ? "pointer" : "not-allowed",
                    fontWeight: "bold",
                  }}
                  disabled={!selectedCardId}
                >
                  Publicar
                </button>
              </Card>
            </GridCards>
          </>
        )}
      </Container>
    </>
  );
}
