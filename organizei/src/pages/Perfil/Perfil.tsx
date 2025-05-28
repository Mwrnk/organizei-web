import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled from "styled-components";
import { Link } from "react-router-dom";
import config from "../../../assets/Settings.svg";
import { useEffect, useState } from "react";
import axios from "axios";

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
  z-index: -1;
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
  overflow: hidden;
  cursor: pointer;
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

const PontosBox = styled(InfoBox)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  
  ${Label} {
    color: rgba(255, 255, 255, 0.9);
  }
  
  ${Value} {
    color: white;
    font-weight: 700;
    font-size: 18px;
  }
`;

type Plano = {
  name: string;
  price: number;
};

export function Perfil() {
  const { user, isLoading, logout } = useAuth();
  const [planoAtual, setPlanoAtual] = useState<Plano | null>(null);
  const [image, setImage] = useState<string | null>(user?.profileImage || null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  usePageLoading(isDataLoading || isLoading);

  useEffect(() => {
    const fetchPlano = async () => {
      if (!user?._id) return;

      setIsDataLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/users/${user._id}/plan`
        );
        setPlanoAtual(res.data.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setPlanoAtual(null);
        } else {
          console.error("Erro ao buscar plano atual do usuário", err);
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchPlano();
  }, [user?._id]);

  useEffect(() => {
    if (user?.profileImage) {
      setImage(user.profileImage);
    }
  }, [user?.profileImage]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    try {
      const base64 = await convertToBase64(file);

      const response = await axios.patch(
        `http://localhost:3000/users/${user._id}/image`,
        {
          image: base64,
        }
      );

      setImage(response.data.data.profileImage); // Atualiza preview com base no retorno da API
    } catch (err) {
      console.error("Erro ao enviar imagem", err);
    }
  };

  if (isLoading) return <p>Carregando perfil...</p>;
  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <>
      <Header />
      <Container>
        <Banner />
        <PerfilBox>
          <label htmlFor="upload-photo">
            <Avatar>
              {image ? (
                <img
                  src={image}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "FOTO"
              )}
            </Avatar>
          </label>
          <input
            type="file"
            id="upload-photo"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
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
            <PontosBox>
              <Label>Pontos</Label>
              <Value>
                ⚡ {(user.orgPoints || 0).toLocaleString()} pts
              </Value>
            </PontosBox>
            {planoAtual && (
              <>
                <InfoBox>
                  <Label>Plano Atual</Label>
                  <Value>{planoAtual.name}</Value>
                </InfoBox>
                <InfoBox>
                  <Label>Valor</Label>
                  <Value>
                    {planoAtual.price === 0
                      ? "Gratuito"
                      : `R$ ${planoAtual.price}`}
                  </Value>
                </InfoBox>
              </>
            )}
          </InfoGrid>

          <BotaoSair onClick={logout}>Sair</BotaoSair>
        </InfoSection>
      </Container>
    </>
  );
}
