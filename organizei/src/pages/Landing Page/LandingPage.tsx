import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import botIcon from '../../../assets/bot.svg';
import controleIcon from '../../../assets/Controle.svg';
import pontosIcon from '../../../assets/pontos.svg';
import cardsEmpilhadosImg from '../../../assets/CardsEmpilhados.png';
import setaAbaixo from '../../../assets/setaParaBaixo.svg';
import backgroundCards from '../../../assets/backgroundCards.png';
import chatIA from '../../../assets/chatIA.png';
import baralhoImg from '../../../assets/BaralhoAlinhado.png';
import backgroundPontos from '../../../assets/backgroundPontos.png';
import backgroundCelular from '../../../assets/backgroundCelular.png';
import jogosFoto from '../../../assets/jogosFoto.png';
import { useState, useEffect } from "react";

const Container = styled.div`
  
  margin: 0 ;
  background-color: #EFEFEF;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: 500;
  border:1px solid #D4D3D3;
  padding: 10px;
  border-radius: 20px;

  &:hover {
    border:1px solid #000000;
    background-color: #000000;
    color: #ffffff;
  }

  &:hover img {
    filter: brightness(0) invert(1);
  }
`;

const Button = styled.button`
  background-color: #000;
  color: white;
  padding: 15px 26px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0066ff;
    transform: translateY(-2px);
  }
`;

const ButtonWhite = styled.button`
  background-color: #fff;
  color: #000;
  margin: 0 auto;
  font-size: 18px;
  padding: 15px 30px;
  &:hover {
    background-color: #0066ff;
    color: #ffffff;
  }
`;

const HeroSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 40px;
`;

const HeroContent = styled.div`
  max-width: 600px;
  margin-left: 70px;
 

`;

const SmallText = styled.p`
  display:inline-block;
  color: #666;
  border:1px solid #D4D3D3;
  border-radius: 20px;
  padding: 10px 20px;
  margin-bottom: 20px;
`;

const Title = styled.p`
  font-size: 40px;
  margin-bottom: 40px;
  line-height: 1.2;
 


  span {
    font-weight: 600;
    color: black;
    font-size: 70px;
    font-style: italic;
  }
`;

const Features = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  color: #333;
  font-weight: 600;
  background-color: white;
  padding: 20px 40px;
  border-radius: 30px;

  span {
    font-size: 24px;
  }
 
`;

const CardsSection = styled.section`
  text-align: center;
  padding: 150px 0;
  border-radius: 30px;
  margin:-14px -30px 0  0;
  background-image: url(${backgroundCards});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const SectionTitle = styled.p`
  font-size: 48px;
  margin-bottom: 40px;
  text-align: center; 

  span {
  display: block;
  content: '';
  width: 15%;
  right: 42%;
  position: absolute;
   border-bottom: 4px solid #0066ff;
    
  }
`;

const SectionTitleWhite = styled(SectionTitle)`
  color: white;
  margin-bottom: 20px;
`;

const AISection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  align-items: center;
  padding: 150px 0;
`;

const AIContent = styled.div`
  max-width: 500px;
  margin-left: 90px;
`;

const AITitle = styled.p`
    
  font-size: 50px;
  line-height: 1.2;
  margin-bottom: 20px;
`;

const AIDescription = styled.p`
  margin-bottom: 20px;
  font-size: 24px;
  line-height: 1.9;
`;
const SubDescription = styled.p`
  text-align:center;
  margin-right: 40px;
  font-style:italic;
  font-size: 17px;
`;

const GamesSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  padding-top:0px;
  margin-top: 100px;
  padding-bottom: -100px;
  background-color: #ffffff;

`;
const DivDadosGames = styled.div`
width: 100%;
max-width: 800px;
border-radius: 20px;
margin-left: 100px;
`;

const SubTituloGames = styled.p`
  font-size: 18px;
  margin-bottom: 40px;

`;


const GamesTitle = styled.p`
  font-size: 48px;
 margin-top: 40px;
  margin-bottom: 10px;  
  span {
    font-weight: 600;
    color: black;

    font-style: italic;
  }

`;

const GameCards = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 40px;
  justify-content: left;
 
 
`;

const GameCard = styled.div`

  padding: 20px;
  border-radius: 16px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border:2px solid #E8E8E8;
  font-weight: 500;
  font-size: 18px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
   
  }
`;
const BaralhoImg = styled.img`
  width: 100%;
  height: 1000px;
  margin-top:-180px;
`;

const PointsSection = styled.section`
  background-image: url(${backgroundPontos});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 650px 0 0 0;
  width: 110vw;
  margin-left: -50px;
  text-align: center;
  border-radius: 30px;
  margin-top: -380px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, transparent, #E9E8E8);
    pointer-events: none;
  }
`;

const CTASection = styled.section`
  position: relative;
  text-align: center;
  padding: 140px 0px;
  background-color: #111;
  background-image: url(${backgroundCelular});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  margin: 0;
  margin-top: -223px;
  width: 100vw;

`;

const CTAContainer = styled.div`
  max-width: 100%;
  margin: 0;
`;

const CardStackImg = styled.img`
  width: 600px;
  max-width: 100%;
  display: block;
  margin: 30 auto;
`;


const Icon = styled.img`
  width: 22px;
  height: 22px;
  vertical-align: middle;
`;

const VantagensRow = styled.div`
  display: flex;
  align-items: center;
  margin: 0 100px;
  margin-top: -30px;
`;

const VantagensText = styled.span`  font-weight: 600;
  font-size: 18px;
  color: #222;
  display: flex;
  align-items: center;
  gap: 8px;
`;const SetaIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const Linha = styled.div`
  flex: 1;
  height: 2px;
  background: #D4D3D3;
  margin-left: 16px;
`;

const ChatIAImg = styled.img`
  width: 100%;
  max-width: 650px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
`;

const CTADescription = styled.p`
  font-size: 20px;
  margin-bottom: 30px;
  color: #ffffff;
  span {
    font-weight: 800;
    color: #ffffff;
  }
`;
const Jogos = styled.img`
  width: 70%;
  max-width: 370px;
 position: absolute;
 top: -30px;
 right: 42%;


 
`;
const DivTextoPontos = styled.div`
  position: absolute;
  top: 42%;
  right: 31%;
  bottom: 0px;

`;
const TitlePontos = styled.p`
  font-size: 36px;
  margin-bottom: 15px;
  text-align: center; 
`;
const SubTituloPontos = styled.p`
  font-size: 22px;
  margin-bottom: 40px;
  text-align: center; 
`;
const Footer = styled.footer`
  background-color: #000000;
  color: #ffffff;
  padding: 30px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScrollToTopButton = styled.button<{ visible: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #000000;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  transform: rotate(180deg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #0066ff;
    transform: rotate(180deg) translateY(-5px);
  }

  img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
`;

export function LandingPage() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollTop(scrollPosition > 300); // Mostra o botão após rolar 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container>
      <Header>
        <LeftGroup>
          <Logo>Organiz.ei /</Logo>
          <Nav>
            <NavLink onClick={() => scrollToSection('ai-section')}>
              <Icon src={botIcon} alt="IA" /> IA
            </NavLink>
            <NavLink onClick={() => scrollToSection('games-section')}>
              <Icon src={controleIcon} alt="Games" /> Games
            </NavLink>
            <NavLink onClick={() => scrollToSection('points-section')}>
              <Icon src={pontosIcon} alt="Pontos" /> Pontos
            </NavLink>
          </Nav>
        </LeftGroup>
        <Button onClick={() => navigate("/login")}>Iniciar app ↗</Button>
      </Header>

      <HeroSection>
        <HeroContent>
          <SmallText>Uma nova forma de<strong> estudar...</strong></SmallText>
          
          <Title>
            Aprender ficou mais
            <br />
            <span>fácil e divertido!</span>
          </Title>
          <Features>
            <Feature>
              Fácil Acesso
            </Feature>
            <Feature>
              Comunidade
            </Feature>
            <Feature>
              Integrado a IA
            </Feature>
          </Features>
        </HeroContent>
        <CardStackImg src={cardsEmpilhadosImg} alt="Cards empilhados" />
      </HeroSection>
        <VantagensRow>
            <VantagensText>
              ver todas vantagens
              <SetaIcon src={setaAbaixo} alt="Seta para baixo" />
            </VantagensText>
            <Linha />
        </VantagensRow>

      <CardsSection>
        <SectionTitle>
          Crie <strong>cards</strong> para
          <br />
          cada matéria
          <span/>
        </SectionTitle>
        
        
      </CardsSection>

      <AISection id="ai-section">
        <AIContent>
          <AITitle>
          Conheça a nossa o <strong>Organiz.ai</strong>
          </AITitle>
          <AIDescription>
            Nossa mais nova Inteligência Artificial
          </AIDescription>
          <SubDescription>Tire suas dúvidas toda hora com ela!</SubDescription>
        </AIContent>
        <ChatIAImg src={chatIA} alt="Chat IA" />
      </AISection>

      <GamesSection id="games-section">
        <DivDadosGames>
        <GamesTitle>
          <span>Minigames</span> para
          <br />
          fixar na memória
        </GamesTitle>
        <SubTituloGames>Aprender também é se divertir!</SubTituloGames>
        <GameCards>
          <GameCard> Flash Cards</GameCard>
          <GameCard> Show do milhão</GameCard>
          </GameCards>
        </DivDadosGames>
        <BaralhoImg src={baralhoImg} alt="Baralho" />
      </GamesSection>

      <PointsSection id="points-section">
        <Jogos src={jogosFoto} alt="Jogos" />
        <DivTextoPontos>
        <TitlePontos>Sistema de pontuações ativo</TitlePontos>
        <SubTituloPontos>Ganhe pontos publicando na comunidade ou jogando os minigames</SubTituloPontos>
        </DivTextoPontos>
      </PointsSection>

      <CTASection>
        <CTAContainer>
          <SectionTitleWhite>
            Estude de forma inteligente
          </SectionTitleWhite>
          <CTADescription>
            Utilize o <span>Organiz.ei</span> hoje mesmo
          </CTADescription>
          <Button 
            onClick={() => navigate("/login")}
            as={ButtonWhite}
          >
            Iniciar o app ↗
          </Button>
        </CTAContainer>
      </CTASection>

      <ScrollToTopButton 
        visible={showScrollTop} 
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <img src={setaAbaixo} alt="Voltar ao topo" />
      </ScrollToTopButton>

      <Footer>
        <p>Organiz.ei</p>
        <p>Todos os direitos reservados</p>
      </Footer>
    </Container>
  );
}



