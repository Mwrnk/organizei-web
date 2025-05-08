import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import { Lista } from "../../Types/Lista";
import { CardData } from "../../Types/Card";
import {
  Container,
  Subtitle,
  Title,
  ButtonPrimary,
  ScrollWrapper,
  ScrollButton,
  Grid,
  ListColumn,
  ColumnTitle,
  CardArea,
  Card,
  ModalOverlay,
  ModalContent,
  Input,
  ButtonGroup,
  DetalhesCardModal,
  ConfirmOverlay,
  ConfirmBox,
} from "../../Style/Escolar";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

// Styled Components

// Tipagens

export function Escolar() {
  const { user } = useAuth();
  const userId = user?._id;
  const gridRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const fetchListsAndCards = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/users/${userId}/lists`
        );

        const listas = res.data.data || [];
        setLists(listas);
        if (listas.length === 0) {
          setCards({});
          return;
        }
        const cardsPorLista: Record<string, CardData[]> = {};
        await Promise.all(
          listas.map(async (list) => {
            const cardsRes = await axios.get(
              `http://localhost:3000/lists/${list.id}/cards`
            );
            cardsPorLista[list.id] = cardsRes.data.data.map((card: any) => ({
              id: card.id,
              title: card.title,
              userId: card.userId,
              createdAt: card.createdAt,
            }));
          })
        );
        setCards(cardsPorLista);
      } catch (err) {
        console.error("Erro ao buscar listas ou cards", err);
      }
    };
    fetchListsAndCards();
  }, [userId]);

  const scrollLeft = () =>
    gridRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    gridRef.current?.scrollBy({ left: 300, behavior: "smooth" });

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

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId) {
      const reordered = reorder(
        cards[sourceId],
        source.index,
        destination.index
      );
      setCards((prev) => ({ ...prev, [sourceId]: reordered }));
    } else {
      const sourceCards = Array.from(cards[sourceId]);
      const destCards = Array.from(cards[destId]);
      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);
      setCards((prev) => ({
        ...prev,
        [sourceId]: sourceCards,
        [destId]: destCards,
      }));
    }
  };

  const handleCreateList = async () => {
    if (!userId || !listName.trim()) return;
    try {
      const res = await axios.post("http://localhost:3000/lists", {
        name: listName.trim(),
        userId,
      });
      setLists((prev) => [...prev, res.data.data]);
      setListName("");
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao criar lista", err);
    }
  };

  const openCardModal = (listId: string) => {
    setSelectedListId(listId);
    setShowCardModal(true);
  };

  const handleCreateCard = async () => {
    if (!cardTitle || !selectedListId) return;
    try {
      const res = await axios.post("http://localhost:3000/cards", {
        title: cardTitle,
        listId: selectedListId,
      });
      const newCard = {
        id: res.data.data.id,
        title: res.data.data.title,
        userId: res.data.data.userId,
      };

      setCards((prev) => ({
        ...prev,
        [selectedListId]: [...(prev[selectedListId] || []), newCard],
      }));
      setShowCardModal(false);
      setCardTitle("");
    } catch (err) {
      console.error("Erro ao criar card", err);
    }
  };

  const handleExibirDetalhes = (cardId: string, listId: string) => {
    const card = cards[listId]?.find((c) => c.id === cardId);
    if (card) {
      setCardSelecionado(card);
      setSelectedListId(listId);
    }
  };

  const handleDeleteCard = async () => {
    if (!cardSelecionado || !selectedListId) return;
    try {
      await axios.delete(`http://localhost:3000/cards/${cardSelecionado.id}`);
      setCards((prev) => ({
        ...prev,
        [selectedListId]: prev[selectedListId].filter(
          (c) => c.id !== cardSelecionado.id
        ),
      }));
      setCardSelecionado(null);
      setConfirmDelete(false);
    } catch (err) {
      console.error("Erro ao excluir card", err);
    }
  };

  const handleSalvarEdicao = async () => {
    if (!cardSelecionado || !novoTitulo.trim() || !selectedListId) return;
    try {
      const res = await axios.patch(
        `http://localhost:3000/cards/${cardSelecionado.id}`,
        {
          title: novoTitulo.trim(),
        }
      );
      setCards((prev) => ({
        ...prev,
        [selectedListId]: prev[selectedListId].map((c) =>
          c.id === cardSelecionado.id ? { ...c, title: res.data.data.title } : c
        ),
      }));
      setCardSelecionado({ ...cardSelecionado, title: res.data.data.title });
      setEditModalOpen(false);
    } catch (err) {
      console.error("Erro ao editar card", err);
    }
  };
  const handleDeleteList = async (listId: string) => {
    try {
      await axios.delete(`http://localhost:3000/lists/${listId}`);
      setLists((prev) => prev.filter((list) => list.id !== listId));
      setCards((prev) => {
        const updated = { ...prev };
        delete updated[listId];
        return updated;
      });
    } catch (err) {
      console.error("Erro ao excluir lista", err);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Subtitle>#escolar</Subtitle>
        <Title>O que vamos estudar hoje?</Title>
        <ButtonPrimary onClick={() => setShowModal(true)}>
          + Criar nova lista
        </ButtonPrimary>

        <ScrollWrapper>
          <ScrollButton left onClick={scrollLeft}>
            ⬅
          </ScrollButton>
          <ScrollButton onClick={scrollRight}>➡</ScrollButton>

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
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        style={{
                          alignSelf: "flex-end",
                          background: "transparent",
                          color: "red",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginBottom: "8px",
                        }}
                      >
                        Excluir Lista
                      </button>

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
                                onMouseDown={() =>
                                  ((card as any).clickStart = Date.now())
                                }
                                onClick={() => {
                                  const now = Date.now();
                                  if (
                                    (card as any).clickStart &&
                                    now - (card as any).clickStart < 150
                                  ) {
                                    handleExibirDetalhes(card.id, list.id);
                                  }
                                }}
                              >
                                {card.title}
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <Card onClick={() => openCardModal(list.id)}>
                          + Adicionar Card
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
          <DetalhesCardModal>
            <h3>Detalhes do Card</h3>
            <p>
              <strong>ID:</strong> {cardSelecionado.id}
            </p>
            <p>
              <strong>Título:</strong> {cardSelecionado.title}
            </p>

            <ButtonGroup>
              <button
                className="cancel"
                onClick={() => setCardSelecionado(null)}
              >
                Fechar
              </button>
              <button
                className="confirm"
                onClick={() => {
                  setNovoTitulo(cardSelecionado.title);
                  setEditModalOpen(true);
                }}
              >
                Editar
              </button>
              <button
                className="confirm"
                onClick={() => setConfirmDelete(true)}
              >
                Excluir
              </button>
            </ButtonGroup>
          </DetalhesCardModal>
        </ModalOverlay>
      )}

      {editModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>Editar Título</h3>
            <Input
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />
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
              Deseja excluir o card <strong>{cardSelecionado?.title}</strong>?
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

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Nova Lista</h3>
            <Input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Nome da lista"
            />
            <ButtonGroup>
              <button className="confirm" onClick={handleCreateList}>
                Criar
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      {showCardModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Novo Card</h3>
            <Input
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Título do Card"
            />
            <ButtonGroup>
              <button className="confirm" onClick={handleCreateCard}>
                Criar
              </button>
              <button
                className="cancel"
                onClick={() => setShowCardModal(false)}
              >
                Cancelar
              </button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
