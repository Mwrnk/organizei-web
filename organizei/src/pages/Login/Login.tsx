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
} from "../../Style/StyledLogin";
import { toast } from "react-toastify";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [login, setLogin] = useState(true);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const onChangeSenha = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const onChangeNome = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const onClickBotaoLogin = () => setLogin(true);
  const onClickBotaoRegistrar = () => setLogin(false);

  const logar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const token = response.data.data.token;

      if (token) {
        localStorage.setItem("authenticacao", token);
        localStorage.setItem("email", email);
        console.log("Token armazenado com sucesso:", token);
        toast.success("login feito com sucesso ")
      }
    } catch (error:any) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message,
        toast.error("login ou senha incorretos ")
      );
    }
  };

  const registrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        name,
        email,
        password,
      });

      console.log("Usuário registrado com sucesso:", response.data);
      setLogin(true);
    } catch (error: any) {
      console.error(
        "Erro ao registrar:",
        error.response?.data || error.message
      );
    }
  };

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
          <Formulario onSubmit={login ? logar : registrar}>
            {!login && (
              <InputLogin
                type="text"
                value={name}
                onChange={onChangeNome}
                placeholder="Nome e Sobrenome"
                required
              />
            )}
            <InputLogin
              type="text"
              value={email}
              onChange={onChangeEmail}
              placeholder="Email"
              required
            />
            <InputSenha
              type="password"
              value={password}
              onChange={onChangeSenha}
              placeholder="Senha"
              required
            />
            <BotaoEntrar type="submit">
              {login ? "Entrar" : "Registrar"}
            </BotaoEntrar>
          </Formulario>
        </FormLogin>
      </Teste>
    </div>
  );
}
