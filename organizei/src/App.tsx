import { useState } from "react";
import { Login } from "./pages/Login/Login";

function App() {
  const [paginaAtual, setPaginaAtual] = useState("");

  const aoCLicarLogin = () => {
    setPaginaAtual("login");
  };

  return (
    <>
      {paginaAtual === "login" ? (
        <Login />
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Organiz.ei</h1>
          <button onClick={aoCLicarLogin}>Ir para login</button>
        </div>
      )}
    </>
  );
}

export default App;
