import { Header } from "../../Components/Header";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import { toast } from "react-toastify";
import { Usuario } from "../../Types/User";

const Container = styled.div`
  background-color: transparent;
  min-height: 100vh;
  padding: 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Titulo = styled.h1`
  text-align: center;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
`;

const Subtitulo = styled.p`
  text-align: center;
  font-size: 20px;
  color: #666;
  margin-bottom: 60px;
  font-weight: 400;
`;

const BuscaWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  background: white;
  border-radius: 30px;
  padding: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const InputBusca = styled.input`
  padding: 12px 20px;
  width: 100%;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  outline: none;
  background: transparent;
  
  &::placeholder {
    color: #999;
  }
`;

const BotaoBusca = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #f0f0f0;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }
`;

const ListaResultados = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  border-radius: 12px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ItemResultado = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #333;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const PublishSection = styled.div`
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  background: transparent;
  padding: 40px;
  border-radius: 12px;
`;

const PublishHeader = styled.div``;

const PublishTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: #000;
  margin-bottom: 24px;
  line-height: 1.1;
`;

const PublishSubtitle = styled.p`
  font-size: 18px;
  color: #333;
  line-height: 1.5;
  max-width: 400px;
`;

const PublishForm = styled.div`
  background: white;
  border-radius: 12px;
  padding: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100px;
  display: flex;
  flex-direction: column;
  
`;


const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 32px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  height: 160px;
  background: #f5f5f5;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.4;
`;

const CardCreator = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:before {
    content: "👤";
    font-size: 14px;
  }
`;

const CardStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #666;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const CardCategory = styled.span`
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  background: #f0f0f0;
  color: #666;
  margin-bottom: 12px;
  display: inline-block;
`;

// const TopCardsSection = styled.div`
//   background: white;
//   border-radius: 16px;
//   padding: 32px;
//   margin-bottom: 40px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
// `;

// const AllCardsSection = styled.div`
//   background: white;
//   border-radius: 16px;
//   padding: 32px;
//   margin-bottom: 40px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
// `;

const Select = styled.select`
  padding: 12px 16px;
  border-radius: 8px;
  width: 100%;
  font-size: 14px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  color: #333;
  cursor: pointer;
  
  &:focus {
    border-color: #333;
    box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const PublishButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background-color: black;
  color: white;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #333;
    transform: scale(1.02);
  }
  
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: ${(props) => props.primary ? '#1a1a1a' : '#f5f5f5'};
  color: ${(props) => props.primary ? '#fff' : '#1a1a1a'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 40px 0;
`;

const HashTag = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 40px auto 0;
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  background-color: #f5f5f5;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.02);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DetalhesContainer = styled.div`
  display: flex;
  gap: 24px;
  background: #000;
  border-radius: 20px;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  padding: 32px;
  color: white;
  position: relative;
`;

const Sidebar = styled.div`
  width: 300px;
  padding-right: 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;

  h2 {
    margin: 0 0 24px 0;
    font-size: 24px;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 24px 0;
  }
`;

const SidebarCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;

  h4 {
    margin: 0 0 12px 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
  }
`;

export function Comunidade() {
  const [allCards, setAllCards] = useState<any[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const [visibleCards, setVisibleCards] = useState(10);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  
  usePageLoading(isDataLoading);

  // Mover a função fetchAllCards para fora do useEffect
  const fetchAllCards = async () => {
    setIsDataLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/comunidade/cards");
      const cardsData = res.data?.data || [];
      
      const cardsWithDetails = await Promise.all(
        cardsData.map(async (card: any) => {
          try {
            const cardId = card.id || card._id;
            const token = localStorage.getItem("authenticacao");
            const cardDetailRes = await axios.get(
              `http://localhost:3000/cards/${cardId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const cardDetail = cardDetailRes.data.data;
            
            return {
              ...card,
              id: cardId,
              _id: cardId,
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
            console.error("Erro ao buscar detalhes do card:", err);
            return {
              ...card,
              id: card.id || card._id,
              _id: card.id || card._id,
              createdAt: card.createdAt || new Date().toISOString(),
              updatedAt: card.updatedAt || new Date().toISOString(),
              likes: card.likes || 0
            };
          }
        })
      );
      
      setAllCards(cardsWithDetails);
    } catch (err) {
      console.error("Erro ao buscar cards:", err);
      toast.error("Erro ao carregar os cards. Por favor, tente novamente.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCards();
  }, []);

  // Função para obter os cards mais curtidos
  const getMostLikedCards = () => {
    return [...allCards]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 6);
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

      toast.success("Card publicado com sucesso!");
      
      // Recarrega os dados
      await fetchUsers();
      await fetchAllCards();
      
      // Limpa a seleção
      setSelectedListId("");
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

    const isAlreadyLiked = likedCards.has(cardId);

    try {
      const res = await axios.post(
        `http://localhost:3000/cards/${cardId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedLikes = res.data?.data?.likes;
      
      // Atualiza os likes em ambas as listas
      setAllCards((prev) =>
        prev.map((c) =>
          (c.id || c._id) === cardId ? { ...c, likes: updatedLikes } : c
        )
      );

      // Atualiza o estado de cards curtidos
      setLikedCards(prev => {
        const newSet = new Set(prev);
        if (isAlreadyLiked) {
          newSet.delete(cardId);
          toast.success("Curtida removida! 💔");
        } else {
          newSet.add(cardId);
          toast.success("Curtido com sucesso! ❤️");
        }
        return newSet;
      });

    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 403) {
        toast.error(err.response?.data?.message || "Não foi possível curtir.");
      } else {
        console.error("Erro ao curtir o card", err);
        toast.error("Erro ao curtir. Tente novamente.");
      }
    }
  };

  // Função para verificar se um card foi curtido
  const isCardLiked = (cardId: string) => {
    return likedCards.has(cardId);
  };

  const loadMore = () => {
    setVisibleCards(prev => prev + 10);
  };

  const loadPdf = async (cardId: string) => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const token = localStorage.getItem("authenticacao");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      const response = await axios.get(
        `http://localhost:3000/cards/${cardId}/pdf/0/view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob'
        }
      );

      // Verifica se a resposta é um JSON de erro (o backend retorna um objeto quando há erro)
      const fileType = response.headers['content-type'];
      if (fileType === 'application/json') {
        const reader = new FileReader();
        reader.onload = () => {
          const errorResponse = JSON.parse(reader.result as string);
          throw new Error(errorResponse.message || "Erro ao carregar PDF");
        };
        reader.readAsText(response.data);
        return;
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error: any) {
      console.error("Erro ao carregar PDF:", error);
      let errorMessage = "Erro ao carregar o PDF";
      
      if (error.response) {
        // Erro da API
        if (error.response.status === 404) {
          errorMessage = "PDF não encontrado. O arquivo pode ter sido removido ou não está mais disponível.";
        } else if (error.response.status === 401) {
          errorMessage = "Você precisa estar logado para visualizar este PDF.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setPdfError(errorMessage);
      setPdfUrl(null);
    } finally {
      setPdfLoading(false);
    }
  };

  // Limpar a URL do PDF quando o modal for fechado
  useEffect(() => {
    if (!showDetailsModal && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [showDetailsModal]);

  // Carregar o PDF quando um card for selecionado
  useEffect(() => {
    if (selectedCard?.id && showDetailsModal) {
      loadPdf(selectedCard.id);
    }
  }, [selectedCard, showDetailsModal]);

  const handleCardClick = async (card: any) => {
    try {
      // Buscar detalhes completos do card
      const token = localStorage.getItem("authenticacao");
      const cardDetailRes = await axios.get(
        `http://localhost:3000/cards/${card.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cardDetail = cardDetailRes.data.data;

      // Buscar detalhes do usuário que criou o card
      const userDetailRes = await axios.get(
        `http://localhost:3000/users/${cardDetail.userId}`
      );
      const userDetail = userDetailRes.data.data;

      setSelectedCard({
        ...cardDetail,
        user: userDetail
      });
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Erro ao buscar detalhes do card:", err);
      toast.error("Erro ao carregar detalhes do card");
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
              placeholder="Boas práticas de programação"
              value={searchTitle}
              onChange={handleUserSearch}
            />
            <BotaoBusca onClick={() => {
              fetchAllCards();
              setSelectedListId("");
            }}>🔍</BotaoBusca>
            
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

          {/* Divisor com #publique */}
          <SectionDivider>
            <HashTag>#publique</HashTag>
            <DividerLine />
          </SectionDivider>

          {/* Seção de Publicação */}
          {user && (
            <PublishSection>
              <PublishHeader>
                <PublishTitle>
                  Publique os seus{'\n'}
                  cards mais fácil!
                </PublishTitle>
                <PublishSubtitle>
                  Espalhe o seu método de estudar para ajudar mais pessoas com um só clique.
                </PublishSubtitle>
              </PublishHeader>
              
              <PublishForm>
                <Select
                  value={selectedListId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedListId(e.target.value)}
                >
                  <option value="">Selecionar o card</option>
                  {allCards
                    .filter((card) => !card.is_published)
                    .map((card) => (
                      <option key={card._id} value={card._id}>
                        {card.title}
                      </option>
                    ))}
                </Select>

                <PublishButton
                  onClick={() => {
                    const selectedCard = allCards.find(
                      (card) => card._id === selectedListId
                    );
                    if (selectedCard) {
                      handlePublicar(selectedCard._id);
                    }
                  }}
                  disabled={!selectedListId}
                >
                  Publicar
                </PublishButton>
              </PublishForm>
            </PublishSection>
          )}

          {/* Divisor com #curtidos */}
          <SectionDivider>
            <HashTag>#curtidos</HashTag>
            <DividerLine />
          </SectionDivider>

          {/* Grid de Cards Mais Curtidos */}
          <CardsGrid>
            {getMostLikedCards().map((card, index) => (
              <Card key={card.id || card._id} onClick={() => handleCardClick(card)}>
                <CardImage>
                  <img
                    src={card.image_url?.[0] ? 
                      `http://localhost:3000${card.image_url[0]}` : 
                      `https://source.unsplash.com/random/400x160?${index}`
                    }
                    alt={card.title}
                  />
                </CardImage>
                <CardContent>
                  <CardTitle>{card.title}</CardTitle>
                  {card.user && (
                    <CardCreator>{card.user.name || 'Desconhecido'}</CardCreator>
                  )}
                  <CardStats>
                    <span>👍 {card.likes || 0}</span>
                    <span>💬 {card.comments?.length || 0}</span>
                  </CardStats>
                  <CardActions>
                    <ActionButton 
                      primary
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(card);
                      }}
                    >
                      {isCardLiked(card.id || card._id) ? '❤️ Curtido' : '🤍 Curtir'}
                    </ActionButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
          </CardsGrid>

          {/* Divisor com #todos */}
          <SectionDivider>
            <HashTag>#todos</HashTag>
            <DividerLine />
          </SectionDivider>

          {/* Grid de Todos os Cards */}
          <CardsGrid>
            {allCards
              .slice(0, visibleCards)
              .map((card, index) => (
                <Card key={card.id || card._id} onClick={() => handleCardClick(card)}>
                  <CardImage>
                    <img
                      src={card.image_url?.[0] ? 
                        `http://localhost:3000${card.image_url[0]}` : 
                        `https://source.unsplash.com/random/400x160?${index}`
                      }
                      alt={card.title}
                    />
                  </CardImage>
                  <CardContent>
                    <CardTitle>{card.title}</CardTitle>
                    {card.user && (
                      <CardCreator>{card.user.name || 'Desconhecido'}</CardCreator>
                    )}
                    <CardCategory>
                      {card.category || 'Geral'}
                    </CardCategory>
                    <CardStats>
                      <span>👍 {card.likes || 0}</span>
                      <span>💬 {card.comments?.length || 0}</span>
                    </CardStats>
                    <CardActions>
                      <ActionButton 
                        primary
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(card);
                        }}
                      >
                        {isCardLiked(card.id || card._id) ? '❤️ Curtido' : '🤍 Curtir'}
                      </ActionButton>
                    </CardActions>
                  </CardContent>
                </Card>
              ))}
          </CardsGrid>

          {/* Botão Ver Mais */}
          {visibleCards < allCards.length && (
            <LoadMoreButton onClick={loadMore}>
              Ver mais
            </LoadMoreButton>
          )}
        </ContentWrapper>
      </Container>

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedCard && (
        <ModalOverlay>
          <DetalhesContainer>
            {/* Sidebar */}
            <Sidebar>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={selectedCard.user?.profileImage || "https://via.placeholder.com/40"}
                  alt="Foto de perfil"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{selectedCard.user?.name || "Usuário"}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                    Autor do card
                  </p>
                </div>
              </div>

              <SidebarCard>
                <h4>#titulo</h4>
                <div style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#111",
                  color: "white",
                }}>
                  {selectedCard.title}
                </div>
              </SidebarCard>

              <SidebarCard>
                <h4>#descrição</h4>
                <div style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "#111",
                  color: "white",
                  fontSize: "14px",
                  lineHeight: "1.4"
                }}>
                  {selectedCard.content || "Sem descrição disponível"}
                </div>
              </SidebarCard>

              <SidebarCard>
                <h4>#estatísticas</h4>
                <div style={{
                  display: "flex",
                  gap: "16px",
                  color: "white",
                  fontSize: "14px"
                }}>
                  <span>👍 {selectedCard.likes || 0} curtidas</span>
                  <span>💬 {selectedCard.comments?.length || 0} comentários</span>
                </div>
              </SidebarCard>
            </Sidebar>

            {/* Content */}
            <ContentArea>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>{selectedCard.title}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  ❌
                </button>
              </div>

              <hr />

              {/* Visualização do PDF */}
              {selectedCard.pdfs && selectedCard.pdfs.length > 0 ? (
                <div style={{
                  width: "100%",
                  height: "500px",
                  background: "#eaeaea",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}>
                  {pdfLoading ? (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "16px"
                    }}>
                      <div className="loading-spinner" style={{
                        width: "40px",
                        height: "40px",
                        border: "4px solid #f3f3f3",
                        borderTop: "4px solid #3498db",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      <p>Carregando PDF...</p>
                    </div>
                  ) : pdfError ? (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "16px",
                      padding: "20px",
                      textAlign: "center"
                    }}>
                      <div style={{
                        background: "rgba(211, 47, 47, 0.1)",
                        padding: "20px",
                        borderRadius: "8px",
                        border: "1px solid rgba(211, 47, 47, 0.3)",
                        maxWidth: "400px"
                      }}>
                        <p style={{ color: "#d32f2f", marginBottom: "8px" }}>❌ {pdfError}</p>
                        <p style={{ 
                          fontSize: "14px", 
                          color: "#666",
                          marginBottom: "16px" 
                        }}>
                          Tente novamente ou entre em contato com o autor do card.
                        </p>
                        <button
                          onClick={() => loadPdf(selectedCard.id)}
                          style={{
                            padding: "8px 16px",
                            background: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "background 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1565c0";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#1976d2";
                          }}
                        >
                          🔄 Tentar novamente
                        </button>
                      </div>
                    </div>
                  ) : pdfUrl ? (
                    <iframe
                      src={pdfUrl}
                      title={selectedCard.pdfs[0].filename}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  ) : null}
                </div>
              ) : (
                <div style={{
                  width: "100%",
                  height: "500px",
                  background: "#eaeaea",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "16px",
                  color: "#666"
                }}>
                  <p>📄 Nenhum PDF disponível para este card</p>
                  <p style={{ fontSize: "14px", color: "#999" }}>
                    O autor não anexou nenhum arquivo PDF a este card.
                  </p>
                </div>
              )}
            </ContentArea>
          </DetalhesContainer>
        </ModalOverlay>
      )}
    </>
  );
}
