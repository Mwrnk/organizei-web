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

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #666;
  margin-bottom: 40px;
  text-transform: lowercase;
`;

const RecommendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
`;

const RecommendedCard = styled.div`
  background: white;
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

const CardBanner = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
`;

const CardContent = styled.div`
  padding: 24px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a1a;
  line-height: 1.3;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CardDate = styled.span`
  font-size: 14px;
  color: #999;
`;

const CardCategory = styled.span`
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 16px;
  background-color: #f0f0f0;
  color: #666;
  font-weight: 500;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  font-size: 14px;
  color: #666;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LikeButton = styled.button<{ isLiked?: boolean }>`
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  background-color: ${props => props.isLiked ? '#e74c3c' : '#1a1a1a'};
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.isLiked ? '#c0392b' : '#333'};
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const VerMais = styled.button`
  margin: 60px auto 0;
  display: block;
  background-color: #f0f0f0;
  border: none;
  padding: 20px 40px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
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

const PublishSection = styled.div`
  margin-top: 80px;
  padding-top: 60px;
  border-top: 2px solid #f0f0f0;
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
  background: white;
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

          <SectionTitle>#recomendados</SectionTitle>
          <RecommendedGrid>
            {cards.slice(0, 4).map((card, index) => {
              const cardImages = [
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=160&fit=crop",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=160&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=160&fit=crop",
                "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=400&h=160&fit=crop"
              ];
              
              return (
                <RecommendedCard key={index}>
                  <CardBanner>
                    <img
                      src={card.image_url && card.image_url.length > 0 
                        ? `http://localhost:3000${card.image_url[0]}` 
                        : cardImages[index % cardImages.length]
                      }
                      alt="Card banner"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = cardImages[index % cardImages.length];
                      }}
                    />
                  </CardBanner>
                  <CardContent>
                    <CardTitle>
                      {card.title.length > 40
                        ? card.title.slice(0, 40) + "..."
                        : card.title}
                    </CardTitle>

                    <CardMeta>
                      <CardDate>
                        {formatDate(card.createdAt)}
                      </CardDate>
                      <CardCategory>
                        Escolar
                      </CardCategory>
                    </CardMeta>

                    <CardStats>
                      <StatItem>
                        <span>👍</span>
                        <span>{card.likes || 0}</span>
                      </StatItem>
                      <StatItem>
                        <span>❤️</span>
                        <span>{card.likes || 2}</span>
                      </StatItem>
                      <StatItem>
                        <span>💬</span>
                        <span>{card.comments?.length ?? 0}</span>
                      </StatItem>
                    </CardStats>
                    
                    <LikeButton isLiked={isCardLiked(card.id || card._id)} onClick={() => handleLike(card)}>
                      {isCardLiked(card.id || card._id) ? (
                        <>
                          <span>❤️</span>
                          Curtido
                        </>
                      ) : (
                        <>
                          <span>🤍</span>
                          Curtir
                        </>
                      )}
                    </LikeButton>
                  </CardContent>
                </RecommendedCard>
              );
            })}
          </RecommendedGrid>

          {cards.length > 4 && (
            <VerMais
              onClick={() =>
                setVisibleCount((prev) =>
                  prev < cards.length ? cards.length : 8
                )
              }
            >
              Ver mais
            </VerMais>
          )}

          {user && (
            <PublishSection>
              <PublishTitle>Publique os seus cards mais fácil!</PublishTitle>
              <PublishSubtitle>
                Espalhe o seu método de estudar/trabalhar para ajudar mais pessoas com um só clique.
              </PublishSubtitle>

              <PublishCard>
                <PublishCardTitle>Selecionar o card</PublishCardTitle>

                <RadioGroup>
                  <RadioOption>
                    <RadioInput
                      type="radio"
                      name="category"
                      value="escolar"
                      checked={selectedCategory === "escolar"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    Escolar
                  </RadioOption>
                  <RadioOption>
                    <RadioInput
                      type="radio"
                      name="category"
                      value="profissional"
                      checked={selectedCategory === "profissional"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    Profissional
                  </RadioOption>
                </RadioGroup>

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
            </PublishSection>
          )}

          <ProfessionalSection>
            <SectionTitle>#profissional</SectionTitle>
            <ProfessionalGrid>
              {cards.slice(0, 8).map((card, index) => {
                const professionalImages = [
                  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=160&fit=crop",
                  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=160&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=160&fit=crop",
                  "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=400&h=160&fit=crop",
                  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=160&fit=crop",
                  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=160&fit=crop",
                  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=160&fit=crop",
                  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=160&fit=crop"
                ];
                
                return (
                  <ProfessionalCard key={index}>
                    <ProfessionalBanner>
                      <img
                        src={card.image_url && card.image_url.length > 0 
                          ? `http://localhost:3000${card.image_url[0]}` 
                          : professionalImages[index % professionalImages.length]
                        }
                        alt="Professional card banner"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = professionalImages[index % professionalImages.length];
                        }}
                      />
                    </ProfessionalBanner>
                    <ProfessionalContent>
                      <ProfessionalTitle>
                        {card.title.length > 40
                          ? card.title.slice(0, 40) + "..."
                          : card.title}
                      </ProfessionalTitle>

                      <ProfessionalMeta>
                        <ProfessionalDate>
                          {formatDate(card.createdAt)}
                        </ProfessionalDate>
                        <ProfessionalCategory>
                          Profissional
                        </ProfessionalCategory>
                      </ProfessionalMeta>

                      <CardStats>
                        <StatItem>
                          <span>👍</span>
                          <span>{card.likes || 0}</span>
                        </StatItem>
                        <StatItem>
                          <span>❤️</span>
                          <span>{card.likes || 2}</span>
                        </StatItem>
                        <StatItem>
                          <span>💬</span>
                          <span>{card.comments?.length ?? 0}</span>
                        </StatItem>
                      </CardStats>
                      
                      <LikeButton isLiked={isCardLiked(card.id || card._id)} onClick={() => handleLike(card)}>
                        {isCardLiked(card.id || card._id) ? (
                          <>
                            <span>❤️</span>
                            Curtido
                          </>
                        ) : (
                          <>
                            <span>🤍</span>
                            Curtir
                          </>
                        )}
                      </LikeButton>
                    </ProfessionalContent>
                  </ProfessionalCard>
                );
              })}
            </ProfessionalGrid>
          </ProfessionalSection>
        </ContentWrapper>
      </Container>
    </>
  );
}
