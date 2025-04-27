import styled from "styled-components";

export const Teste = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 80vh;

  font-family: "Kodchasan", sans-serif;
  text-align: center;
`;

export const FormLogin = styled.div`
  font-family: "Kodchasan", sans-serif;
  display: grid;
  align-items: center;
  text-align: center;
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

export const BotaoVoltar = styled.button`
  background: none;
  border: none;
  padding: 0px 20px 0px 0px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    display: block;
  }
`;
export const DivBotao = styled.div`
  display: flex;
  width: 330px;
  margin: 0;
  background-color: rgba(233, 232, 232, 1);
  padding: 8px;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 12px;
`;

export const Button = styled.button`
  font-family: "Kodchasan", sans-serif;
  width: 100%;
  border: none;
  font-weight: 600;
  cursor: pointer;
  padding: 15px 30px;
  color: #6b7280;
  transition: 0.2s ease;
  background-color: transparent;
  &:first-child {
    border-radius: 12px;
  }

  &:last-child {
    border-radius: 12px;
  }

  &:first-child[data-active="true"],
  &:last-child[data-active="true"] {
    background-color: white;
    color: black;
  }
`;
