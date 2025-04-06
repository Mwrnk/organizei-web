import { useState } from "react";
import {
  Teste,
  FormLogin,
  TituloApp,
  Formulario,
  InputSenha,
  InputLogin,
  BotaoEntrar,Titulo2
} from "../../Components/Style/StyledLogin";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const onChangeSenha = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSenha(event.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Senha:", senha);
  };

  return (
    <Teste>
      <div>
        <TituloApp>Organiz.ei</TituloApp>
        <div>
          <Titulo2>Bem-vindo de volta!</Titulo2>
          <button>entrar</button>
        </div>
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
