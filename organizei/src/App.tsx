import { useState } from "react";
import { Login } from "./pages/Login/Login";

function App() {
  const [paginaAtual, setPaginaAtual] = useState("");
  const aoCLicarLogin = () => {
    setPaginaAtual("login");
  };

  return (
    <>
      <div>
        <button onClick={aoCLicarLogin}>Ir para login</button>
      </div>

      {paginaAtual === "login" && <Login />}
    </>
  );
}

export default App;
