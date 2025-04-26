import { useState } from 'react';
import { Header } from '../../Components/Header';
import { useAuth } from '../../Contexts/AuthContexts';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { UserRole } from '../../Types/User';

const PlanosContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
`;

const TituloPagina = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const SubtituloPagina = styled.p`
  margin-bottom: 40px;
  color: #666;
  font-size: 18px;
`;

const PlanosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
`;

const PlanoCard = styled.div<{ isPremium: boolean }>`
  width: 320px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.3s, box-shadow 0.3s;
  border: ${props => props.isPremium ? '2px solid #3498db' : '1px solid #eee'};
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PlanoTag = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background-color: #3498db;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
`;

const PlanoTitulo = styled.h2`
  margin-bottom: 15px;
  color: #333;
`;

const PlanoPreco = styled.div`
  margin-bottom: 20px;
  
  .preco {
    font-size: 48px;
    font-weight: bold;
    color: #333;
  }
  
  .periodo {
    font-size: 16px;
    color: #666;
  }
  
  .real {
    font-size: 24px;
    vertical-align: top;
    margin-right: 5px;
  }
`;

const PlanoBeneficios = styled.ul`
  text-align: left;
  margin-bottom: 30px;
  padding-left: 20px;
  
  li {
    margin-bottom: 10px;
    color: #555;
    
    &::marker {
      color: #3498db;
    }
  }
`;

const PlanoButton = styled.button<{ isPrimary?: boolean }>`
  background-color: ${props => props.isPrimary ? '#3498db' : 'transparent'};
  color: ${props => props.isPrimary ? 'white' : '#3498db'};
  border: ${props => props.isPrimary ? 'none' : '2px solid #3498db'};
  border-radius: 5px;
  padding: 12px 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.isPrimary ? '#2980b9' : 'rgba(52, 152, 219, 0.1)'};
  }
  
  &:disabled {
    background-color: #ccc;
    border-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const ComparativoContainer = styled.div`
  margin-top: 60px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
`;

const ComparativoTitulo = styled.h2`
  margin-bottom: 30px;
  color: #333;
`;

const TabelaComparativo = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    color: #333;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  td:first-child {
    text-align: left;
    font-weight: 500;
  }
  
  .check {
    color: #27ae60;
    font-size: 20px;
  }
  
  .times {
    color: #e74c3c;
    font-size: 20px;
  }
`;

export function Planos() {
  const { user } = useAuth();
  const [planoSelecionado, setPlanoSelecionado] = useState<'free' | 'premium' | 'enterprise'>(
    user?.role === UserRole.PREMIUM ? 'premium' : 'free'
  );
  
  const handleAssinar = (plano: 'free' | 'premium' | 'enterprise') => {
    // Aqui você implementaria a integração com um gateway de pagamento
    // para processar a assinatura do usuário
    
    if (plano === 'free' || user?.role === UserRole.PREMIUM) {
      toast.info('Seu plano atual já está ativo!');
      return;
    }
    
    toast.success(`Assinatura do plano ${plano.toUpperCase()} realizada com sucesso!`);
    setPlanoSelecionado(plano);
  };
  
  return (
    <>
      <Header />
      <PlanosContainer>
        <TituloPagina>Escolha o plano ideal para você</TituloPagina>
        <SubtituloPagina>Desbloqueie todo o potencial de organização com nossos planos premium</SubtituloPagina>
        
        <PlanosGrid>
          {/* Plano Free */}
          <PlanoCard isPremium={false}>
            <PlanoTitulo>Free</PlanoTitulo>
            <PlanoPreco>
              <span className="real">R$</span>
              <span className="preco">0</span>
              <span className="periodo">/mês</span>
            </PlanoPreco>
            <PlanoBeneficios>
              <li>Acesso às funcionalidades básicas</li>
              <li>Organização de tarefas simples</li>
              <li>Até 5 projetos simultâneos</li>
              <li>Suporte por email</li>
            </PlanoBeneficios>
            <PlanoButton 
              onClick={() => handleAssinar('free')}
              disabled={planoSelecionado === 'free'}
            >
              {planoSelecionado === 'free' ? 'Plano Atual' : 'Começar Grátis'}
            </PlanoButton>
          </PlanoCard>
          
          {/* Plano Premium */}
          <PlanoCard isPremium={true}>
            <PlanoTag>POPULAR</PlanoTag>
            <PlanoTitulo>Premium</PlanoTitulo>
            <PlanoPreco>
              <span className="real">R$</span>
              <span className="preco">19,90</span>
              <span className="periodo">/mês</span>
            </PlanoPreco>
            <PlanoBeneficios>
              <li>Todas as funcionalidades do plano Free</li>
              <li>Acesso ao assistente virtual de IA</li>
              <li>Projetos ilimitados</li>
              <li>Relatórios de produtividade</li>
              <li>Integração com calendário</li>
              <li>Suporte prioritário</li>
            </PlanoBeneficios>
            <PlanoButton 
              isPrimary
              onClick={() => handleAssinar('premium')}
              disabled={planoSelecionado === 'premium'}
            >
              {planoSelecionado === 'premium' ? 'Plano Atual' : 'Assinar Premium'}
            </PlanoButton>
          </PlanoCard>
          
          {/* Plano Enterprise */}
          <PlanoCard isPremium={false}>
            <PlanoTitulo>Enterprise</PlanoTitulo>
            <PlanoPreco>
              <span className="real">R$</span>
              <span className="preco">79,90</span>
              <span className="periodo">/mês</span>
            </PlanoPreco>
            <PlanoBeneficios>
              <li>Todas as funcionalidades do plano Premium</li>
              <li>Acesso para equipes (até 10 usuários)</li>
              <li>Ferramentas de colaboração avançadas</li>
              <li>Análise de desempenho da equipe</li>
              <li>Personalização de marca</li>
              <li>Gerente de conta dedicado</li>
            </PlanoBeneficios>
            <PlanoButton 
              onClick={() => handleAssinar('enterprise')}
              disabled={planoSelecionado === 'enterprise'}
            >
              {planoSelecionado === 'enterprise' ? 'Plano Atual' : 'Contactar Vendas'}
            </PlanoButton>
          </PlanoCard>
        </PlanosGrid>
        
        <ComparativoContainer>
          <ComparativoTitulo>Comparativo de Planos</ComparativoTitulo>
          <TabelaComparativo>
            <thead>
              <tr>
                <th>Recursos</th>
                <th>Free</th>
                <th>Premium</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Organização de tarefas</td>
                <td><span className="check">✓</span></td>
                <td><span className="check">✓</span></td>
                <td><span className="check">✓</span></td>
              </tr>
              <tr>
                <td>Projetos</td>
                <td>5 projetos</td>
                <td>Ilimitados</td>
                <td>Ilimitados</td>
              </tr>
              <tr>
                <td>Assistente virtual IA</td>
                <td><span className="times">✕</span></td>
                <td><span className="check">✓</span></td>
                <td><span className="check">✓</span></td>
              </tr>
              <tr>
                <td>Relatórios de produtividade</td>
                <td><span className="times">✕</span></td>
                <td><span className="check">✓</span></td>
                <td><span className="check">✓</span></td>
              </tr>
              <tr>
                <td>Suporte</td>
                <td>Email</td>
                <td>Prioritário</td>
                <td>Gerente dedicado</td>
              </tr>
              <tr>
                <td>Acesso para equipes</td>
                <td><span className="times">✕</span></td>
                <td><span className="times">✕</span></td>
                <td>Até 10 usuários</td>
              </tr>
            </tbody>
          </TabelaComparativo>
        </ComparativoContainer>
      </PlanosContainer>
    </>
  );
} 
