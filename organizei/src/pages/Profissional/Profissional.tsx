import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import styled from "styled-components";

// Tipos locais
type Tag = {
  _id: string;
  name: string;
};

type Flashcard = {
  _id: string;
  front: string;
  back: string;
  tags: Tag[] | string[];
};

type CardType = {
  _id: string;
  title: string;
};

// Styled Components
const Container = styled.div``;
const Card = styled.div`
  background: #fff;
  padding: 24px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;
const FlashText = styled.p`
  font-size: 18px;
  margin-bottom: 12px;
`;
const GradeButton = styled.button`
  padding: 8px 12px;
  margin: 4px;
  border: none;
  border-radius: 6px;
  background-color: #0066ff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0050cc;
  }
`;
const Input = styled.input`
  width: 100%;
  margin: 8px 0;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
const Select = styled.select`
  width: 100%;
  margin: 8px 0;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;
const Button = styled.button`
  background-color: #28a745;
  color: white;
  padding: 8px 16px;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

// FlashcardView
const FlashcardView = ({ flashcard }: { flashcard: Flashcard }) => {
  const [showBack, setShowBack] = useState(false);

  return (
    <Card>
      <FlashText>
        <strong>Frente:</strong> {flashcard.front}
      </FlashText>
      {showBack && (
        <FlashText>
          <strong>Verso:</strong> {flashcard.back}
        </FlashText>
      )}
      {!showBack && (
        <GradeButton onClick={() => setShowBack(true)}>
          Mostrar Resposta
        </GradeButton>
      )}
      {flashcard.tags?.length > 0 && (
        <p>
          <strong>Tags:</strong>{" "}
          {flashcard.tags
            .map((tag) => (typeof tag === "object" ? tag.name : tag))
            .join(", ")}
        </p>
      )}
    </Card>
  );
};

export function Profissional() {
  const { user } = useAuth();
  const token = localStorage.getItem("authenticacao");

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCardId, setSelectedCardId] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [amount, setAmount] = useState("3");

  const [tagList, setTagList] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const loadFlashcards = async () => {
    try {
      const res = await axios.get("http://localhost:3000/flashcards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlashcards(res.data.data);
    } catch (err) {
      console.error("Erro ao carregar flashcards", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCards = async () => {
    try {
      const res = await axios.get("http://localhost:3000/cards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards(res.data.data);
    } catch (err) {
      console.error("Erro ao carregar cards do usuário", err);
    }
  };

  const loadTags = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTagList(
        res.data.tags.map((tag: Tag) => ({ _id: tag._id, name: tag.name }))
      );
    } catch (err) {
      console.error("Erro ao carregar tags", err);
    }
  };

  const createTag = async () => {
    if (!newTag.trim()) return alert("Digite um nome para a tag.");
    try {
      await axios.post(
        "http://localhost:3000/tags",
        { name: newTag.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Tag criada com sucesso.");
      setNewTag("");
      loadTags();
    } catch (err: any) {
      console.error("Erro ao criar tag", err);
      alert(
        "Erro ao criar tag: " +
          (err.response?.data?.message || "Erro desconhecido")
      );
    }
  };

  const createFlashcard = async () => {
    if (!selectedCardId || front.trim().length < 1 || back.trim().length < 1) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (selectedTags.length === 0) {
      alert("Selecione pelo menos uma tag.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/flashcards",
        {
          cardId: selectedCardId,
          front,
          back,
          tags: selectedTags,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Flashcard criado com sucesso");
      setFront("");
      setBack("");
      setSelectedTags([]);
      loadFlashcards();
    } catch (err: any) {
      console.error("Erro ao criar flashcard", err);
      alert(
        "Erro ao criar flashcard: " +
          (err.response?.data?.message || "Erro desconhecido")
      );
    }
  };

  const createFlashcardWithAI = async () => {
    if (!selectedCardId) {
      alert("Selecione um card válido.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3000/flashcards/withAI/${selectedCardId}`,
        { amount: parseInt(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Flashcards com IA gerados com sucesso");
      setAmount("3");
      loadFlashcards();
    } catch (err) {
      console.error("Erro ao gerar flashcards por IA", err);
      alert("Erro ao gerar flashcards por IA");
    }
  };

  const handleGrade = async (grade: number) => {
    const current = flashcards[currentIndex];
    try {
      await axios.patch(
        `http://localhost:3000/flashcards/doreview/${current._id}`,
        { grade },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowBack(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Erro ao avaliar", err);
    }
  };

  useEffect(() => {
    if (token && user) {
      loadFlashcards();
      loadCards();
      loadTags();
    }
  }, [token, user]);

  if (isLoading)
    return (
      <Container>
        <p>Carregando flashcards...</p>
      </Container>
    );

  const current = flashcards[currentIndex];

  return (
    <Container>
      <Header />

      <Card>
        <h3>Criar Flashcard Manual</h3>
        <Select
          value={selectedCardId}
          onChange={(e) => setSelectedCardId(e.target.value)}
        >
          <option value="">Selecione um card</option>
          {cards.map((card) => (
            <option key={card._id} value={card._id}>
              {card.title}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Frente"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <Input
          placeholder="Verso"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <Select
          multiple
          value={selectedTags}
          onChange={(e) =>
            setSelectedTags(
              Array.from(e.target.selectedOptions).map((opt) => opt.value)
            )
          }
        >
          {tagList.length === 0 ? (
            <option disabled>Nenhuma tag cadastrada</option>
          ) : (
            tagList.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))
          )}
        </Select>
        <Button onClick={createFlashcard}>Criar Flashcard</Button>
      </Card>

      <Card>
        <h3>Criar nova Tag</h3>
        <Input
          placeholder="Nome da tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <Button onClick={createTag}>Criar Tag</Button>
      </Card>

      <Card>
        <h3>Gerar Flashcards com IA</h3>
        <Select
          value={selectedCardId}
          onChange={(e) => setSelectedCardId(e.target.value)}
        >
          <option value="">Selecione um card</option>
          {cards.map((card) => (
            <option key={card._id} value={card._id}>
              {card.title}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Quantidade"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={createFlashcardWithAI}>Gerar com IA</Button>
      </Card>

      {flashcards.length === 0 ? (
        <p>Você ainda não possui flashcards.</p>
      ) : currentIndex >= flashcards.length ? (
        <p>Parabéns! Você revisou todos os flashcards.</p>
      ) : (
        <Card>
          <FlashText>
            <strong>Frente:</strong> {current.front}
          </FlashText>
          {showBack && (
            <FlashText>
              <strong>Verso:</strong> {current.back}
            </FlashText>
          )}
          {!showBack ? (
            <GradeButton onClick={() => setShowBack(true)}>
              Mostrar Resposta
            </GradeButton>
          ) : (
            <div>
              <p>Como você se saiu? (0 a 5)</p>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <GradeButton key={n} onClick={() => handleGrade(n)}>
                  {n}
                </GradeButton>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card>
        <h3>Todos os seus Flashcards</h3>
        {flashcards.map((fc) => (
          <FlashcardView key={fc._id} flashcard={fc} />
        ))}
      </Card>
    </Container>
  );
}
