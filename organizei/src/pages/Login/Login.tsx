import { useState } from "react";
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
} from "../../Components/Style/StyledLogin";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [login, setLogin] = useState(true);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const onChangeSenha = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSenha(event.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Senha:", senha);
  };
  const onClickBotaoLogin = () => {
    setLogin(true);
  };
  const onClickBotaoRegistrar = () => {
    setLogin(false);
  };

  return (
    <Teste>
      <div>
        <TituloApp>Organiz.ei</TituloApp>

        <Titulo2>Bem-vindo de volta!</Titulo2>
        <DivBotao>
          <Button data-active={login} onClick={onClickBotaoLogin}>
            Entrar
          </Button>
          <Button data-active={!login} onClick={onClickBotaoRegistrar}>
            Registrar
          </Button>
        </DivBotao>

        <FormLogin>
          <Formulario onSubmit={handleSubmit}>
            <InputLogin
              type="text"
              value={email}
              onChange={onChangeEmail}
              placeholder="Email"
            />
            <InputSenha
              type="password"
              value={senha}
              onChange={onChangeSenha}
              placeholder="Senha"
            />
            <BotaoEntrar type="submit">Entrar</BotaoEntrar>
          </Formulario>
        </FormLogin>
      </div>
    </Teste>
  );
}
