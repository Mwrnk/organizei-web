import { useState } from "react";
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

export function Login() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [etapa, setEtapa] = useState(1);
  const [coduser, setCoduser] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const { login: authLogin } = useAuth();

  const onClickBotaoLogin = () => setLogin(true);
  const onClickBotaoRegistrar = () => {
    setLogin(false);
    setEtapa(1);
  };

  const logar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await authLogin(email, password);
    } catch (error) {
      console.error("Falha no login");
    }
  };

  const registrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        coduser,
        name,
        dateOfBirth,
        email,
        password,
      });

      console.log("Usuário registrado com sucesso:", response.data);
      toast.success("Registro realizado com sucesso!");
      setLogin(true);
      limparCampos(); 
    } catch (error: any) {
      console.error(
        "Erro ao registrar:",
        error.response?.data || error.message
      );
      toast.error("Erro no registro");
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
                      proximaEtapa();
                    }
              }
            >
              {etapa === 1 && (
                <>
                  <InputLogin
                    type="text"
                    placeholder="Nickname"
                    value={coduser}
                    onChange={(e) => setCoduser(e.target.value)}
                    required
                  />
                  <BotaoEntrar type="submit">Próximo</BotaoEntrar>
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
