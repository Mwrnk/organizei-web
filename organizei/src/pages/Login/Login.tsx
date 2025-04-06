import { useState } from "react";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeSenha = async (event) => {
    setSenha(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Senha:", senha);
  };

  return (
    <>
      <h3>Organiz.ei</h3>
      <div>
        <h2>Bem-vindo de volta!</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            onChange={onChangeEmail}
            placeholder="Email"
          />
          <input
            type="password"
            value={senha}
            onChange={onChangeSenha}
            placeholder="Senha"
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </>
  );
}
