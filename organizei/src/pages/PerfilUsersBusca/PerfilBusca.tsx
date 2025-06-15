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

const PerfilBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
  background-color: white;
  border-radius: 12px;
  padding: 20px 0px;  
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

const DEFAULT_PROFILE_IMAGE = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

export function PerfilBusca() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<any>(null);
  const [erro, setErro] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  usePageLoading(isDataLoading);

  useEffect(() => {
    async function buscarUsuario() {
      setIsDataLoading(true);
      try {
        if (!id) {
          setErro("ID do usuário não fornecido");
          return;
        }

        // Validar formato do ID (24 caracteres hexadecimais)
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          setErro("ID do usuário inválido");
          return;
        }

        const token = localStorage.getItem("authenticacao");
        if (!token) {
          setErro("Você precisa estar logado para visualizar este perfil");
          return;
        }

        // Buscar dados do usuário com token de autorização
        const response = await axios.get(
          `http://localhost:3000/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.data?.data) {
          throw new Error("Dados do usuário não encontrados");
        }

        setUsuario(response.data.data);
        setErro("");
      } catch (error: any) {
        console.error("Erro ao buscar usuário:", error);
        
        // Tratamento específico de erros
        if (error.response) {
          if (error.response.status === 404) {
            setErro("Usuário não encontrado");
          } else if (error.response.status === 401) {
            setErro("Você precisa estar logado para visualizar este perfil");
          } else if (error.response.status === 403) {
            setErro("Você não tem permissão para visualizar este perfil");
          } else {
            setErro(error.response.data?.message || "Erro ao buscar usuário");
          }
        } else if (error.request) {
          setErro("Erro de conexão. Verifique sua internet e tente novamente.");
        } else {
          setErro(error.message || "Erro ao buscar usuário");
        }
      } finally {
        setIsDataLoading(false);
      }
    }

    buscarUsuario();
  }, [id]);

  if (erro) {
    return (
      <>
        <Header />
        <Container>
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            background: '#fff', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>❌ Erro</h2>
            <p style={{ fontSize: '18px', color: '#666' }}>{erro}</p>
          </div>
        </Container>
      </>
    );
  }

  if (!usuario) {
    return <LoadingScreen isVisible={true} />;
  }

  return (
    <>
      <Header />
      <Container>
        <PerfilBox>
          <Avatar>
            {usuario.profileImage ? (
              <img
                src={usuario.profileImage || DEFAULT_PROFILE_IMAGE}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
            ) : (
              "👤"
            )}
          </Avatar>
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
            {usuario.dateOfBirth && (
              <InfoBox>
                <Label>Data de Nascimento</Label>
                <Value>
                  {new Date(usuario.dateOfBirth).toLocaleDateString()}
                </Value>
              </InfoBox>
            )}
            {usuario.bio && (
              <InfoBox>
                <Label>Bio</Label>
                <Value>{usuario.bio}</Value>
              </InfoBox>
            )}
          </InfoGrid>
        </InfoSection>
      </Container>
    </>
  );
}
