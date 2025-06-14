import { useState, useEffect } from "react";
import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from '../../Contexts/ThemeContext';
import styles from './Configuracoes.module.css';
import { useNavigate } from "react-router-dom";

const ConfiguracoesContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const CardHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
  h3 {
    margin: 0;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;




const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2980b9;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  background-color: #e74c3c;
  &:hover {
    background-color: #c0392b;
  }
`;

const SettingsTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

// --- Função para corrigir a data no input ---
const formatDateInput = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  const timezoneOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - timezoneOffset).toISOString().split("T")[0];
};

export function Configuracoes() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");

  usePageLoading(isLoading);



  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const { theme, toggleTheme } = useTheme();

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!user?._id) {
        toast.error("Usuário não encontrado.");
        return;
      }

      const dadosDoUsuario = {
        name,
        dateOfBirth,
      };

      const response = await axios.patch(
        `http://localhost:3000/users/${user._id}`,
        dadosDoUsuario
      );

      toast.success("Perfil atualizado com sucesso!");

      // Corrigido para não perder o _id e dados anteriores
      setUser((prev) => ({
        ...prev,
        ...response.data.data,
      }));
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    setIsLoading(true);
    
    // Simular delay de alteração de senha
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setIsLoading(false);
  };

  const handleExcluirConta = () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    );
    if (confirmar) {
      toast.success("Conta excluída com sucesso!");
      logout();
    }
  };

  return (
    <>
      <Header />
      <ConfiguracoesContainer>
        <SettingsTitle>Configurações</SettingsTitle>

       

        {/* === BLOCO PERFIL === */}
        <Card>
          <CardHeader>
            <h3>Perfil</h3>
          </CardHeader>
          <form onSubmit={handleSalvarPerfil}>
            <FormGroup>
              <Label>Nome</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" value={email} disabled />
            </FormGroup>
            <FormGroup>
              <Label>Data de Nascimento</Label>
              <Input
                type="date"
                value={formatDateInput(dateOfBirth)}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </FormGroup>
            <Button type="submit">Salvar alterações</Button>
          </form>
        </Card>

      
        
        {/* === BLOCO TUTORIAL === */}
        <Card>
          <CardHeader>
            <h3>Tutorial</h3>
          </CardHeader>
          <p style={{ marginBottom: '20px' }}>
            Gerencie a exibição do tutorial da página Escolar.
          </p>
          <Button
            onClick={() => {
              localStorage.removeItem('tutorialDisabled');
              toast.success('Tutorial reabilitado com sucesso!');
            }}
            style={{ backgroundColor: '#4CAF50' }}
          >
            Reabilitar Tutorial
          </Button>
        </Card>

        {/* === BLOCO ALTERAR SENHA === */}
        <Card>
          <CardHeader>
            <h3>Alterar senha</h3>
          </CardHeader>
          <form onSubmit={handleAlterarSenha}>
            <FormGroup>
              <Label>Senha atual</Label>
              <Input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Nova senha</Label>
              <Input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Confirmar nova senha</Label>
              <Input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </FormGroup>
            <Button
              type="submit"
              disabled={!senhaAtual || !novaSenha || !confirmarSenha}
            >
              Alterar senha
            </Button>
          </form>
        </Card>
         {/* === BLOCO SOBRE NÓS === */}
         <Card>
          <CardHeader>
            <h3>Sobre Nós</h3>
          </CardHeader>
          <p style={{ marginBottom: '20px' }}>
            Conheça mais sobre nossa história, missão e valores.
          </p>
          <Button
            onClick={() => navigate("/sobre-nos")}
            style={{ backgroundColor: '#2196f3' }}
          >
            Acessar Sobre Nós
          </Button>
        </Card>

        <div className={styles.section}>
          <h2>Tema</h2>
          <div className={styles.themeToggle}>
            <label>
              <span>Tema {theme === 'light' ? 'Claro' : 'Escuro'}</span>
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            </label>
          </div>
        </div>

        {/* === BLOCO EXCLUIR CONTA === */}
        <Card>
          <CardHeader>
            <h3>Excluir conta</h3>
          </CardHeader>
          <p>
            Esta ação não pode ser desfeita. Todos os seus dados serão
            permanentemente removidos.
          </p>
          <DangerButton onClick={handleExcluirConta}>
            Excluir minha conta
          </DangerButton>
        </Card>
      </ConfiguracoesContainer>
    </>
  );
}
