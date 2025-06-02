import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../../Components/Header";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled from "styled-components";
import { LoadingScreen } from "../../Components/LoadingScreen";

// ESTILOS
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const Banner = styled.div`
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  border-radius: 8px;
  position: relative;
`;

const PerfilBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: -50px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  margin-left: 30px;
`;

const UserInfo = styled.div`
  margin-left: 20px;
`;

const UserName = styled.h2`
  margin-top: 50px;
  font-size: 24px;
`;

const InfoSection = styled.div`
  margin-top: 40px;
  background-color: white;
  border-radius: 10px;
`;

const InfoTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 20px;
  padding: 20px 20px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const InfoBox = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
`;

const Label = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0 0 4px;
`;

const Value = styled.p`
  font-size: 16px;
  margin: 0;
  font-weight: 500;
`;

export function PerfilBusca() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [erro, setErro] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  usePageLoading(isDataLoading);

  useEffect(() => {
    async function buscarUsuario() {
      setIsDataLoading(true);
      try {
        if (!id) return;

        const response = await axios.get(`http://localhost:3000/users/${id}`);
        setUsuario(response.data.data);

        const listasResponse = await axios.get(
          `http://localhost:3000/lists/${id}/lists`
        );
        const listas = listasResponse.data.data;

        const todosCards: any[] = [];
        for (const lista of listas) {
          const cardsResponse = await axios.get(
            `http://localhost:3000/cards/list/${lista.id}`
          );
          todosCards.push(...cardsResponse.data.data);
        }

        setCards(todosCards);
        setErro("");
      } catch (error) {
        console.error(error);
        setErro("Usuário não encontrado ou erro na busca.");
      } finally {
        setIsDataLoading(false);
      }
    }

    buscarUsuario();
  }, [id]);

  if (erro) {
    return (
      <div>
        <h1>{erro}</h1>
      </div>
    );
  }

  if (!usuario) {
    return (
      <LoadingScreen isVisible={true} />
    );
  }

  return (
    <>
      <Header />
      <Container>
        <Banner />
        <PerfilBox>
          <Avatar>FOTO</Avatar>
          <UserInfo>
            <UserName>{usuario.name}</UserName>
          </UserInfo>
        </PerfilBox>

        <InfoSection>
          <InfoTitle>Informações Pessoais</InfoTitle>
          <InfoGrid>
            <InfoBox>
              <Label>Nickname</Label>
              <Value>{usuario.coduser}</Value>
            </InfoBox>
            <InfoBox>
              <Label>Email</Label>
              <Value>{usuario.email}</Value>
            </InfoBox>
            <InfoBox>
              <Label>Data de Nascimento</Label>
              <Value>
                {new Date(usuario.dateOfBirth).toLocaleDateString()}
              </Value>
            </InfoBox>
          </InfoGrid>
        </InfoSection>

        <InfoSection>
          <InfoTitle>Cards Criados</InfoTitle>
          <InfoGrid>
            {cards.length > 0 ? (
              cards.map((card) => (
                <InfoBox key={card._id}>
                  <Value>{card.title}</Value>
                </InfoBox>
              ))
            ) : (
              <InfoBox>
                <Value>Nenhum card encontrado.</Value>
              </InfoBox>
            )}
          </InfoGrid>
        </InfoSection>
      </Container>
    </>
  );
}
