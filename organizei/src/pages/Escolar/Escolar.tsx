import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import { Lista } from "../../Types/Lista";
import { CardData } from "../../Types/Card";
import {
  Container,
  Subtitle,
  Title,
  ScrollWrapper,
  Grid,
  ListColumn,
  ColumnTitle,
  CardArea,
  Card,
  ModalOverlay,
  ModalContent,
  Input,
  ButtonGroup,
  ConfirmOverlay,
  ImageUploadArea,
  CreateButton,
  InputWrapper,
  DetalhesContainer,
  Sidebar,
  SidebarCard,
  PrioridadeWrapper,
  ContentArea,
  SaveButton,
  ConfirmBox,
  PublishedIcon,
  CardDate,
  CardTitle,
  ButtonCriar,
  ButtonExcluir,
} from "../../Style/Escolar";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import comunidadeIcon from "../../../assets/comunidade.svg";
import adicionarCard from "../../../assets/adicionarCard.svg";
import lixeira from "../../../assets/lixeira.svg";

export function Escolar() {
  const { user } = useAuth();
  const userId = user?._id;
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Função auxiliar para formatar data
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Se a data é inválida, usa a data atual
        return new Date().toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      }
      
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
  };

  const [lists, setLists] = useState<Lista[]>([]);
  const [cards, setCards] = useState<Record<string, CardData[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState("");
  const [cardSelecionado, setCardSelecionado] = useState<CardData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [tituloEditavel, setTituloEditavel] = useState<string>("");
  const [descricaoEditavel, setDescricaoEditavel] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [modoExcluir, setModoExcluir] = useState(false);
  const [cardParaExcluir, setCardParaExcluir] = useState<CardData | null>(null);
  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState<string>("Baixa");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [confirmDeleteList, setConfirmDeleteList] = useState(false);
  const [listToDelete, setListToDelete] = useState<Lista | null>(null);
  const [confirmListName, setConfirmListName] = useState("");
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [listToEdit, setListToEdit] = useState<Lista | null>(null);
  const [newListName, setNewListName] = useState("");

  usePageLoading(isDataLoading);

  useEffect(() => {
    const fetchListsAndCards = async () => {
      if (!userId) return;
      
      setIsDataLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/lists/user/${userId}`
        );
        const listas = res.data.data || [];
        setLists(listas);

        if (listas.length === 0) {
          setCards({});
          return;
        }

        const cardsPorLista: Record<string, CardData[]> = {};
        await Promise.all(
          listas.map(async (list: any) => {
            const cardsRes = await axios.get(
              `http://localhost:3000/lists/${list.id}/cards`
            );
            
            // Para cada card, buscar os dados completos incluindo imagens
            const cardsWithDetails = await Promise.all(
              cardsRes.data.data.map(async (card: any) => {
                try {
                  const cardDetailRes = await axios.get(
                    `http://localhost:3000/cards/${card.id}`
                  );
                  const cardDetail = cardDetailRes.data.data;
                  
                  console.log("Card detail:", cardDetail); // Debug log
                  
                  return {
                    id: card.id,
                    title: card.title,
                    userId: card.userId,
                    createdAt: cardDetail.createdAt || card.createdAt || new Date().toISOString(),
                    updatedAt: cardDetail.updatedAt || card.updatedAt || new Date().toISOString(),
                    pdfs: cardDetail.pdfs || [],
                    image_url: cardDetail.image_url || [],
                    is_published: cardDetail.is_published || false,
                    priority: cardDetail.priority || "Baixa",
                  };
                } catch (err) {
                  // Se falhar ao buscar detalhes, retorna dados básicos
                  console.warn(`Erro ao buscar detalhes do card ${card.id}:`, err);
                  return {
                    id: card.id,
                    title: card.title,
                    userId: card.userId,
                    createdAt: card.createdAt || new Date().toISOString(),
                    updatedAt: card.updatedAt || new Date().toISOString(),
                    pdfs: [],
                    image_url: [],
                    is_published: false,
                    priority: "Baixa",
                  };
                }
              })
            );
            
            cardsPorLista[list.id] = cardsWithDetails;
          })
        );

        setCards(cardsPorLista);
      } catch (err) {
        console.error("Erro ao buscar listas ou cards", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchListsAndCards();
  }, [userId]);

  const reorder = (
    list: CardData[],
    start: number,
    end: number
  ): CardData[] => {
    const result = [...list];
    const [moved] = result.splice(start, 1);
    result.splice(end, 0, moved);
    return result;
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId) {
      // Reordenação dentro da mesma lista (apenas visual)
      const reordered = reorder(
        cards[sourceId],
        source.index,
        destination.index
      );
      setCards((prev) => ({ ...prev, [sourceId]: reordered }));
    } else {
      // Movendo card entre listas diferentes
      const sourceCards = Array.from(cards[sourceId]);
      const destCards = Array.from(cards[destId]);
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);
      
      // Atualiza o estado visual imediatamente
      setCards((prev) => ({
        ...prev,
        [sourceId]: sourceCards,
        [destId]: destCards,
      }));

      // Persiste a mudança no backend
      try {
        const token = localStorage.getItem("authenticacao");
        await axios.patch(
          `http://localhost:3000/cards/${movedCard.id}`,
          { listId: destId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log(`Card ${movedCard.title} movido para lista ${destId}`);
        toast.success("Card movido com sucesso!");
      } catch (err) {
        console.error("Erro ao mover card:", err);
        toast.error("Erro ao mover card. Recarregue a página.");
        
        // Reverte a mudança visual em caso de erro
        const revertSourceCards = Array.from(cards[sourceId]);
        const revertDestCards = Array.from(cards[destId]);
        const [revertCard] = revertDestCards.splice(destination.index, 1);
        revertSourceCards.splice(source.index, 0, revertCard);
        
        setCards((prev) => ({
          ...prev,
          [sourceId]: revertSourceCards,
          [destId]: revertDestCards,
        }));
      }
    }
  };

  const openCardModal = (listId: string) => {
    setSelectedListId(listId);
    setShowCardModal(true);
  };

  const handleCreateList = async () => {
    if (!userId || !listName.trim()) {
      alert("Preencha o nome da lista corretamente.");
      return;
    }

    const payload = {
      name: listName.trim(),
      userId,
    };

    try {
      const res = await axios.post("http://localhost:3000/lists", payload);

      const novaLista = {
        id: res.data.data.id || res.data.data._id,
        name: res.data.data.name,
        userId: res.data.data.userId,
      };

      setLists((prev) => [...prev, novaLista]);
      setListName("");
      setShowModal(false);
    } catch (err: any) {
      console.error("Erro ao criar lista", err);
      if (err.response) {
        console.error("Resposta do backend:", err.response.data);
      }
    }
  };

  const handleCreateCard = async () => {
    if (!cardTitle || !selectedListId) {
      toast.error("Preencha o nome do card.");
      console.log("❌ Título do card ou lista não selecionados.");
      return;
    }

    try {
      console.log("🚀 Iniciando criação do card...");
      console.log("📦 Dados enviados:", {
        title: cardTitle,
        listId: selectedListId,
      });

      const res = await axios.post("http://localhost:3000/cards", {
        title: cardTitle,
        listId: selectedListId,
      });

      const newCardId = res.data.data.id;
      console.log("✅ Card criado com sucesso:", newCardId);
      toast.success("Card criado com sucesso!");

      // Upload da imagem, se houver
      if (image) {
        console.log("🖼️ Iniciando upload da imagem:", image.name);
        const formData = new FormData();
        formData.append("files", image);

        await axios.post(
          `http://localhost:3000/cards/${newCardId}/files`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("✅ Upload da imagem concluído.");
        toast.success("Imagem enviada com sucesso.");
      }

      // Recarregar os dados da lista para mostrar o card com a imagem
      try {
        const cardsRes = await axios.get(
          `http://localhost:3000/lists/${selectedListId}/cards`
        );
        
        const cardsWithDetails = await Promise.all(
          cardsRes.data.data.map(async (card: any) => {
            try {
              const cardDetailRes = await axios.get(
                `http://localhost:3000/cards/${card.id}`
              );
              const cardDetail = cardDetailRes.data.data;
              
              return {
                id: card.id,
                title: card.title,
                userId: card.userId,
                createdAt: card.createdAt,
                pdfs: cardDetail.pdfs || [],
                image_url: cardDetail.image_url || [],
                is_published: cardDetail.is_published || false,
                priority: cardDetail.priority || "Baixa",
              };
            } catch (err) {
              return {
                id: card.id,
                title: card.title,
                userId: card.userId,
                createdAt: card.createdAt,
                pdfs: [],
                image_url: [],
                is_published: false,
                priority: "Baixa",
              };
            }
          })
        );

        setCards((prev) => ({
          ...prev,
          [selectedListId]: cardsWithDetails,
        }));
      } catch (err) {
        console.error("Erro ao recarregar cards:", err);
      }

      setShowCardModal(false);
      setCardTitle("");
      setImage(null);
      console.log("🧹 Formulário resetado. Modal fechado.");
    } catch (err) {
      console.error("💥 Erro ao criar card ou enviar imagem:", err);
      toast.error("Erro ao criar card ou enviar imagem.");
    }
  };
  const handleDeleteCard = async () => {
    if (!cardParaExcluir || !selectedListId) return;
    try {
      await axios.delete(`http://localhost:3000/cards/${cardParaExcluir.id}`);
      setCards((prev) => ({
        ...prev,
        [selectedListId]: prev[selectedListId].filter(
          (c) => c.id !== cardParaExcluir.id
        ),
      }));
      setCardParaExcluir(null);
      setConfirmDelete(false);
      setModoExcluir(false); // Sai do modo excluir após deletar
    } catch (err) {
      console.error("Erro ao excluir card", err);
    }
  };

  const handleSalvarEdicao = async () => {
    if (!cardSelecionado || !novoTitulo.trim() || !selectedListId) {
      console.log("Dados insuficientes para editar.");
      return;
    }

    try {
      console.log("Editando título...");
      const token = localStorage.getItem("authenticacao");
      const res = await axios.patch(
        `http://localhost:3000/cards/${cardSelecionado.id}`,
        { title: novoTitulo.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Título atualizado:", res.data.data.title);

      // Upload de arquivos (imagem e/ou PDF)
      if (image || pdf) {
        const formData = new FormData();
        if (image) formData.append("files", image);
        if (pdf) formData.append("files", pdf);

        await axios.post(
          `http://localhost:3000/cards/${cardSelecionado.id}/files`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Arquivos enviados com sucesso.");
      }

      setCards((prev) => ({
        ...prev,
        [selectedListId]: prev[selectedListId].map((c) =>
          c.id === cardSelecionado.id ? { ...c, title: res.data.data.title } : c
        ),
      }));

      setCardSelecionado({ ...cardSelecionado, title: res.data.data.title });
      setEditModalOpen(false);
      setImage(null);
      setPdf(null);
      console.log("Edição concluída.");
    } catch (err) {
      console.error("Erro ao editar card ou enviar arquivos", err);
    }
  };

  const handleSalvarDetalhes = async () => {
    if (!cardSelecionado || !tituloEditavel.trim() || !selectedListId) {
      toast.error("Preencha o título corretamente.");
      return;
    }

    try {
      // Atualiza o título, prioridade e descrição
      const res = await axios.patch(
        `http://localhost:3000/cards/${cardSelecionado.id}`,
        { 
          title: tituloEditavel.trim(),
          priority: prioridadeSelecionada,
          content: descricaoEditavel
        }
      );

      // Upload do PDF se houver
      if (pdf) {
        const formData = new FormData();
        formData.append("files", pdf);

        await axios.post(
          `http://localhost:3000/cards/${cardSelecionado.id}/files`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      // Recarregar os dados completos do card
      const cardDetailRes = await axios.get(
        `http://localhost:3000/cards/${cardSelecionado.id}`
      );
      const cardDetail = cardDetailRes.data.data;

      const updatedCard = {
        ...cardSelecionado,
        title: res.data.data.title,
        priority: prioridadeSelecionada,
        content: descricaoEditavel,
        pdfs: cardDetail.pdfs || [],
        image_url: cardDetail.image_url || [],
        is_published: cardDetail.is_published || false,
      };

      // Atualizar na lista de cards
      setCards((prev) => ({
        ...prev,
        [selectedListId]: prev[selectedListId].map((c) =>
          c.id === cardSelecionado.id ? updatedCard : c
        ),
      }));

      // Atualiza no modal
      setCardSelecionado(updatedCard);

      toast.success("Card atualizado com sucesso.");
      setPdf(null);
    } catch (error) {
      console.error("Erro ao atualizar card:", error);
      toast.error("Erro ao atualizar card.");
    }
  };

  const handleDeleteList = async (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setListToDelete(list);
      setConfirmDeleteList(true);
    }
  };

  const confirmDeleteListAction = async () => {
    if (!listToDelete) return;
    
    // Verificar se o nome digitado está correto
    if (confirmListName.trim() !== listToDelete.name) {
      toast.error("O nome digitado não confere com o nome da lista!");
      return;
    }
    
    try {
      await axios.delete(`http://localhost:3000/lists/${listToDelete.id}`);
      setLists((prev) => prev.filter((list) => list.id !== listToDelete.id));
      setCards((prev) => {
        const updated = { ...prev };
        delete updated[listToDelete.id];
        return updated;
      });
      toast.success("Lista excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir lista", err);
      toast.error("Erro ao excluir lista");
    } finally {
      setConfirmDeleteList(false);
      setListToDelete(null);
      setConfirmListName("");
    }
  };

  const handleExibirDetalhes = async (cardId: string, listId: string) => {
    const card = cards[listId]?.find((c) => c.id === cardId);
    if (card) {
      setSelectedListId(listId);
      setTituloEditavel(card.title);

      try {
        const res = await axios.get(`http://localhost:3000/cards/${card.id}`);
        const cardData = res.data.data;

        // Atualiza o card com os dados completos, incluindo PDFs
        const updatedCard = {
          ...card,
          pdfs: cardData.pdfs || [],
          image_url: cardData.image_url || [],
          content: cardData.content || "",
          priority: cardData.priority || "Baixa",
          is_published: cardData.is_published,
        };

        // Define a prioridade selecionada e descrição
        setPrioridadeSelecionada(updatedCard.priority);
        setDescricaoEditavel(updatedCard.content);
        setCardSelecionado(updatedCard);

        // Atualiza o card na lista de cards
        setCards((prev) => ({
          ...prev,
          [listId]: prev[listId].map((c) =>
            c.id === cardId ? updatedCard : c
          ),
        }));
      } catch (err) {
        console.error("Erro ao buscar detalhes do card:", err);
      }
    }
  };

  const loadPdf = async (cardId: string) => {
    try {
      console.log("Current cardSelecionado:", cardSelecionado);

      // Verifica se o card tem PDFs
      if (
        !cardSelecionado?.pdfs ||
        !Array.isArray(cardSelecionado.pdfs) ||
        cardSelecionado.pdfs.length === 0
      ) {
        console.log("No PDFs available for this card");
        setPdfUrl(null);
        return;
      }

      const token = localStorage.getItem("authenticacao");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const pdfData = cardSelecionado.pdfs[0];
      console.log("PDF data to load:", pdfData);

      // Usa o endpoint correto para visualizar o PDF
      const response = await fetch(
        `http://localhost:3000/cards/${cardId}/pdf/0/view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("PDF loading failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          `Failed to load PDF: ${response.status} ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        console.error("Invalid content type:", contentType);
        throw new Error("Invalid PDF content type");
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Received empty PDF");
      }

      console.log("PDF loaded successfully, size:", blob.size);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao carregar o PDF"
      );
      setPdfUrl(null);
    }
  };

  // Efeito para carregar o PDF quando o card selecionado mudar
  useEffect(() => {
    if (cardSelecionado?.id) {
      console.log("Card selected, loading PDF...");
      // Pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        loadPdf(cardSelecionado.id);
      }, 100);
    }
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [cardSelecionado?.id, cardSelecionado?.pdfs]);

  // Função para obter a cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "#ff4757"; // Vermelho
      case "Média":
        return "#ffa502"; // Laranja
      case "Baixa":
        return "#2ed573"; // Verde
      default:
        return "#2ed573"; // Verde (padrão)
    }
  };

  const handleEditList = (listId: string, currentName: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setListToEdit(list);
      setNewListName(list.name);
      setShowEditListModal(true);
    }
  };

  const handleSaveListEdit = async () => {
    if (!listToEdit || !newListName.trim()) {
      toast.error("Nome da lista não pode estar vazio!");
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:3000/lists/${listToEdit.id}`, {
        name: newListName.trim()
      });

      // Atualizar a lista no estado
      setLists((prev) => 
        prev.map((list) => 
          list.id === listToEdit.id 
            ? { ...list, name: newListName.trim() }
            : list
        )
      );

      toast.success("Nome da lista atualizado com sucesso!");
      setShowEditListModal(false);
      setListToEdit(null);
      setNewListName("");
    } catch (err) {
      console.error("Erro ao editar lista", err);
      toast.error("Erro ao editar lista");
    }
  };

  const handleCancelListEdit = () => {
    setShowEditListModal(false);
    setListToEdit(null);
    setNewListName("");
  };

  const handleCloseCardModal = () => {
    setCardSelecionado(null);
    setDescricaoEditavel("");
    setPdf(null);
    setPdfUrl(null);
    // Limpar o input de arquivo
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handlePublishToCommunity = async () => {
    if (!cardSelecionado || !selectedListId) {
      toast.error("Card não selecionado.");
      return;
    }

    try {
      const token = localStorage.getItem("authenticacao");
      const res = await axios.post(
        `http://localhost:3000/comunidade/publish/${cardSelecionado.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Card publicado com sucesso:", res.data.data);
      toast.success("Card publicado na comunidade com sucesso!");

      // Recarregar os dados da lista
      try {
        const cardsRes = await axios.get(
          `http://localhost:3000/lists/${selectedListId}/cards`
        );
        
        const cardsWithDetails = await Promise.all(
          cardsRes.data.data.map(async (card: any) => {
            try {
              const cardDetailRes = await axios.get(
                `http://localhost:3000/cards/${card.id}`
              );
              const cardDetail = cardDetailRes.data.data;
              
              return {
                id: card.id,
                title: card.title,
                userId: card.userId,
                createdAt: card.createdAt,
                pdfs: cardDetail.pdfs || [],
                image_url: cardDetail.image_url || [],
                is_published: cardDetail.is_published || false,
                priority: cardDetail.priority || "Baixa",
              };
            } catch (err) {
              return {
                id: card.id,
                title: card.title,
                userId: card.userId,
                createdAt: card.createdAt,
                pdfs: [],
                image_url: [],
                is_published: false,
                priority: "Baixa",
              };
            }
          })
        );

        setCards((prev) => ({
          ...prev,
          [selectedListId]: cardsWithDetails,
        }));
      } catch (err) {
        console.error("Erro ao recarregar cards:", err);
      }

      setCardSelecionado({ ...cardSelecionado, is_published: true });
    } catch (err) {
      console.error("Erro ao publicar card:", err);
      toast.error("Erro ao publicar card.");
    }
  };

  return (
    <>
      <Header />
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            <Subtitle>#escolar</Subtitle>
            <Title>O que vamos estudar hoje?</Title>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <ButtonCriar onClick={() => setShowModal(true)}>
              <img src={adicionarCard} alt="Adicionar" />
              Criar nova lista
            </ButtonCriar>

            <ButtonExcluir
              className={modoExcluir ? "ativo" : ""}
              onClick={() => setModoExcluir(!modoExcluir)}
            >
              <img src={lixeira} alt="Excluir" />
            </ButtonExcluir>
          </div>
        </div>

        <ScrollWrapper>
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid ref={gridRef}>
              {lists.map((list) => (
                <Droppable droppableId={list.id} key={list.id}>
                  {(provided) => (
                    <ListColumn
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <ColumnTitle>{list.name}</ColumnTitle>
                      
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "flex-end", 
                        gap: "8px", 
                        marginBottom: "8px" 
                      }}>
                        <button
                          onClick={() => handleEditList(list.id, list.name)}
                          style={{
                            background: "transparent",
                            color: "#666",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            transition: "color 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#333"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
                        >
                          Editar Lista
                        </button>
                        
                        <button
                          onClick={() => handleDeleteList(list.id)}
                          style={{
                            background: "transparent",
                            color: "red",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            transition: "color 0.2s ease"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#d32f2f"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "red"}
                        >
                          Excluir Lista
                        </button>
                      </div>

                      <CardArea>
                        {(cards[list.id] || []).map((card, index) => (
                          <Draggable
                            draggableId={card.id}
                            index={index}
                            key={card.id}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={modoExcluir ? "modo-excluir" : ""}
                                onMouseDown={() =>
                                  ((card as any).clickStart = Date.now())
                                }
                                onClick={() => {
                                  const now = Date.now();
                                  if (modoExcluir) {
                                    setCardParaExcluir(card);
                                    setSelectedListId(list.id);
                                    setConfirmDelete(true);
                                  } else if (
                                    (card as any).clickStart &&
                                    now - (card as any).clickStart < 150
                                  ) {
                                    handleExibirDetalhes(card.id, list.id);
                                  }
                                }}
                                onMouseEnter={(e) => {
                                  if (modoExcluir) {
                                    e.currentTarget.classList.add(
                                      "hover-excluir"
                                    );
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (modoExcluir) {
                                    e.currentTarget.classList.remove(
                                      "hover-excluir"
                                    );
                                  }
                                }}
                              >
                                {/* Conteúdo do card */}
                                <div className="card-content">
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
                                          // Fallback caso a imagem não carregue
                                          e.currentTarget.parentElement!.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  )}

                                  {/* Área do título e foto do usuário */}
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "start",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <CardTitle>
                                      {card.title.length > 40
                                        ? card.title.slice(0, 40) + "..."
                                        : card.title}
                                    </CardTitle>
                                    
                                    {/* Foto do perfil do usuário */}
                                    <img
                                      src={
                                        user?.profileImage ||
                                        "https://via.placeholder.com/30"
                                      }
                                      alt="foto"
                                      style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        flexShrink: 0,
                                      }}
                                    />
                                  </div>

                                  {/* Linha de data, barra de prioridade e publicado */}
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginTop: "auto",
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
                                      <CardDate style={{ flexShrink: 0 }}>
                                        {formatDate(card.createdAt)}
                                      </CardDate>
                                      
                                      {/* Barra horizontal de prioridade */}
                                      <div
                                        style={{
                                          width: "100px",
                                          height: "6px",
                                          backgroundColor: getPriorityColor(card.priority || "Baixa"),
                                          borderRadius: "3px",
                                          flexShrink: 0,
                                        }}
                                      />
                                    </div>

                                    {card.is_published && (
                                      <PublishedIcon
                                        src={comunidadeIcon}
                                        alt="Publicado"
                                        title="Publicado na comunidade"
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* Ícone de exclusão */}
                                <div className="icon-excluir">
                                  <img src={lixeira} alt="Excluir" />
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Card de adicionar */}
                        <Card
                          className="add-card"
                          onClick={() => openCardModal(list.id)}
                        >
                          <img
                            src={adicionarCard}
                            alt="Adicionar"
                            style={{
                              width: "32px",
                              height: "32px",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        </Card>
                      </CardArea>
                    </ListColumn>
                  )}
                </Droppable>
              ))}
            </Grid>
          </DragDropContext>
        </ScrollWrapper>
      </Container>

      {cardSelecionado && (
        <ModalOverlay>
          <DetalhesContainer>
            {/* Sidebar */}
            <Sidebar>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src={user?.profileImage || "https://via.placeholder.com/40"}
                  alt="Foto de perfil"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{user?.name}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                    Criador premium
                  </p>
                </div>
              </div>

              <SidebarCard>
                <h4>#titulo</h4>
                <input
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#111",
                    color: "white",
                  }}
                  value={tituloEditavel}
                  onChange={(e) => setTituloEditavel(e.target.value)}
                />
              </SidebarCard>

              <SidebarCard>
                <h4>#prioridade</h4>
                <PrioridadeWrapper>
                  <span 
                    onClick={() => setPrioridadeSelecionada("Baixa")}
                    style={{ 
                      cursor: "pointer",
                      opacity: prioridadeSelecionada === "Baixa" ? 1 : 0.5,
                      fontWeight: prioridadeSelecionada === "Baixa" ? "bold" : "normal"
                    }}
                  >
                    <div className="baixa" /> Baixa
                  </span>
                  <span 
                    onClick={() => setPrioridadeSelecionada("Média")}
                    style={{ 
                      cursor: "pointer",
                      opacity: prioridadeSelecionada === "Média" ? 1 : 0.5,
                      fontWeight: prioridadeSelecionada === "Média" ? "bold" : "normal"
                    }}
                  >
                    <div className="media" /> Média
                  </span>
                  <span 
                    onClick={() => setPrioridadeSelecionada("Alta")}
                    style={{ 
                      cursor: "pointer",
                      opacity: prioridadeSelecionada === "Alta" ? 1 : 0.5,
                      fontWeight: prioridadeSelecionada === "Alta" ? "bold" : "normal"
                    }}
                  >
                    <div className="alta" /> Alta
                  </span>
                </PrioridadeWrapper>
              </SidebarCard>

              <SidebarCard>
                <h4>#descrição</h4>
                <textarea
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#111",
                    color: "white",
                    resize: "vertical",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    lineHeight: "1.4"
                  }}
                  value={descricaoEditavel}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setDescricaoEditavel(e.target.value);
                    }
                  }}
                  placeholder="Adicione uma descrição para o seu card..."
                />
                <div style={{
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "8px",
                  textAlign: "right"
                }}>
                  {descricaoEditavel.length}/500
                </div>
              </SidebarCard>

              {/* Botão de Publicar na Comunidade */}
              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={handlePublishToCommunity}
                  disabled={cardSelecionado?.is_published}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: cardSelecionado?.is_published ? "#4caf50" : "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: cardSelecionado?.is_published ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                    opacity: cardSelecionado?.is_published ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!cardSelecionado?.is_published) {
                      e.currentTarget.style.backgroundColor = "#1976d2";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!cardSelecionado?.is_published) {
                      e.currentTarget.style.backgroundColor = "#2196f3";
                    }
                  }}
                >
                  {cardSelecionado?.is_published ? (
                    <>
                      ✅ Publicado na Comunidade
                    </>
                  ) : (
                    <>
                      🌐 Publicar na Comunidade
                    </>
                  )}
                </button>
              </div>
            </Sidebar>

            {/* Content */}
            <ContentArea>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>{tituloEditavel}</h2>
                <button
                  onClick={handleCloseCardModal}
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
              {cardSelecionado?.pdfs &&
              Array.isArray(cardSelecionado.pdfs) &&
              cardSelecionado.pdfs.length > 0 ? (
                <div
                  style={{
                    width: "100%",
                    height: "500px",
                    background: "#eaeaea",
                    borderRadius: "20px",
                    marginBottom: "20px",
                    overflow: "hidden",
                  }}
                >
                  {pdfUrl ? (
                    <iframe
                      src={pdfUrl}
                      title={cardSelecionado.pdfs[0].filename}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <p>Carregando PDF...</p>
                      <button
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                        style={{
                          background: "#111",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "30px",
                          cursor: "pointer",
                        }}
                      >
                        ⬆️ Upar PDF
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "500px",
                    background: "#eaeaea",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    flexDirection: "column",
                  }}
                >
                  {pdf ? (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontWeight: "500", color: "#444", marginBottom: "16px" }}>
                        📄 PDF selecionado:
                      </p>
                      <p style={{ 
                        fontWeight: "bold", 
                        color: "#333", 
                        marginBottom: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "2px solid #4caf50"
                      }}>
                        {pdf.name}
                      </p>
                      <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
                        Clique em "Salvar" para enviar o arquivo
                      </p>
                      <button
                        onClick={() => {
                          setPdf(null);
                          const fileInput = document.getElementById("fileInput") as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        style={{
                          background: "#f44336",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        ❌ Remover PDF
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontWeight: "500", color: "#444" }}>
                        Nenhum PDF encontrado, envie um!
                      </p>
                      <button
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                        style={{
                          background: "#111",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "30px",
                          cursor: "pointer",
                          marginTop: "10px",
                        }}
                      >
                        ⬆️ Upar PDF
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="fileInput"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPdf(file);
                        console.log("📄 PDF selecionado:", file.name);
                      }
                    }}
                  />
                </div>
              )}

              <SaveButton onClick={handleSalvarDetalhes}>Salvar</SaveButton>
            </ContentArea>
          </DetalhesContainer>
        </ModalOverlay>
      )}

      {editModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>Editar Título</h3>
            <Input
              value={novoTitulo}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setNovoTitulo(e.target.value);
                }
              }}
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {image && (
              <p style={{ marginBottom: "8px" }}>
                🖼️ <strong>Imagem selecionada:</strong> {image.name}
              </p>
            )}

            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
            />
            {pdf && (
              <p style={{ marginBottom: "8px" }}>
                📄 <strong>PDF selecionado:</strong> {pdf.name}
              </p>
            )}

            <ButtonGroup>
              <button
                className="cancel"
                onClick={() => setEditModalOpen(false)}
              >
                Cancelar
              </button>
              <button className="confirm" onClick={handleSalvarEdicao}>
                Salvar
              </button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {confirmDelete && (
        <ConfirmOverlay>
          <ConfirmBox>
            <h3>Confirmar Exclusão</h3>
            <p>
              Deseja excluir o card <strong>{cardParaExcluir?.title}</strong>?
            </p>
            <ButtonGroup>
              <button
                className="cancel"
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </button>
              <button className="confirm" onClick={handleDeleteCard}>
                Confirmar
              </button>
            </ButtonGroup>
          </ConfirmBox>
        </ConfirmOverlay>
      )}

      {confirmDeleteList && (
        <ConfirmOverlay>
          <ConfirmBox>
            <h3>⚠️ Excluir Lista</h3>
            <p>
              Tem certeza que deseja excluir a lista <strong>"{listToDelete?.name}"</strong>?
            </p>
            <p style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: '16px' }}>
              ⚠️ ATENÇÃO: Todos os {cards[listToDelete?.id || '']?.length || 0} cards desta lista serão excluídos permanentemente e não poderão ser recuperados!
            </p>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ marginBottom: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                Para confirmar, digite o nome da lista: <br/>
                <span style={{ color: '#d32f2f', fontSize: '16px' }}>"{listToDelete?.name}"</span>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Input
                  type="text"
                  placeholder={`Digite "${listToDelete?.name}" para confirmar`}
                  value={confirmListName}
                  onChange={(e) => setConfirmListName(e.target.value)}
                  style={{ 
                    width: '300px',
                    padding: '10px 12px', 
                    border: confirmListName.trim() === listToDelete?.name ? '2px solid #4caf50' : '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: '#fff',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>

            <ButtonGroup>
              <button
                className="cancel"
                onClick={() => {
                  setConfirmDeleteList(false);
                  setListToDelete(null);
                  setConfirmListName("");
                }}
              >
                Cancelar
              </button>
              <button 
                className="confirm" 
                onClick={confirmDeleteListAction}
                disabled={confirmListName.trim() !== listToDelete?.name}
                style={{ 
                  backgroundColor: confirmListName.trim() === listToDelete?.name ? '#d32f2f' : '#ccc',
                  cursor: confirmListName.trim() === listToDelete?.name ? 'pointer' : 'not-allowed'
                }}
              >
                Excluir Lista
              </button>
            </ButtonGroup>
          </ConfirmBox>
        </ConfirmOverlay>
      )}

      {showModal && (
        <ModalOverlay>
          <ModalContent style={{
            maxWidth: '450px',
            padding: '32px',
            borderRadius: '20px',
            background: '#000000',
            color: 'white',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📋 Nova Lista
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                ✕
              </button>
            </div>

            {/* Input Section */}
            <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
                color: 'rgba(255,255,255,0.9)'
              }}>
                ✏️ Nome da lista
              </label>
              <div style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}>
                <input
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Digite o nome da sua lista..."
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: '16px',
                    borderRadius: '12px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.parentElement!.style.borderColor = 'rgba(255,255,255,0.5)';
                    e.currentTarget.parentElement!.style.background = 'rgba(255,255,255,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.parentElement!.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.parentElement!.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && listName.trim()) {
                      handleCreateList();
                    }
                  }}
                  autoFocus
                />
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  {listName.length}/100
                </div>
              </div>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.7)',
                margin: '8px 0 0 0',
                fontStyle: 'italic'
              }}>
                💡 Dica: Use nomes descritivos como "Matemática", "Projetos" ou "Estudos"
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              position: 'relative',
              zIndex: 1
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateList}
                disabled={!listName.trim()}
                style={{
                  flex: 2,
                  padding: '14px 20px',
                  background: listName.trim() 
                    ? 'linear-gradient(45deg, #4CAF50, #45a049)' 
                    : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: listName.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: listName.trim() ? '0 8px 20px rgba(76, 175, 80, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (listName.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(76, 175, 80, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (listName.trim()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(76, 175, 80, 0.3)';
                  }
                }}
              >
                {listName.trim() ? '🚀 Criar Lista' : '⚠️ Digite um nome'}
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {showCardModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Criando seu card</h2>

            <p>Imagem que aparecerá na comunidade</p>
            <ImageUploadArea
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" />
              ) : (
                <span>📷</span>
              )}
            </ImageUploadArea>

            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              style={{ display: "none" }}
            />

            <p>Defina o nome do card</p>
            <InputWrapper>
              <span>✏️</span>
              <input
                placeholder="Nome do card"
                value={cardTitle}
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setCardTitle(e.target.value);
                  }
                }}
              />
            </InputWrapper>

            <CreateButton onClick={handleCreateCard}>CRIAR</CreateButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {showEditListModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Editar Lista</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Nome atual:</p>
              <p style={{ 
                padding: '10px 12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px',
                margin: '0 0 16px 0',
                color: '#666'
              }}>
                {listToEdit?.name}
              </p>
              
              <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Novo nome:</p>
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Digite o novo nome da lista"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4caf50'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveListEdit();
                  }
                }}
                autoFocus
              />
            </div>

            <ButtonGroup>
              <button
                className="cancel"
                onClick={handleCancelListEdit}
              >
                Cancelar
              </button>
              <button 
                className="confirm" 
                onClick={handleSaveListEdit}
                disabled={!newListName.trim() || newListName.trim() === listToEdit?.name}
                style={{
                  backgroundColor: (!newListName.trim() || newListName.trim() === listToEdit?.name) ? '#ccc' : '#4caf50',
                  cursor: (!newListName.trim() || newListName.trim() === listToEdit?.name) ? 'not-allowed' : 'pointer'
                }}
              >
                Salvar
              </button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
