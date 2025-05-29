import { Header } from "../../Components/Header";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import { toast } from "react-toastify";
import { Usuario } from "../../Types/User";

// Styled Components
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
  margin-bottom: 80px;
  position: relative;
`;

const InputBusca = styled.input`
  padding: 20px 24px;
  width: 600px;
  border-radius: 30px;
  border: 2px solid #e0e0e0;
  font-size: 18px;
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

const ListaResultados = styled.ul`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
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

const BotaoBusca = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 16px 20px;
  border-radius: 25px;
  border: none;
  background-color: #333;
  color: white;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #555;
    transform: translateY(-50%) scale(1.05);
  }
`;

// Seção de Publicação
const PublishSection = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

// Seção de Cards Mais Curtidos
const TopCardsSection = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

// Seção de Todos os Cards
const AllCardsSection = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Card Component
const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  padding: 20px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
`;

const CardStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${props => props.primary ? '#1a1a1a' : '#f5f5f5'};
  color: ${props => props.primary ? '#fff' : '#1a1a1a'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

const PublishTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  line-height: 1.2;
`;

const PublishSubtitle = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 60px;
  line-height: 1.5;
`;

const PublishCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
`;

const PublishCardTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #1a1a1a;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Select = styled.select`
  padding: 20px;
  border-radius: 16px;
  width: 100%;
  font-size: 16px;
  margin-bottom: 24px;
  border: 2px solid #e0e0e0;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #333;
  }
`;

const PublishButton = styled.button`
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  border: none;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
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

const ProfessionalSection = styled.div`
  margin-top: 80px;
`;

const ProfessionalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
`;

const ProfessionalCard = styled.div`
  background: transparent;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProfessionalBanner = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`;

const ProfessionalContent = styled.div`
  padding: 24px;
`;

const ProfessionalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a1a;
  line-height: 1.3;
`;

const ProfessionalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ProfessionalDate = styled.span`
  font-size: 14px;
  color: #999;
`;

const ProfessionalCategory = styled.span`
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 16px;
  background-color: #e8f4fd;
  color: #1976d2;
  font-weight: 500;
`;

export function Comunidade() {
  const [cards, setCards] = useState<any[]>([]);
  const [meusCards, setMeusCards] = useState<any[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("escolar");
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());

  const { user } = useAuth();
  const navigate = useNavigate();
  
  usePageLoading(isDataLoading);

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
    const loadInitialData = async () => {
      setIsDataLoading(true);
      try {
        await Promise.all([fetchAllCards(), fetchUsers(), fetchLikedCards()]);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    loadInitialData();
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

    const isAlreadyLiked = likedCards.has(cardId);

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

      // Atualizar o estado de cards curtidos
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

  // Função para buscar cards curtidos pelo usuário
  const fetchLikedCards = async () => {
    try {
      const token = localStorage.getItem("authenticacao");
      if (!token) return;

      const res = await axios.get("http://localhost:3000/users/liked-cards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const likedCardIds = res.data?.data || [];
      setLikedCards(new Set(likedCardIds));
    } catch (error) {
      console.error("Erro ao buscar cards curtidos", error);
      // Se der erro, mantém o estado vazio
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

          {/* Seção de Publicação */}
          {user && (
            <PublishSection>
              <SectionHeader>
                <SectionTitle>Publique seus cards</SectionTitle>
                <SectionSubtitle>
                  Compartilhe seu conhecimento com a comunidade
                </SectionSubtitle>
              </SectionHeader>
              
              <Select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
              >
                <option value="">Selecionar um card para publicar</option>
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
                  }
                }}
                disabled={!selectedCardId}
              >
                Publicar Card
              </PublishButton>
            </PublishSection>
          )}

          {/* Seção de Cards Mais Curtidos */}
          <TopCardsSection>
            <SectionHeader>
              <SectionTitle>Mais Curtidos</SectionTitle>
              <SectionSubtitle>
                Os cards mais populares da comunidade
              </SectionSubtitle>
            </SectionHeader>
            
            <CardsGrid>
              {cards
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .slice(0, 6)
                .map((card, index) => (
                  <Card key={card.id || card._id}>
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
                      <CardStats>
                        <span>👍 {card.likes || 0}</span>
                        <span>💬 {card.comments?.length || 0}</span>
                      </CardStats>
                      <CardActions>
                        <ActionButton 
                          primary
                          onClick={() => handleLike(card)}
                        >
                          {isCardLiked(card.id || card._id) ? '❤️ Curtido' : '🤍 Curtir'}
                        </ActionButton>
                      </CardActions>
                    </CardContent>
                  </Card>
                ))}
            </CardsGrid>
          </TopCardsSection>

          {/* Seção de Todos os Cards */}
          <AllCardsSection>
            <SectionHeader>
              <SectionTitle>Todos os Cards</SectionTitle>
              <SectionSubtitle>
                Explore todos os cards compartilhados pela comunidade
              </SectionSubtitle>
            </SectionHeader>
            
            <CardsGrid>
              {cards.map((card, index) => (
                <Card key={card.id || card._id}>
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
                    <CardStats>
                      <span>👍 {card.likes || 0}</span>
                      <span>💬 {card.comments?.length || 0}</span>
                    </CardStats>
                    <CardActions>
                      <ActionButton 
                        primary
                        onClick={() => handleLike(card)}
                      >
                        {isCardLiked(card.id || card._id) ? '❤️ Curtido' : '🤍 Curtir'}
                      </ActionButton>
                    </CardActions>
                  </CardContent>
                </Card>
              ))}
            </CardsGrid>
          </AllCardsSection>
        </ContentWrapper>
      </Container>
    </>
  );
}
