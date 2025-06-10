import { Header } from "../../Components/Header";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import { toast } from "react-toastify";
import { Usuario } from "../../Types/User";
import curtidaSvg from "../../../assets/curtida.svg";
import coracaoCurtidoSvg from "../../../assets/coracaocurtido.svg";
import chatSvg from "../../../assets/chat.svg";
import { CardData } from "../../Types/Card";

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

const DEFAULT_PROFILE_IMAGE = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const MOST_LIKED_CARDS_LIMIT = 8;
const INITIAL_VISIBLE_CARDS = 12;
const CARDS_PER_PAGE = 12;

const BuscaWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
`;

const InputBusca = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  }
`;

const BotaoBusca = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }
`;

const ListaResultados = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const ItemResultado = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
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
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
`;

const CardImage = styled.div`
  height: 160px;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #666;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 500;
  position: relative;
  overflow: hidden;

  /* Container para o conteúdo */
  > span {
    position: relative;
    z-index: 2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-align: center;
    margin: 0 auto;
  }

  /* Ícone de documento */
  &::before {
    content: "📄";
    font-size: 32px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.1;
    z-index: 1;
  }

  /* Efeito de hover */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${Card}:hover & {
    &::after {
      opacity: 1;
    }
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

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
`;

const IconWrapper = styled.div<{ inModal?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #000000;
`;

const Icon = styled.img<{ inModal?: boolean }>`
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  filter: brightness(0);

  &:hover {
    transform: scale(1.1);
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
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  background-color: #1976d2;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #1565c0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 90%;
    max-width: 300px;
    padding: 14px 24px;
    font-size: 14px;
  }
`;

const LoadMoreContainer = styled.div<{ visible: boolean }>`
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateY(${props => props.visible ? '0' : '20px'});
  transition: all 0.3s ease;
  margin: 40px 0;
  height: ${props => props.visible ? 'auto' : '0'};
  overflow: hidden;
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
  background: #ffffff;
  border-radius: 20px;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  padding: 32px;
  color: #000000;
  position: relative;
`;

const Sidebar = styled.div`
  width: 300px;
  padding-right: 24px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
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
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 16px;

  h4 {
    margin: 0 0 12px 0;
    color: #000000;
    font-size: 14px;
  }
`;

const CommentSection = styled.div`
  margin-top: 32px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 500px);
  min-height: 300px;
  position: relative;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  h4 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #000000;
    
    span {
      background: rgba(0, 0, 0, 0.1);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      color: #000000;
    }
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 16px;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  mask-image: linear-gradient(to bottom, transparent, black 10px, black 90%, transparent);
`;

const CommentInput = styled.div`
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.03);
  padding: 16px;
  border-radius: 8px;
  position: sticky;
  bottom: 0;

  textarea {
    flex: 1;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 12px;
    color: #000000;
    font-size: 14px;
    resize: none;
    min-height: 60px;
    font-family: inherit;

    &::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }

    &:focus {
      outline: 1px solid rgba(0, 0, 0, 0.2);
    }
  }

  button {
    align-self: flex-end;
    padding: 8px 16px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    min-width: 100px;

    &:hover:not(:disabled) {
      background: #1565c0;
      transform: translateY(-1px);
    }

    &:disabled {
      background: #666;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const Comment = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .info {
      flex: 1;

      .name {
        font-weight: 500;
        color: #000000;
        margin: 0;
      }

      .date {
        font-size: 12px;
        color: #666666;
        margin: 0;
      }
    }
  }

  .content {
    color: #000000;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    word-break: break-word;
  }
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f9f9f9;
  border-radius: 12px;
  margin: 20px 0;

  h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 16px;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.span`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
`;

export function Comunidade() {
  const [allCards, setAllCards] = useState<any[]>([]);
  const [myCards, setMyCards] = useState<CardData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const [visibleCards, setVisibleCards] = useState(INITIAL_VISIBLE_CARDS);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [userLists, setUserLists] = useState<any[]>([]);
  const [selectedListForDownload, setSelectedListForDownload] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  

  const { user } = useAuth();
  const navigate = useNavigate();
  
  usePageLoading(isDataLoading);

  // Efeito para fechar a lista de resultados ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Carregar todos os usuários ao montar o componente
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("authenticacao");
        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/users",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data?.data) {
          setUsers(response.data.data);
        }
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      }
    }

    fetchUsers();
  }, []);

  // Filtrar usuários localmente baseado no texto de busca
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredUsers([]);
      setShowResults(false);
      return;
    }

    const searchLower = searchText.toLowerCase().trim();
    const matched = users.filter(user => 
      user.name.toLowerCase().includes(searchLower)
    );

    setFilteredUsers(matched);
    setShowResults(true);
  }, [searchText, users]);

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setIsSearching(false); // Não precisamos mais do estado de loading
  };

  const handleSelectUser = (userId: string) => {
    navigate(`/perfilbusca/${userId}`);
    setSearchText("");
    setFilteredUsers([]);
    setShowResults(false);
  };

  const fetchAllCards = async () => {
    setIsDataLoading(true);
    try {
      const token = localStorage.getItem("authenticacao");
      const res = await axios.get("http://localhost:3000/comunidade/cards");
      const cardsData = res.data?.data || [];
      
      const cardsWithDetails = await Promise.all(
        cardsData.map(async (card: any) => {
          try {
            const cardId = card.id || card._id;

            // Buscar detalhes do card incluindo comentários
            const [cardDetailRes, commentsRes] = await Promise.all([
              axios.get(
                `http://localhost:3000/cards/${cardId}`,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              ),
              axios.get(
                `http://localhost:3000/comments/${cardId}`,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              )
            ]);

            const cardDetail = cardDetailRes.data.data;
            const comments = commentsRes.data.data || [];
            
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
              comments: comments,
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
              likes: card.likes || 0,
              comments: []
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

  const fetchMyCards = async () => {
    try {
      const token = localStorage.getItem("authenticacao");
      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      const res = await axios.get("http://localhost:3000/cards", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filtra apenas os cards não publicados e garante a estrutura correta
      const unpublishedCards = res.data.data
        .filter((card: any) => !card.is_published)
        .map((card: any) => ({
          id: card._id || card.id, // Garante que temos o id correto (ObjectId do MongoDB)
          title: card.title,
          is_published: card.is_published,
        }));

      setMyCards(unpublishedCards);
    } catch (err) {
      console.error("Erro ao carregar seus cards:", err);
      toast.error("Erro ao carregar seus cards. Por favor, tente novamente.");
    }
  };

  useEffect(() => {
    fetchAllCards();
    fetchMyCards();
  }, []);

  // Função para obter os cards mais curtidos
  const getMostLikedCards = () => {
    return [...allCards]
      .sort((a, b) => {
        // Primeiro, ordenar por número de likes
        const likesComparison = (b.likes || 0) - (a.likes || 0);
        
        // Se tiverem o mesmo número de likes, ordenar por data de criação (mais recentes primeiro)
        if (likesComparison === 0) {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        }
        
        return likesComparison;
      })
      .slice(0, MOST_LIKED_CARDS_LIMIT);
  };

  const handlePublicar = async (cardId: string) => {
    if (!cardId) {
      toast.error("Selecione um card para publicar");
      return;
    }

    // Encontra o card selecionado para garantir que temos o ID correto
    const selectedCard = myCards.find(card => card.id === cardId);
    if (!selectedCard) {
      toast.error("Card não encontrado na lista local");
      return;
    }

    try {
      const token = localStorage.getItem("authenticacao");
      if (!token) {
        toast.error("Você precisa estar logado para publicar");
        return;
      }

      // Usa a rota correta /publish/:id
      const response = await axios.post(
        `http://localhost:3000/comunidade/publish/${selectedCard.id}`
,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data) {
        toast.success("Card publicado com sucesso!");
        
        // Recarrega os dados
        await Promise.all([
          fetchMyCards(),    // Recarrega os cards do usuário
          fetchAllCards()    // Recarrega os cards da comunidade
        ]);
        
        // Limpa a seleção
        setSelectedListId("");
      }
    } catch (err: any) {
      console.error("Erro ao publicar card:", err);
      
      // Tratamento específico de erros da API
      if (err.response) {
        const errorMessage = err.response.data?.message || "Erro ao publicar card";
        
        if (err.response.status === 404) {
          toast.error("Card não encontrado. Verifique se o card ainda existe.");
          // Recarrega os cards para garantir que a lista está atualizada
          fetchMyCards();
        } else {
          toast.error(errorMessage);
        }
      } else if (err.request) {
        toast.error("Erro de conexão. Verifique sua internet.");
      } else {
        toast.error("Erro ao publicar card. Tente novamente.");
      }
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
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });

      // Mostra a notificação após a atualização bem-sucedida
      toast.success(isAlreadyLiked ? "Curtida removida! 💔" : "Curtido com sucesso! ❤️");

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
    setVisibleCards(prev => prev + CARDS_PER_PAGE);
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

      console.log(response);

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
      console.log(card);
      setShowDetailsModal(true);

      // Carrega os detalhes adicionais em background
      const token = localStorage.getItem("authenticacao");
      const cardId = card.id || card._id;
      
      const commentsRes = await axios.get(
          `http://localhost:3000/comments/${cardId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
      );

      const comments = commentsRes.data.data || [];

      const pdfsRes = await axios.get(
         `http://localhost:3000/cards/${cardId }/pdfs`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
      );

      console.log(pdfsRes.data.pdfsFromCard);

      const pdfs = pdfsRes.data.pdfsFromCard.pdfs || [];

      console.log(pdfs);

      // Buscar detalhes dos usuários que fizeram comentários
      // const commentsWithUserDetails = await Promise.all(
      //   comments.map(async (comment: any) => {
      //     try {
      //       const commentUserId = comment.userId?._id || comment.userId;
      //       if (!commentUserId) {
      //         throw new Error("ID do usuário não encontrado no comentário");
      //       }

      //       const commentUserRes = await axios.get(
      //         `http://localhost:3000/users/${commentUserId}`
      //       );
      //       return {
      //         ...comment,
      //         user: commentUserRes.data.data
      //       };
      //     } catch (err) {
      //       console.error("Erro ao buscar detalhes do usuário do comentário:", err);
      //       return {
      //         ...comment,
      //         user: {
      //           name: "Usuário não encontrado",
      //           email: "",
      //           profileImage: null
      //         }
      //       };
      //     }
      //   })
      // );

      // Atualiza o card com os detalhes completos
      setSelectedCard({
        ...card,
        comments: comments,
        pdfs: pdfs,
        likes: card.likes || 0
      });

      console.log(selectedCard);

    } catch (err) {
      console.error("Erro ao buscar detalhes do card:", err);
      toast.error("Erro ao carregar alguns detalhes do card");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedCard || !user) return;

    setIsSubmittingComment(true);
    try {
      const token = localStorage.getItem("authenticacao");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const cardId = selectedCard._id || selectedCard.id;

      if (!cardId) {
        throw new Error("ID do card não encontrado");
      }

      const response = await axios.post(
        `http://localhost:3000/comments`,
        {
          description: newComment.trim(),
          cardId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Atualizar o card com o novo comentário
      const updatedCard = {
        ...selectedCard,
        comments: [...(selectedCard.comments || []), {
          _id: response.data.data._id,
          description: response.data.data.description,
          userId: user._id,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage
          },
          createdAt: response.data.data.createdAt
        }]
      };

      setSelectedCard(updatedCard);
      setNewComment("");
      
      // Atualizar a lista de cards também
      setAllCards(prev => prev.map(c => 
        (c.id === cardId || c._id === cardId) ? updatedCard : c
      ));

      toast.success("Comentário adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro completo:", error);
      
      if (error.response) {
        console.error("Erro do servidor:", error.response.data);
        toast.error(error.response.data.message || "Erro ao adicionar comentário");
      } else if (error.request) {
        console.error("Sem resposta do servidor");
        toast.error("Servidor não respondeu. Tente novamente.");
      } else {
        console.error("Erro na requisição:", error.message);
        toast.error("Erro ao fazer requisição. Tente novamente.");
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchUserLists = async () => {
    try {
      const token = localStorage.getItem("authenticacao");
      const res = await axios.get(
        `http://localhost:3000/lists/user/${user?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUserLists(res.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar listas:", err);
      toast.error("Erro ao carregar suas listas");
    }
  };

  const handleDownload = async () => {
    if (!selectedListForDownload) {
      toast.error("Selecione uma lista para salvar o card");
      return;
    }

    if (!selectedCard || (!selectedCard.id && !selectedCard._id)) {
      toast.error("Card inválido. Tente novamente.");
      return;
    }

    const cardId = selectedCard.id || selectedCard._id;

    setIsDownloading(true);
    try {
      const token = localStorage.getItem("authenticacao");
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      // Tenta fazer a requisição
      const response = await axios.post(
        `http://localhost:3000/comunidade/download/${cardId}`,
        { listId: selectedListForDownload }, // Envia o ID da lista selecionada
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      console.log("Resposta do download:", response.data);
      
      toast.success("✨ Card baixado com sucesso! Acesse a página Escolar para visualizar.");
      setShowDownloadModal(false);
      setSelectedListForDownload("");
    } catch (err: any) {
      console.error("Erro detalhado ao baixar card:", err);
      
      let errorMessage = "Erro ao baixar o card";
      
      if (err.response) {
        // Erro da API
        if (err.response.status === 404) {
          errorMessage = "Card não encontrado. Tente novamente.";
        } else if (err.response.status === 401) {
          errorMessage = "Sessão expirada. Faça login novamente.";
        } else if (err.response.status === 500) {
          errorMessage = "Erro no servidor. Tente novamente mais tarde.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  // Adicionar efeito para carregar listas quando abrir o modal
  useEffect(() => {
    if (showDownloadModal) {
      fetchUserLists();
    }
  }, [showDownloadModal]);

  // Função para filtrar cards com base no texto de busca
  const getFilteredCards = () => {
    if (!searchText.trim()) {
      return allCards;
    }
    return allCards.filter(card => 
      card.title?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredCards = getFilteredCards();
  const hasNoResults = searchText.trim() !== "" && filteredCards.length === 0;

  const handleImageError = (cardId: string) => {
    setFailedImages(prev => new Set([...prev, cardId]));
  };

  // Função para verificar se há mais cards para carregar
  const hasMoreCards = () => {
    const filteredCards = getFilteredCards();
    return visibleCards < filteredCards.length;
  };

  return (
    <>
      <Header />
      <Container>
        <ContentWrapper>
          <Titulo>#comunidade</Titulo>
          <Subtitulo>Encontre outros usuários e veja seus cards publicados</Subtitulo>

          <BuscaWrapper ref={searchRef}>
            <InputBusca
              type="text"
              placeholder="Buscar usuários por nome..."
              value={searchText}
              onChange={handleUserSearch}
              onFocus={() => {
                if (searchText && filteredUsers.length > 0) {
                  setShowResults(true);
                }
              }}
            />
            {isSearching ? (
              <LoadingText>
                <LoadingSpinner />
                Buscando...
              </LoadingText>
            ) : (
              <BotaoBusca>🔍</BotaoBusca>
            )}
            
            {showResults && searchText && (
              <ListaResultados>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <ItemResultado
                      key={user._id}
                      onClick={() => handleSelectUser(user._id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={user.profileImage || DEFAULT_PROFILE_IMAGE}
                          alt={user.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                        </div>
                      </div>
                    </ItemResultado>
                  ))
                ) : (
                  <ItemResultado style={{ 
                    textAlign: 'center', 
                    cursor: 'default',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '24px' }}>🔍</span>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: 500 }}>
                        Nenhum usuário encontrado com "{searchText}"
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Tente buscar por outro nome
                      </p>
                    </div>
                  </ItemResultado>
                )}
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedId = e.target.value;
                    setSelectedListId(selectedId);
                  }}
                >
                  <option value="">Selecionar o card</option>
                  {myCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.title}
                    </option>
                  ))}
                </Select>

                <PublishButton
                  onClick={() => handlePublicar(selectedListId)}
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
            {getMostLikedCards().map((card) => (
              <Card key={card.id || card._id} onClick={() => handleCardClick(card)}>
                <CardImage>
                  {card.image_url && card.image_url.length > 0 && !failedImages.has(card.id || card._id) ? (
                    <img
                      src={`http://localhost:3000${card.image_url[0]}`}
                      alt={card.title}
                      onError={() => handleImageError(card.id || card._id)}
                    />
                  ) : (
                    <CardImageFallback>
                      <span>{card.title || 'Sem título'}</span>
                    </CardImageFallback>
                  )}
                </CardImage>
                <CardContent>
                  <CardTitle>{card.title}</CardTitle>
                  {card.user && (
                    <CardCreator>{card.user.name || 'Desconhecido'}</CardCreator>
                  )}
                  <IconsContainer>
                    <IconWrapper>
                      <Icon 
                        src={isCardLiked(card.id || card._id) ? coracaoCurtidoSvg : curtidaSvg}
                        alt="Curtir"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleLike(card);
                        }}
                      />
                      <span>{card.likes || 0}</span>
                    </IconWrapper>
                    <IconWrapper>
                      <Icon 
                        src={chatSvg}
                        alt="Comentários"
                      />
                      <span>{card.comments?.length || 0}</span>
                    </IconWrapper>
                  </IconsContainer>
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
            {getFilteredCards().slice(0, visibleCards).map((card) => (
              <Card key={card.id || card._id} onClick={() => handleCardClick(card)}>
                <CardImage>
                  {card.image_url && card.image_url.length > 0 && !failedImages.has(card.id || card._id) ? (
                    <img
                      src={`http://localhost:3000${card.image_url[0]}`}
                      alt={card.title}
                      onError={() => handleImageError(card.id || card._id)}
                    />
                  ) : (
                    <CardImageFallback>
                      <span>{card.title || 'Sem título'}</span>
                    </CardImageFallback>
                  )}
                </CardImage>
                <CardContent>
                  <CardTitle>{card.title}</CardTitle>
                  {card.user && (
                    <CardCreator>{card.user.name || 'Desconhecido'}</CardCreator>
                  )}
                  <IconsContainer>
                    <IconWrapper>
                      <Icon 
                        src={isCardLiked(card.id || card._id) ? coracaoCurtidoSvg : curtidaSvg}
                        alt="Curtir"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleLike(card);
                        }}
                      />
                      <span>{card.likes || 0}</span>
                    </IconWrapper>
                    <IconWrapper>
                      <Icon 
                        src={chatSvg}
                        alt="Comentários"
                      />
                      <span>{card.comments?.length || 0}</span>
                    </IconWrapper>
                  </IconsContainer>
                </CardContent>
              </Card>
            ))}
          </CardsGrid>

          {/* Botão Ver Mais */}
          <LoadMoreContainer visible={hasMoreCards()}>
            <LoadMoreButton onClick={loadMore}>
              Ver mais cards
            </LoadMoreButton>
          </LoadMoreContainer>
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
                  src={selectedCard.user?.profileImage || DEFAULT_PROFILE_IMAGE}
                  alt="Foto de perfil"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
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
                <h4>#estatísticas</h4>
                <div style={{
                  display: "flex",
                  gap: "16px",
                  color: "white",
                  fontSize: "14px",
                  alignItems: "center"
                }}>
                  <IconWrapper inModal>
                    <Icon 
                      src={isCardLiked(selectedCard.id || selectedCard._id) ? coracaoCurtidoSvg : curtidaSvg}
                      alt="Curtir"
                      inModal
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleLike(selectedCard);
                      }}
                    />
                    <span>{selectedCard.likes || 0}</span>
                  </IconWrapper>
                  <IconWrapper inModal>
                    <Icon 
                      src={chatSvg}
                      alt="Comentários"
                      inModal
                    />
                    <span>{selectedCard.comments?.length || 0} comentários</span>
                  </IconWrapper>
                </div>
              </SidebarCard>

              <SidebarCard>
                <h4>#ações</h4>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  <button
                    onClick={() => setShowDownloadModal(true)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#1565c0";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#1976d2";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    ⬇️ Baixar Card
                  </button>
                </div>
              </SidebarCard>

              {/* Seção de Comentários */}
              <CommentSection>
                <CommentHeader>
                  <h4>
                    #comentários
                    <span>{selectedCard.comments?.length || 0}</span>
                  </h4>
                </CommentHeader>
                
                <CommentList>
                  {selectedCard.comments?.length > 0 ? (
                    selectedCard.comments.map((comment: any) => (
                      <Comment key={comment._id}>
                        <div className="header">
                          <img
                            src={comment.userId?.profileImage || DEFAULT_PROFILE_IMAGE}
                            alt={comment.userId?.name}
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                            }}
                          />
                          <div className="info">
                            <p className="name">{comment.userId?.name || "Usuário"}</p>
                            <p className="date">{formatCommentDate(comment.createdAt)}</p>
                          </div>
                        </div>
                        <p className="content">{comment.description}</p>
                      </Comment>
                    ))
                  ) : (
                    <p style={{ color: "#666", textAlign: "center", margin: 0 }}>
                      Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                  )}
                </CommentList>

                {user ? (
                  <CommentInput>
                    <textarea
                      placeholder="Adicione um comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      maxLength={500}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                    >
                      {isSubmittingComment ? "Enviando..." : "Enviar"}
                    </button>
                  </CommentInput>
                ) : (
                  <p style={{ color: "#666", fontSize: "14px", textAlign: "center" }}>
                    Faça login para comentar
                  </p>
                )}
              </CommentSection>
            </Sidebar>

            {/* Content */}
            <ContentArea>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>{selectedCard.title}</h2>
                <button
                  onClick={() => { setShowDetailsModal(false); setSelectedCard(null) }}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#000000",
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

      {showDownloadModal && (
        <ModalOverlay>
          <div style={{
            background: "white",
            padding: "32px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "500px",
            position: "relative"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "24px" }}>
              Escolha uma lista para salvar o card
            </h3>

            <select
              value={selectedListForDownload}
              onChange={(e) => setSelectedListForDownload(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "24px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px"
              }}
            >
              <option value="">Selecione uma lista</option>
              {userLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>

            <div style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end"
            }}>
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  setSelectedListForDownload("");
                }}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#f5f5f5",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDownload}
                disabled={!selectedListForDownload || isDownloading}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#1976d2",
                  color: "white",
                  cursor: "pointer",
                  opacity: !selectedListForDownload || isDownloading ? 0.7 : 1
                }}
              >
                {isDownloading ? "Baixando..." : "Confirmar"}
              </button>
            </div>

            <button
              onClick={() => {
                setShowDownloadModal(false);
                setSelectedListForDownload("");
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              ✕
            </button>
          </div>
        </ModalOverlay>
      )}
    </>
  );
}
