  import { useEffect, useState } from "react";
  import axios from "axios";
  import { Header } from "../../Components/Header";
  import { useAuth } from "../../Contexts/AuthContexts";
  import { usePageLoading } from "../../Utils/usePageLoading";
  import styled from "styled-components";
  import { toast } from "react-toastify";
  import { UserRole } from "../../Types/User";
  import VistoPlano from "../../../assets/contemPlanos.svg";
  import NegacaoPlano from "../../../assets/naoContemPlano.svg";

  // --- Styled Components ---
  const PlanosContainer = styled.div`
    width: 100%;
    min-height: calc(100vh - 80px); /* Considerando o header */
    padding: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;
  const DivBotao = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 40px;
   font-weight: 600;
    background-color: white;
    padding: 5px;
    margin: 0 auto 20px auto;
    border-radius: 12px;
   font-size:18px;
    border: 2px solid #000000;
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
    flex-wrap: wrap;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

    @media (max-width: 1200px) {
      gap: 20px;
      padding: 10px;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }
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
    transition: all 0.3s ease;
    justify-content: space-between;
    
    ${(props) =>
      props.highlighted && `
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      `}

    @media (max-width: 768px) {
      width: 100%;
      max-width: 320px;
      ${(props) =>
        props.highlighted && `
          transform: scale(1.05);
          margin: 20px 0;
        `}
    }

    &:hover {
      transform: ${(props) => props.highlighted ? 'translateY(-15px)' : 'translateY(-5px)'};
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
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
      color: white;
      border: ${({ highlighted }) => (highlighted ? "1px solid white" : "white")};
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

  // --- Tipagem dos dados ---
  type Plan = {
    _id: string;
    name: string;
    price: number;
    description: string;
    points?: number;
    features: string[];
  };

  export function Planos() {

    const { user, updateUser, loadUserPlan } = useAuth();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [planoAtualUsuario, setPlanoAtualUsuario] = useState<Plan | null>(null);
    const [isOn, setIsOn] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    usePageLoading(isDataLoading);

    useEffect(() => {
      const fetchPlans = async () => {
        setIsDataLoading(true);
        try {
          const response = await axios.get("http://localhost:3000/plans");

          const planosOrdenados = response.data.data.sort((a: Plan, b: Plan) => {
            const order = ["free", "premium", "enterprise"];
            return (
              order.indexOf(a.name.toLowerCase()) -
              order.indexOf(b.name.toLowerCase())
            );
          });

          setPlans(planosOrdenados);
        } catch (error: any) {
          console.error(
            "❌ Erro ao buscar planos:",
            error.response?.data || error.message
          );
          toast.error("Erro ao carregar planos");
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchPlans();
    }, []);

    useEffect(() => {
      const fetchPlanoAtual = async () => {
        if (!user?._id) return;

        try {
          const res = await axios.get(
            `http://localhost:3000/users/${user._id}/plan`
          );
          setPlanoAtualUsuario(res.data.data);
        } catch (error: any) {
          if (error.response?.status === 404) {
            setPlanoAtualUsuario(null); // Usuário sem plano
          } else {
            console.error("Erro ao buscar plano atual:", error);
          }
        }
      };

      fetchPlanoAtual();
    }, [user?._id]);

    useEffect(() => {
      const interval = setInterval(() => {
        setIsOn((prev) => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }, []);




    const handleAssinar = async (planoName: string) => {
      const plan = plans.find((p) => p.name.toLowerCase() === planoName);
      if (!plan || !user) return;

      try {
        await axios.put(`http://localhost:3000/users/${user._id}/plan`, {
          planId: plan._id,
        });

        toast.success(`Plano ${plan.name} ativado com sucesso!`);
        updateUser?.({ role: planoName.toLowerCase() as UserRole });
        setPlanoAtualUsuario(plan);

        await loadUserPlan(user._id);
      } catch (error: any) {
        console.error("Erro ao assinar plano:", error);
        toast.error("Erro ao assinar plano");
      }
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
              Planos Mensais
          </DivBotao>

          <PlanosGrid>
            {plans.map((plan, index) => {
              const isCurrent = planoAtualUsuario?._id === plan._id;
              const isHighlighted = index === 1;

              return (
                <PlanoCard key={plan._id} highlighted={isHighlighted}>
                  <PlanoTitulo>{plan.name}</PlanoTitulo>
                  <PlanoBeneficios>
                    {plan.features?.map((feature, index) => (
                      <li key={index}>
                        <img src={VistoPlano} alt="Incluído" />
                        {feature}
                      </li>
                    ))}
                    {plan.name.toLowerCase() === "free" && (
                      <>
                        <li>
                          <img src={NegacaoPlano} alt="Não incluído" />
                          <span style={{ color: "#666" }}>Acesso a IA</span>
                        </li>
                        <li>
                          <img src={NegacaoPlano} alt="Não incluído" />
                          <span style={{ color: "#666" }}>Jogos limitados</span>
                        </li>
                        <li>
                          <img src={NegacaoPlano} alt="Não incluído" />
                          <span style={{ color: "#666" }}>Jogos ilimitados</span>
                        </li>
                      </>
                    )}

                    {plan.name.toLowerCase() === "free" && (
                      <>
                        <li>
                          <img src={NegacaoPlano} alt="Não incluído" />
                          <span style={{ color: "#666" }}>Acesso a IA</span>
                        </li>
                        <li>
                          <img src={NegacaoPlano} alt="Não incluído" />
                          <span style={{ color: "#666" }}>Jogos limitados</span>
                        </li>
                      </>
                    )}
                    {plan.name.toLowerCase() === "premium" && (
                      <li>
                        <img src={VistoPlano} alt="Incluído" />
                        Jogos ilimitados
                      </li>
                    )}
                  </PlanoBeneficios>

                  <PlanoPreco>
                    <span className="real">R$</span>
                    <span className="preco">
                      {plan.price === 0 ? "Gratuito" : plan.price}
                    </span>
                    {plan.price > 0 && <span className="periodo">/mês</span>}
                    {plan.points && (
                      <span
                        style={{ marginLeft: 10, color: "#3498db", fontSize: 14 }}
                      >
                        {plan.points} pts
                      </span>
                    )}
                  </PlanoPreco>

                  <PlanoButton
                    highlighted={isHighlighted}
                    disabled={isCurrent}
                    onClick={() => handleAssinar(plan.name.toLowerCase())}
                  >
                    {isCurrent ? "Você já tem" : "Assinar"}
                  </PlanoButton>

                  {isHighlighted && (
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
                  )}
                </PlanoCard>
              );
            })}
          </PlanosGrid>
        </PlanosContainer>
      </>
    );
  }
