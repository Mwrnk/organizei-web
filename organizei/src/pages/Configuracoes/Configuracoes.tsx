import { useState } from 'react';
import { Header } from '../../Components/Header';
import { useAuth } from '../../Contexts/AuthContexts';
import styled from 'styled-components';
import { toast } from 'react-toastify';

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
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  input {
    margin-right: 10px;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  }

  span:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: #3498db;
  }

  input:checked + span:before {
    transform: translateX(26px);
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

export function Configuracoes() {
  const { user, logout } = useAuth();
  
  // Configurações de perfil
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Configurações de notificações
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesPush, setNotificacoesPush] = useState(true);
  const [notificacoesLembretes, setNotificacoesLembretes] = useState(true);
  const [notificacoesAtualizacoes, setNotificacoesAtualizacoes] = useState(false);
  
  // Configurações de aparência
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState('medio');
  
  // Configurações de segurança
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const handleSalvarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a chamada à API para atualizar o perfil
    toast.success('Perfil atualizado com sucesso!');
  };
  
  const handleSalvarNotificacoes = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a chamada à API para salvar as preferências de notificações
    toast.success('Preferências de notificações salvas!');
  };
  
  const handleSalvarAparencia = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a chamada à API para salvar as preferências de aparência
    toast.success('Preferências de aparência salvas!');
  };
  
  const handleAlterarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem!');
      return;
    }
    
    // Aqui você implementaria a chamada à API para alterar a senha
    toast.success('Senha alterada com sucesso!');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
  };
  
  const handleExcluirConta = () => {
    const confirmar = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    
    if (confirmar) {
      // Aqui você implementaria a chamada à API para excluir a conta
      toast.success('Conta excluída com sucesso!');
      logout();
    }
  };
  
  return (
    <>
      <Header />
      <ConfiguracoesContainer>
        <SettingsTitle>Configurações</SettingsTitle>
        
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
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </FormGroup>
            <Button type="submit">Salvar alterações</Button>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <h3>Notificações</h3>
          </CardHeader>
          <form onSubmit={handleSalvarNotificacoes}>
            <Checkbox>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={notificacoesEmail} 
                  onChange={() => setNotificacoesEmail(!notificacoesEmail)} 
                />
                <span></span>
              </ToggleSwitch>
              <Label>Receber notificações por email</Label>
            </Checkbox>
            <Checkbox>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={notificacoesPush} 
                  onChange={() => setNotificacoesPush(!notificacoesPush)} 
                />
                <span></span>
              </ToggleSwitch>
              <Label>Receber notificações push</Label>
            </Checkbox>
            <Checkbox>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={notificacoesLembretes} 
                  onChange={() => setNotificacoesLembretes(!notificacoesLembretes)} 
                />
                <span></span>
              </ToggleSwitch>
              <Label>Lembretes de tarefas próximas</Label>
            </Checkbox>
            <Checkbox>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={notificacoesAtualizacoes} 
                  onChange={() => setNotificacoesAtualizacoes(!notificacoesAtualizacoes)} 
                />
                <span></span>
              </ToggleSwitch>
              <Label>Atualizações e novidades</Label>
            </Checkbox>
            <Button type="submit">Salvar preferências</Button>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <h3>Aparência</h3>
          </CardHeader>
          <form onSubmit={handleSalvarAparencia}>
            <Checkbox>
              <ToggleSwitch>
                <input 
                  type="checkbox" 
                  checked={temaEscuro} 
                  onChange={() => setTemaEscuro(!temaEscuro)} 
                />
                <span></span>
              </ToggleSwitch>
              <Label>Tema escuro</Label>
            </Checkbox>
            <FormGroup>
              <Label>Tamanho da fonte</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label>
                  <input 
                    type="radio" 
                    name="tamanhoFonte" 
                    value="pequeno" 
                    checked={tamanhoFonte === 'pequeno'} 
                    onChange={() => setTamanhoFonte('pequeno')} 
                  /> Pequeno
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="tamanhoFonte" 
                    value="medio" 
                    checked={tamanhoFonte === 'medio'} 
                    onChange={() => setTamanhoFonte('medio')} 
                  /> Médio
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="tamanhoFonte" 
                    value="grande" 
                    checked={tamanhoFonte === 'grande'} 
                    onChange={() => setTamanhoFonte('grande')} 
                  /> Grande
                </label>
              </div>
            </FormGroup>
            <Button type="submit">Salvar preferências</Button>
          </form>
        </Card>
        
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
        
        <Card>
          <CardHeader>
            <h3>Excluir conta</h3>
          </CardHeader>
          <p style={{ marginBottom: '20px' }}>
            Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
          </p>
          <DangerButton onClick={handleExcluirConta}>
            Excluir minha conta
          </DangerButton>
        </Card>
      </ConfiguracoesContainer>
    </>
  );
} 
