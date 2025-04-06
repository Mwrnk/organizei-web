import styled from "styled-components";

export const Teste = styled.div`
  display: flex;
  height: 80vh;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;
  background-color: white;
  font-family: "Kodchasan", sans-serif;
`;
export const FormLogin = styled.div`
  font-family: "Kodchasan", sans-serif;
  display: grid;
  align-items: center;
  text-align: center;
  background-color: white;
`;
export const TituloApp = styled.h2``;
export const Titulo2 = styled.h2`
  font-size: 30px;
  font-weight: bold;
`;
export const Formulario = styled.form`
  font-family: "Kodchasan", sans-serif;
  display: grid;
  gap: 20px;
  width: 380px;
`;
export const InputLogin = styled.input`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid rgba(26, 26, 26, 0.1);
  font-family: "Kodchasan", sans-serif;
`;
export const InputSenha = styled.input`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid rgba(26, 26, 26, 0.1);
  font-family: "Kodchasan", sans-serif;
`;
export const BotaoEntrar = styled.button`
  font-family: "Kodchasan", sans-serif;
  padding: 22px;
  border-radius: 12px;
  background-color: rgba(0, 122, 255, 1);
  border: none;
  color: white;
  &:hover {
    background-color: rgba(0, 61, 128, 1);
    cursor: pointer;
  }
`;
