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
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Titulo = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
`;

const Subtitulo = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
  font-weight: 400;
`;

const BuscaWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  position: relative;
`;

const InputBusca = styled.input`
  padding: 16px 20px;
  width: 400px;
  border-radius: 25px;
  border: 2px solid #e0e0e0;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #333;
    box-shadow: 0 0 0 3px rgba(51, 51, 51, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const BotaoBusca = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 12px 16px;
  border-radius: 20px;
  border: none;
  background-color: #333;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #555;
    transform: translateY(-50%) scale(1.05);
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #666;
  margin-bottom: 20px;
  text-transform: lowercase;
`;

const GridCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const CardDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const CardCategory = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f0f0f0;
  color: #666;
  font-weight: 500;
`;

const CardTitulo = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  line-height: 1.3;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  font-size: 14px;
  color: #666;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;


const LikeButton = styled.button`
  margin-top: auto;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #333;
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const VerMais = styled.button`
  margin: 40px auto 0;
  display: block;
  background-color: #f0f0f0;
  border: none;
  padding: 16px 32px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  color: #333;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }
`;

const ListaResultados = styled.ul`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  background: white;
  border: 1px solid #e0e0e0;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  border-radius: 12px;
  z-index: 10;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
`;

const ItemResultado = styled.li`
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const PublishSection = styled.div`
  margin-top: 60px;
  padding-top: 40px;
  border-top: 2px solid #f0f0f0;
`;

const PublishCard = styled(Card)`
  max-width: 400px;
  margin: 0 auto;
`;

const Select = styled.select`
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  font-size: 14px;
  margin-bottom: 16px;
  border: 2px solid #e0e0e0;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #333;
  }
`;

const PublishButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #333;
    transform: scale(1.02);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

  // Função para formatar data
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "Data não disponível";
    }
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
      
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (error) {
      return "Data inválida";
    }
  };

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
      const cardsData = res.data?.data || [];
      
      // Buscar detalhes completos de cada card (incluindo imagens)
      const cardsWithDetails = await Promise.all(
        cardsData.map(async (card: any) => {
          try {
            const cardDetailRes = await axios.get(`http://localhost:3000/cards/${card.id || card._id}`);
            const cardDetail = cardDetailRes.data.data;
            
            return {
              ...card,
              image_url: cardDetail.image_url || [],
              pdfs: cardDetail.pdfs || [],
              user: cardDetail.user || card.user,
              createdAt: cardDetail.createdAt || card.createdAt || new Date().toISOString(),
              updatedAt: cardDetail.updatedAt || card.updatedAt || new Date().toISOString(),
              likes: cardDetail.likes || card.likes || 0,
              downloads: cardDetail.downloads || card.downloads || 0,
              comments: cardDetail.comments || card.comments || [],
              is_published: cardDetail.is_published !== undefined ? cardDetail.is_published : card.is_published
            };
          } catch (err) {
            return {
              ...card,
              createdAt: card.createdAt || new Date().toISOString(),
              updatedAt: card.updatedAt || new Date().toISOString()
            };
          }
        })
      );
      
      setCards(cardsWithDetails);
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

      const response = await axios.post(
        `http://localhost:3000/comunidade/publish/${cardId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Card publicado com sucesso!");
      
      // Recarrega os dados
      await fetchMeusCards();
      await fetchAllCards();
      
      // Limpa a seleção
      setSelectedCardId("");
    } catch (err) {
      console.error("Erro ao publicar card:", err);
      toast.error("Erro ao publicar card.");
    }
  };

  const handleLike = async (card: any) => {
    const token = localStorage.getItem("authenticacao");
    const cardId = card.id || card._id;

    if (!cardId) {
      toast.error("ID do card não encontrado.");
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
        <ContentWrapper>
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
          </BuscaWrapper>

          <SectionTitle>#recomendados</SectionTitle>
          <GridCards>
            {cards.slice(0, visibleCount).map((card, index) => {
              return (
                <Card key={index}>
                  {/* Banner da imagem do card */}
                  {card.image_url && card.image_url.length > 0 && (
                    <div
                      style={{
                        width: "100%",
                        height: "70px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#f5f5f5",
                        marginBottom: "8px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <img
                        src={`http://localhost:3000${card.image_url[0]}`}
                        alt="Card banner"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "opacity 0.3s ease",
                        }}
                        loading="eager"
                        onLoad={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                        onError={(e) => {
                          e.currentTarget.parentElement!.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Título do card */}
                  <CardTitulo>
                    {card.title.length > 40
                      ? card.title.slice(0, 40) + "..."
                      : card.title}
                  </CardTitulo>

                  {/* Linha de data e nome do usuário */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <CardDate>
                      {formatDate(card.createdAt)}
                    </CardDate>

                    <CardCategory>
                      {card.user?.name || "Usuário"}
                    </CardCategory>
                  </div>

                  <CardStats>
                    <StatItem>
                      <span>📥</span>
                      <span>{card.downloads || 0}</span>
                    </StatItem>
                    <StatItem>
                      <span>❤️</span>
                      <span>{card.likes || 0}</span>
                    </StatItem>
                    <StatItem>
                      <span>💬</span>
                      <span>{card.comments?.length ?? 0}</span>
                    </StatItem>
                  </CardStats>
                  
                  <LikeButton onClick={() => handleLike(card)}>
                    Curtir
                  </LikeButton>
                </Card>
              );
            })}
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
            <PublishSection>
              <SectionTitle>#publique</SectionTitle>
              <Subtitulo>
                Publique os seus cards mais fácil!
              </Subtitulo>
              <Subtitulo>
                Espalhe o seu método de estudar/trabalhar para ajudar mais pessoas com um só clique.
              </Subtitulo>

              <GridCards>
                <PublishCard>
                  <CardTitulo>Selecionar o card</CardTitulo>

                  <Select
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                  >
                    <option value="">Selecionar o card</option>
                    {meusCards
                      .filter((card) => !card.is_published)
                      .map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.title}
                        </option>
                      ))}
                  </Select>

                  <PublishButton
                    onClick={() => {
                      const selectedCard = meusCards.find(
                        (card) => card._id === selectedCardId
                      );

                      if (selectedCard) {
                        handlePublicar(selectedCard._id);
                      } else {
                        toast.error("Selecione um card válido.");
                      }
                    }}
                    disabled={!selectedCardId}
                  >
                    Publicar
                  </PublishButton>
                </PublishCard>
              </GridCards>
            </PublishSection>
          )}
        </ContentWrapper>
      </Container>
    </>
  );
}
