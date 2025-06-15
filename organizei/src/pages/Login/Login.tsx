import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Teste,
  FormLogin,
  TituloApp,
  Formulario,
  InputSenha,
  InputLogin,
  BotaoEntrar,
  Titulo2,
  DivBotao,
  Button,
  BotaoVoltar,
} from "../../Style/StyledLogin";
import { toast } from "react-toastify";
import seta from "../../../assets/setaEsquerda.svg";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled from "styled-components";

const NicknameInput = styled(InputLogin)<{ status?: 'checking' | 'available' | 'unavailable' }>`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ status }) => 
      status === 'checking' ? '#FFA500' :
      status === 'available' ? '#4CAF50' :
      status === 'unavailable' ? '#F44336' :
      'transparent'
    };
  }
`;

const NicknameStatus = styled.div<{ status?: 'checking' | 'available' | 'unavailable' }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ status }) => 
    status === 'checking' ? '#FFA500' :
    status === 'available' ? '#4CAF50' :
    status === 'unavailable' ? '#F44336' :
    'transparent'
  };
`;

export function Login() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<'checking' | 'available' | 'unavailable' | undefined>(undefined);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const [etapa, setEtapa] = useState(1);
  const [coduser, setCoduser] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const { login: authLogin } = useAuth();
  
  usePageLoading(isLoading);

  // Debounced nickname check
  const checkNickname = useCallback(async (nickname: string) => {
    if (!nickname || nickname.length < 3) {
      setNicknameStatus(undefined);
      return;
    }

    setIsCheckingNickname(true);
    setNicknameStatus('checking');

    try {
      const response = await axios.get(`http://localhost:3000/users/check-nickname?coduser=${encodeURIComponent(nickname)}`);
      // The backend sends { available: boolean, message: string }
      setNicknameStatus(response.data.available ? 'available' : 'unavailable');
    } catch (error: any) {
      // If there's an error, we'll show the error message from the backend if available
      const errorMessage = error.response?.data?.message || 'Erro ao verificar nickname';
      setNicknameStatus('unavailable');
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsCheckingNickname(false);
    }
  }, []);

  // Debounce effect for nickname checking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (coduser) {
        checkNickname(coduser);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [coduser, checkNickname]);

  const onClickBotaoLogin = () => setLogin(true);
  const onClickBotaoRegistrar = () => {
    setLogin(false);
    setEtapa(1);
  };

  const logar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authLogin(email, password);
    } catch (error) {
      console.error("Falha no login");
    } finally {
      setIsLoading(false);
    }
  };

  const registrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (nicknameStatus === 'unavailable') {
      toast.error('Este nickname já está em uso. Por favor, escolha outro.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        coduser,
        name,
        dateOfBirth,
        email,
        password,
      });

      console.log("Usuário registrado com sucesso:", response.data);
      toast.success("Registro realizado com sucesso! Faça login para continuar.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLogin(true);
      limparCampos();
    } catch (error: any) {
      console.error(
        "Erro ao registrar:",
        error.response?.data || error.message
      );
      
      // Handle specific error messages from the backend
      const errorMessage = error.response?.data?.message || '';
      
      if (errorMessage.includes('coduser already exists')) {
        toast.error('Este código de usuário já está em uso. Por favor, escolha outro.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (errorMessage.includes('email already exists')) {
        toast.error('Este e-mail já está cadastrado. Use outro e-mail ou faça login.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (errorMessage.includes('password')) {
        toast.error('A senha não atende aos requisitos mínimos de segurança.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (errorMessage.includes('date')) {
        toast.error('Data de nascimento inválida.', {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error('Erro no registro. Por favor, verifique os dados e tente novamente.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const limparCampos = () => {
    setCoduser("");
    setName("");
    setEmail("");
    setPassword("");
    setDateOfBirth("");
  };

  const etapaAnterior = () => {
    setEtapa(etapa - 1);
  };

  const proximaEtapa = () => {
    setEtapa(etapa + 1);
  };

  return (
    <div>
      <Teste>
        <TituloApp>Organiz.ei</TituloApp>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          {!login && etapa > 1 && (
            <BotaoVoltar type="button" onClick={etapaAnterior}>
              <img src={seta} alt="Voltar" />
            </BotaoVoltar>
          )}
          <Titulo2>
            {login ? "Bem-vindo de volta!" : "Bem-vindo novato!"}
          </Titulo2>
        </div>

        <DivBotao>
          <Button data-active={login} onClick={onClickBotaoLogin}>
            Entrar
          </Button>
          <Button data-active={!login} onClick={onClickBotaoRegistrar}>
            Registrar
          </Button>
        </DivBotao>

        <FormLogin>
          {login ? (
            <Formulario onSubmit={logar}>
              <InputLogin
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <InputSenha
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
              />
              <BotaoEntrar type="submit">Entrar</BotaoEntrar>
            </Formulario>
          ) : (
            <Formulario
              onSubmit={
                etapa === 2
                  ? registrar
                  : (e) => {
                      e.preventDefault();
                      if (nicknameStatus === 'available') {
                        proximaEtapa();
                      } else {
                        toast.error('Por favor, escolha um nickname disponível antes de continuar.', {
                          position: "top-right",
                          autoClose: 5000,
                        });
                      }
                    }
              }
            >
              {etapa === 1 && (
                <>
                  <NicknameInput
                    type="text"
                    placeholder="Nickname"
                    value={coduser}
                    onChange={(e) => setCoduser(e.target.value)}
                    required
                    status={nicknameStatus}
                  />
                  <NicknameStatus status={nicknameStatus}>
                    {nicknameStatus === 'checking' && 'Verificando disponibilidade...'}
                    {nicknameStatus === 'available' && 'Nickname disponível!'}
                    {nicknameStatus === 'unavailable' && 'Este nickname já está em uso'}
                  </NicknameStatus>
                  <BotaoEntrar 
                    type="submit"
                    disabled={nicknameStatus !== 'available'}
                    style={{ 
                      opacity: nicknameStatus === 'available' ? 1 : 0.7,
                      cursor: nicknameStatus === 'available' ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Próximo
                  </BotaoEntrar>
                </>
              )}

              {etapa === 2 && (
                <>
                  <InputLogin
                    type="text"
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <InputLogin
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <InputSenha
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <InputLogin
                    type="date"
                    placeholder="Data de nascimento"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                  <BotaoEntrar type="submit">Registrar</BotaoEntrar>
                </>
              )}
            </Formulario>
          )}
        </FormLogin>
      </Teste>
    </div>
  );
}
