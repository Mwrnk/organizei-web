import styled from "styled-components";
import { Header } from "../../Components/Header";
import adicionar from "../../../assets/adicionarBrancosvg.svg";
import nuvem from "../../../assets/nuvemBaixar.svg";
import nuvemBranca from "../../../assets/baixarBranco.svg";

import { useState } from "react";

const ContainerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BotaoCriar = styled.button`
  background-color: #007aff;
  padding: 12px 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  border: none;
  &:hover {
    background-color: #003d80;
    cursor: pointer;
  }
`;

const BotaoBaixar = styled.button`
  background-color: #e9e8e8;
  padding: 12px 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: black;
  border: none;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: black;
    color: white;
    cursor: pointer;
  }
`;

const BotaoPadrao = styled.button`
  background: none;
  padding: 18px 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  color: black;
  border: 1px solid #e9e8e8;
  margin-top: 10px;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: black;
    color: white;
    cursor: pointer;
  }
`;

const Botoes = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  gap: 10px;
`;

export function Profissional() {
  const [hoverBaixar, setHoverBaixar] = useState(false);

  return (
    <div>
      <Header />
      <ContainerCard>
        <p>#primeiros-passos</p>
        <h1>Vamos criar o seu primeiro card?</h1>
        <Botoes>
          <BotaoCriar>
            <img src={adicionar} alt="adicionar" /> Criar card
          </BotaoCriar>

          <BotaoBaixar
            onMouseEnter={() => setHoverBaixar(true)}
            onMouseLeave={() => setHoverBaixar(false)}
          >
            <img src={hoverBaixar ? nuvemBranca : nuvem} alt="baixar nuvem" />
            Baixar Nuvem
          </BotaoBaixar>
        </Botoes>

        <div>
          <BotaoPadrao>Usar template padrão</BotaoPadrao>
        </div>
      </ContainerCard>
    </div>
  );
}
