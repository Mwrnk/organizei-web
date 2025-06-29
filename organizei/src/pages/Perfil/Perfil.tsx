import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled from "styled-components";
import { Link } from "react-router-dom";
import config from "../../../assets/Settings.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingScreen } from "../../Components/LoadingScreen";
import { toast } from "react-toastify";

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;



const PerfilBox = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 24px;
  border-radius: 10px;
  gap: 28px;
`;

const PerfilHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  width: 100%;
  margin-top: 32px;
`;

const PerfilName = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  text-transform: none;
  color: #111;
`;

const PerfilPontos = styled.div`
  color: #222;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.5px;
`;

const PerfilPlano = styled.div<{ plano?: string }>`
  background: ${({ plano }) =>
    plano === 'Gratuito' || plano === 'Free' ? '#007bff' : '#764ba2'};
  color: white;
  border-radius: 20px;
  padding: 6px 22px;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-left: 12px;
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
  overflow: hidden;
  cursor: pointer;
`;



const InfoSection = styled.div`
  margin-top: 16px;
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
  width: 36px;
  height: 36px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
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
  const { user, isLoading, logout, setUser } = useAuth();
  const [planoAtual, setPlanoAtual] = useState<Plano | null>(null);
  const [image, setImage] = useState<string | null>(user?.profileImage || null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  usePageLoading(isDataLoading || isLoading);

  // Atualiza os pontos do usuário periodicamente
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!user?._id) return;
      
      const token = localStorage.getItem("authenticacao");
      if (!token) return;

      try {
        const res = await axios.get(`http://localhost:3000/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Atualiza o usuário se houver qualquer mudança nos dados
        if (res.data.data && user) {
          const newUserData = res.data.data;
          if (
            newUserData.orgPoints !== user?.orgPoints ||
            newUserData.name !== user?.name ||
            newUserData.email !== user?.email
          ) {
            setUser(newUserData);
          }
        }
      } catch (err) {
        console.error("Erro ao atualizar dados do usuário", err);
      }
    };

    // Faz a primeira verificação imediatamente
    fetchUserPoints();

    // Depois verifica a cada 3 segundos
    const interval = setInterval(fetchUserPoints, 3000);

    return () => clearInterval(interval);
  }, [user, setUser]);

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

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`http://localhost:3000/users/${user._id}/stats`);
        setStats(res.data.data.stats);
      } catch (err) {
        setStats(null);
      }
    };
    fetchStats();
  }, [user?._id]);

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

      const newImageUrl = response.data.data.profileImage;
      setImage(newImageUrl);
      
      // Atualiza o estado global do usuário
      if (user) {
        setUser({
          ...user,
          profileImage: newImageUrl
        });
      }
    } catch (err) {
      console.error("Erro ao enviar imagem", err);
      toast.error("Erro ao atualizar imagem de perfil");
    }
  };

  if (isLoading) return <LoadingScreen isVisible={true} />;
  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <>
      <Header />
      <Container>
        <PerfilBox>
          <label htmlFor="upload-photo" style={{ margin: 0 }}>
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
          <PerfilHeaderInfo>
            <PerfilName>{user.name}</PerfilName>
            <PerfilPontos>
              <span style={{ fontSize: '1.2em', marginRight: 4 }}>⚡</span>
              +{(user.orgPoints || 0).toLocaleString()}pts
            </PerfilPontos>
            {planoAtual && (
              <PerfilPlano plano={planoAtual.price === 0 ? 'Free' : planoAtual.name}>
                {planoAtual.price === 0 ? 'Free' : planoAtual.name}
              </PerfilPlano>
            )}
          </PerfilHeaderInfo>
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
              <Label>Nickname</Label>
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

        {/* <EstatisticasSection>
          <EstatisticasTitle>Estatísticas</EstatisticasTitle>
          <EstatisticasGrid>
            <EstatisticaBox>
              <EstatisticaValor>{stats ? stats.totalLikes : '--'}</EstatisticaValor>
              <EstatisticaLabel>Total de Curtidas Recebidas</EstatisticaLabel>
            </EstatisticaBox>
            <EstatisticaBox>
              <EstatisticaValor>{stats ? stats.totalDownloads : '--'}</EstatisticaValor>
              <EstatisticaLabel>Downloads dos Meus Cards</EstatisticaLabel>
            </EstatisticaBox>
            <EstatisticaBox>
              <EstatisticaValor>{stats ? stats.orgPoints : (user.orgPoints || 0)}</EstatisticaValor>
              <EstatisticaLabel>Meus Pontos</EstatisticaLabel>
            </EstatisticaBox>
          </EstatisticasGrid>
        </EstatisticasSection> */}
      </Container>
    </>
  );
}
