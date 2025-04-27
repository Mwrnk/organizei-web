import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import styled from "styled-components";
import { Link } from "react-router-dom";
import config from "../../../assets/Settings.svg";

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
const BotaoSair = styled.button`
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  margin-top: 30px;
  cursor: pointer;
  margin: 10px;
  &:hover {
    background-color: black;
  }
`;
const Titulo_config = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

const IconConfig = styled.img`
  width: 20px;
  border: 2px solid #ccc;
  padding: 10px;
  border-radius: 15px;
  &:hover {
    background-color: #bbb;
  }
`;
export function Perfil() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <p>Carregando perfil...</p>;

  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <>
      <Header />
      <Container>
        <Banner />
        <PerfilBox>
          <Avatar>FOTO</Avatar>
          <UserInfo>
            <UserName>{user.name}</UserName>
          </UserInfo>
        </PerfilBox>

        <InfoSection>
          <Titulo_config>
            <InfoTitle>Informações Pessoais</InfoTitle>
            <Link
              to="/configuracoes"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconConfig src={config} alt="configuracoes" />
            </Link>
          </Titulo_config>

          <InfoGrid>
            <InfoBox>
              <Label>Código</Label>
              <Value>{user.coduser}</Value>
            </InfoBox>
            <InfoBox>
              <Label>Email</Label>
              <Value>{user.email}</Value>
            </InfoBox>
            <InfoBox>
              <Label>Data de Nascimento</Label>
              <Value>{new Date(user.dateOfBirth).toLocaleDateString()}</Value>
            </InfoBox>
          </InfoGrid>

          <BotaoSair onClick={logout}>Sair</BotaoSair>
        </InfoSection>
      </Container>
    </>
  );
}
