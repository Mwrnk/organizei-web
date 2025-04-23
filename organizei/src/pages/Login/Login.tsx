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
import { useNavigate } from "react-router-dom";
import seta from "../../../assets/setaEsquerda.svg";

export function Login() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [etapa, setEtapa] = useState(1);
  const [coduser, setCoduser] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const navigate = useNavigate();

  const onClickBotaoLogin = () => setLogin(true);
  const onClickBotaoRegistrar = () => {
    setLogin(false);
    setEtapa(1);
  };

  const logar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const token = response.data.data.token;
      const id = response.data.data.user.id;

      if (token) {
        localStorage.setItem("authenticacao", token);
        localStorage.setItem("idUsuario", id);
        localStorage.setItem("email", email);

        toast.success("Login feito com sucesso!");
        console.log("Token e ID armazenados com sucesso:", token, id);
        navigate("/perfil");
      }
    } catch (error: any) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message
      );
      toast.error("Login ou senha incorretos");
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
    } catch (error: any) {
      console.error(
        "Erro ao registrar:",
        error.response?.data || error.message
      );
      toast.error("Erro no registro");
    }
  };

  const proximaEtapa = () => setEtapa(etapa + 1);
  const etapaAnterior = () => setEtapa(etapa - 1);

  return (
    <div>
      <Teste>
        <TituloApp>Organiz.ei</TituloApp>
        <Titulo2>{login ? "Bem-vindo de volta!" : "Bem-vindo novato!"}</Titulo2>

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
                etapa === 4
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
                  <BotaoVoltar type="button" onClick={etapaAnterior}>
                    <img src={seta} alt="seta para esquerda" />
                  </BotaoVoltar>
                  <BotaoEntrar type="submit">Próximo</BotaoEntrar>
                </>
              )}

              {etapa === 3 && (
                <>
                  <InputLogin
                    type="date"
                    placeholder="Data de nascimento"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                  <BotaoVoltar type="button" onClick={etapaAnterior}>
                    <img src={seta} alt="seta para esquerda" />
                  </BotaoVoltar>
                  <BotaoEntrar type="submit">Próximo</BotaoEntrar>
                </>
              )}

              {etapa === 4 && (
                <>
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
                  <BotaoVoltar type="button" onClick={etapaAnterior}>
                    <img src={seta} alt="seta para esquerda" />
                  </BotaoVoltar>
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
