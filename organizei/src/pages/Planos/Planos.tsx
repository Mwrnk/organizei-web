import { useState, useEffect } from "react";
import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import styled from "styled-components";
import { toast } from "react-toastify";
import { UserRole } from "../../Types/User";
import VistoPlano from "../../../assets/contemPlanos.svg";
import NegacaoPlano from "../../../assets/naoContemPlano.svg";

const PlanosContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
`;

const DivBotao = styled.div`
  display: flex;
  width: 250px;
  background-color: rgba(233, 232, 232, 1);
  padding: 5px;
  margin: 0 auto 20px auto;
  border-radius: 12px;
`;

const Button = styled.button`
  font-family: "Kodchasan", sans-serif;
  width: 100%;
  border: none;
  font-weight: 600;
  cursor: pointer;
  padding: 13px 25px;
  color: #6b7280;
  transition: 0.2s ease;
  background-color: transparent;
  &:first-child {
    border-radius: 12px;
  }
  &:last-child {
    border-radius: 12px;
  }
  &[data-active="true"] {
    background-color: white;
    color: black;
  }
`;

const TituloPagina = styled.h1`
  margin-bottom: 20px;
  color: #333;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

const PlanosGrid = styled.div`
  display: flex;
  gap: 25px;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: nowrap;
`;

const PlanoCard = styled.div<{ highlighted?: boolean }>`
  width: 280px;
  padding: 25px 20px;
  border-radius: 24px;
  background-color: ${(props) => (props.highlighted ? "#1A1A1A" : "white")};
  color: ${(props) => (props.highlighted ? "white" : "black")};
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 450px;
  position: relative;
  transition: transform 0.3s;
  justify-content: space-between;

  ${(props) =>
    props.highlighted &&
    `
      margin-bottom: 20px;
      transform: translateY(-10px); 
  `}
`;

const PlanoTitulo = styled.h2`
  margin-bottom: 15px;
  font-size: 28px;
`;

const PlanoBeneficios = styled.ul`
  list-style: none;
  text-align: left;
  margin-bottom: 20px;
  padding-left: 0;
  font-size: 14px;
  width: 100%;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 10px;
    color: inherit;
  }

  img {
    width: 18px;
    height: 18px;
  }
`;

const PlanoPreco = styled.div`
  margin-bottom: 10px;

  .real {
    font-size: 20px;
    vertical-align: top;
    margin-right: 3px;
  }
  .preco {
    font-size: 36px;
    font-weight: bold;
  }
  .periodo {
    font-size: 14px;
    color: #666;
  }
`;

const PlanoButton = styled.button<{ highlighted?: boolean }>`
  background-color: #e0e0e0;
  color: black;
  border: none;
  border-radius: 20px;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  max-width: 200px;
  margin-top: 15px;

  &:hover {
    background-color: ${({ highlighted }) =>
      highlighted ? "transparent" : "black"};
    color: ${({ highlighted }) => (highlighted ? "white" : "white")};
    border: ${({ highlighted }) =>
      highlighted ? " 1px solid white" : "white"};
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const ToggleContainer = styled.div<{ isOn: boolean }>`
  width: 40px;
  height: 25px;
  background-color: ${({ isOn }) => (isOn ? "green" : "#ccc")};
  border-radius: 50px;
  padding: 3px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  cursor: default;
  pointer-events: none;
`;

const ToggleCircle = styled.div<{ isOn: boolean }>`
  width: 25px;
  height: 25px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
  transform: ${({ isOn }) => (isOn ? "translateX(15px)" : "translateX(0)")};
`;

export function Planos() {
  const [tempoPlanos, setTempoPlanos] = useState(true);
  const { user } = useAuth();
  const [planoSelecionado, setPlanoSelecionado] = useState<
    "free" | "premium" | "enterprise"
  >(user?.role === UserRole.PREMIUM ? "premium" : "free");
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onClickBotaoMensal = () => setTempoPlanos(true);
  const onClickBotaoAnual = () => setTempoPlanos(false);

  const handleAssinar = (plano: "free" | "premium" | "enterprise") => {
    // Aqui você implementaria a integração com um gateway de pagamento
    // para processar a assinatura do usuário

    if (plano === "free" || user?.role === UserRole.PREMIUM) {
      toast.info("Seu plano atual já está ativo!");
      return;
    }

    toast.success(
      `Assinatura do plano ${plano.toUpperCase()} realizada com sucesso!`
    );
    setPlanoSelecionado(plano);
  };

  return (
    <>
      <Header />
      <PlanosContainer>
        <TituloPagina>
          Vire um usuário
          <ToggleContainer isOn={isOn}>
            <ToggleCircle isOn={isOn} />
          </ToggleContainer>
          <span style={{ color: isOn ? "green" : "#333" }}>premium</span>
        </TituloPagina>

        <DivBotao>
          <Button data-active={tempoPlanos} onClick={onClickBotaoMensal}>
            Mensal
          </Button>
          <Button data-active={!tempoPlanos} onClick={onClickBotaoAnual}>
            Anual
          </Button>
        </DivBotao>

        <PlanosGrid>
          <PlanoCard>
            <PlanoTitulo>Free</PlanoTitulo>
            <PlanoBeneficios>
              <li>
                <img src={VistoPlano} alt="Incluído" />
                Acesso básico
              </li>
              <li>
                <img src={NegacaoPlano} alt="Não incluído" />
                Suporte prioritário
              </li>
              <li>
                <img src={NegacaoPlano} alt="Não incluído" />
                Recursos premium
              </li>
            </PlanoBeneficios>
            <PlanoPreco>
              <span className="real">R$</span>
              <span className="preco">Free</span>
              <span className="periodo"></span>
            </PlanoPreco>
            <PlanoButton
              disabled={planoSelecionado === "free"}
              onClick={() => handleAssinar("free")}
            >
              {planoSelecionado === "free" ? "Você já tem" : "Assinar"}
            </PlanoButton>
          </PlanoCard>

          <PlanoCard highlighted>
            <PlanoTitulo>Plano A</PlanoTitulo>
            <PlanoBeneficios>
              <li>
                <img src={VistoPlano} alt="Incluído" />
                Acesso completo
              </li>
              <li>
                <img src={VistoPlano} alt="Incluído" />
                Suporte 24/7
              </li>
              <li>
                <img src={VistoPlano} alt="Incluído" />
                3.000 pontos de bônus
              </li>
            </PlanoBeneficios>
            <PlanoPreco>
              <span className="real">R$</span>
              <span className="preco">99</span>
              <span className="periodo">/mês</span>
              <span style={{ marginLeft: 10, color: "#3498db", fontSize: 14 }}>
                3.000 pts
              </span>
            </PlanoPreco>
            <PlanoButton highlighted onClick={() => handleAssinar("premium")}>
              Assinar
            </PlanoButton>
            <small
              style={{
                marginTop: 8,
                display: "block",
                color: "#aaa",
                fontSize: 12,
              }}
            >
              Plano recomendado
            </small>
          </PlanoCard>

          <PlanoCard>
            <PlanoTitulo>Plano B</PlanoTitulo>
            <PlanoBeneficios>
              <li>
                <img src={VistoPlano} alt="Incluído" />
                Acesso avançado
              </li>
              <li>
                <img src={VistoPlano} alt="Incluído" />
                Atendimento VIP
              </li>
              <li>
                <img src={NegacaoPlano} alt="Não incluído" />
                Consultoria exclusiva
              </li>
            </PlanoBeneficios>
            <PlanoPreco>
              <span className="real">R$</span>
              <span className="preco">69</span>
              <span className="periodo">/mês</span>
              <span style={{ marginLeft: 10, color: "#3498db", fontSize: 14 }}>
                2.100 pts
              </span>
            </PlanoPreco>
            <PlanoButton onClick={() => handleAssinar("enterprise")}>
              Assinar
            </PlanoButton>
          </PlanoCard>
        </PlanosGrid>
      </PlanosContainer>
    </>
  );
}
