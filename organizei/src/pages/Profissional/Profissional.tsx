import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import styled from "styled-components";

// --- Styled Components ---

const Container = styled.div`
  padding: 24px;
`;

const Subtitle = styled.p`
  color: #555;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const ControlsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ButtonPrimary = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
`;

const Pagination = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: ${({ active }) => (active ? "#007bff" : "#eee")};
  color: ${({ active }) => (active ? "white" : "#333")};
  cursor: pointer;
  font-weight: 500;
`;

const Grid = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const ListColumn = styled.div`
  min-width: 220px;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
`;

const CardArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  background-color: white;
  border: 1.5px dashed #bbb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 12px;
`;

const ButtonGroup = styled.div`
  margin-top: 16px;

  button {
    padding: 8px 16px;
    margin: 0 4px;
    border-radius: 6px;
    cursor: pointer;
  }

  .confirm {
    background: #007bff;
    color: white;
    border: none;
  }

  .cancel {
    background: #ccc;
    border: none;
  }
`;

// --- Types ---

type List = {
  _id: string;
  name: string;
  userId: string;
};

// --- Componente Escolar ---

export function Profissional() {
  const { user } = useAuth();
  const userId = user?._id;

  const [listName, setListName] = useState("");
  const [lists, setLists] = useState<List[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const porPagina = 5;
  const totalPaginas = Math.ceil(lists.length / porPagina);
  const listasVisiveis = lists.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  useEffect(() => {
    const fetchLists = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/lists/${userId}/lists`
        );
        setLists(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar listas", error);
      }
    };

    fetchLists();
  }, [userId]);

  const handleCreateList = async () => {
    const trimmedName = listName.trim();

    if (!userId || !trimmedName) return;

    try {
      const response = await axios.post("http://localhost:3000/lists", {
        name: trimmedName,
        userId,
      });

      setLists((prev) => [...prev, response.data.data]);
      setListName("");
      setShowModal(false);
      setPaginaAtual(1);
    } catch (error) {
      console.error("Erro ao criar lista", error);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <div>
          <Subtitle>#profisional</Subtitle>
          <Title>A sua melhor organização profissional</Title>
          <ButtonPrimary onClick={() => setShowModal(true)}>
            + Criar nova lista
          </ButtonPrimary>
        </div>

        <ControlsWrapper>
          <Pagination>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <PageButton
                key={i + 1}
                active={paginaAtual === i + 1}
                onClick={() => setPaginaAtual(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
          </Pagination>
        </ControlsWrapper>

        <Grid>
          {listasVisiveis.map((list) => (
            <ListColumn key={list._id}>
              <ColumnTitle>{list.name}</ColumnTitle>
              <CardArea>
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>+</Card>
                ))}
              </CardArea>
            </ListColumn>
          ))}
        </Grid>
      </Container>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Nova Lista</h3>
            <Input
              type="text"
              placeholder="Nome da lista"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
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
    </>
  );
}
