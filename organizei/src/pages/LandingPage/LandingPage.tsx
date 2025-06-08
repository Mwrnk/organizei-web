import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
`;

const Nav = styled.nav`
  display: flex;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const StartButton = styled.button`
  background: #2d3748;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1a202c;
    transform: translateY(-2px);
  }
`;

const HeroSection = styled.section`
  padding: 80px 5% 60px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Tagline = styled.p`
  font-size: 18px;
  color: #718096;
  font-style: italic;
  margin: 0;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 400;
  color: #2d3748;
  line-height: 1.2;
  margin: 0;

  .highlight {
    font-weight: 800;
    font-style: italic;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
`;

const FeatureIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const SeeAllButton = styled.button`
  background: transparent;
  border: none;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    color: #5a67d8;
    transform: translateX(5px);
  }
`;

const HeroVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CardStack = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  
  .card {
    position: absolute;
    width: 250px;
    height: 160px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    
    &:nth-child(1) {
      top: 0;
      left: 0;
      transform: rotate(-5deg);
      z-index: 1;
    }
    
    &:nth-child(2) {
      top: 20px;
      left: 30px;
      transform: rotate(5deg);
      z-index: 2;
    }
    
    &:nth-child(3) {
      top: 40px;
      left: 15px;
      transform: rotate(-2deg);
      z-index: 3;
    }
  }
`;

const Section = styled.section`
  padding: 80px 5%;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 400;
  color: #2d3748;
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  
  .highlight {
    font-weight: 700;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 2px;
  }
`;

const AISection = styled.section`
  padding: 80px 5%;
  background: #f7fafc;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const AIContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AITitle = styled.h2`
  font-size: 32px;
  color: #2d3748;
  margin: 0;
  
  .highlight {
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const AISubtitle = styled.h3`
  font-size: 18px;
  color: #4a5568;
  font-weight: 500;
  margin: 0;
`;

const AIDescription = styled.p`
  font-size: 16px;
  color: #718096;
  font-style: italic;
  margin: 0;
`;

const AIVisual = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const AIHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #2d3748;
`;

const ChatInterface = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const ChatMessage = styled.div`
  background: #f7fafc;
  padding: 12px 16px;
  border-radius: 12px;
  color: #4a5568;
  font-size: 14px;
  margin-bottom: 10px;
`;

const GamesSection = styled.section`
  padding: 80px 5%;
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const GamesContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GamesTitle = styled.h2`
  font-size: 32px;
  color: #2d3748;
  margin: 0;
  
  .highlight {
    font-weight: 700;
  }
`;

const GamesSubtitle = styled.p`
  font-size: 18px;
  color: #4a5568;
  margin: 0;
`;

const GameButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 468px) {
    flex-direction: column;
  }
`;

const GameButton = styled.button`
  background: white;
  border: 2px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 25px;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
  }
`;

const QuestionMark = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 120px;
  color: #2d3748;
  font-weight: 900;

  @media (max-width: 768px) {
    font-size: 80px;
  }
`;

const PointsSection = styled.section`
  background: linear-gradient(135deg, #3182ce 0%, #2b77c7 100%);
  padding: 80px 5%;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    animation: float 10s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const PointsContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
`;

const PointsIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const IconCard = styled.div`
  background: white;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: bounce 2s ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: 0s;
    color: #3182ce;
  }
  
  &:nth-child(2) {
    animation-delay: 0.5s;
    color: #38a169;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const PointsTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const PointsDescription = styled.p`
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  
  .highlight {
    font-weight: 700;
  }
`;

const Footer = styled.footer`
  background: #2d3748;
  color: white;
  padding: 80px 5% 40px;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FooterTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
`;

const FooterSubtitle = styled.p`
  font-size: 18px;
  opacity: 0.8;
  margin: 0;
  
  .highlight {
    font-weight: 700;
  }
`;

const FooterButton = styled.button`
  background: white;
  color: #2d3748;
  padding: 16px 32px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: center;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const Copyright = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 30px;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  opacity: 0.7;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export function LandingPage() {
  const navigate = useNavigate();

  const handleStartApp = () => {
    navigate('/login');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LandingContainer>
      <Header>
        <Logo>Organiz.ei</Logo>
        <Nav>
          <NavItem onClick={() => scrollToSection('ai-section')}>
            🤖 IA
          </NavItem>
          <NavItem onClick={() => scrollToSection('games-section')}>
            🎮 Games
          </NavItem>
          <NavItem onClick={() => scrollToSection('points-section')}>
            ⚡ Pontos
          </NavItem>
        </Nav>
        <StartButton onClick={handleStartApp}>
          Iniciar o app ↗
        </StartButton>
      </Header>

      <HeroSection>
        <HeroContent>
          <Tagline>Uma nova forma de estudar...</Tagline>
          <HeroTitle>
            Aprender ficou mais <span className="highlight">fácil e divertido!</span>
          </HeroTitle>
          
          <FeaturesGrid>
            <FeatureItem>
              <FeatureIcon>🔓</FeatureIcon>
              <FeatureTitle>Fácil Acesso</FeatureTitle>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🔔</FeatureIcon>
              <FeatureTitle>Comunidade</FeatureTitle>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureTitle>Integrado a IA</FeatureTitle>
            </FeatureItem>
          </FeaturesGrid>
          
          <SeeAllButton onClick={() => scrollToSection('ai-section')}>
            ver todas vantagens ↓
          </SeeAllButton>
        </HeroContent>

        <HeroVisual>
          <CardStack>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
          </CardStack>
        </HeroVisual>
      </HeroSection>

      <Section>
        <SectionTitle>
          Crie <span className="highlight">cards</span> para cada matéria
        </SectionTitle>
      </Section>

      <AISection id="ai-section">
        <AIContent>
          <AITitle>
            Conheça a nossa <span className="highlight">Organiz.ai</span>
          </AITitle>
          <AISubtitle>Nossa mais nova Inteligência Artificial</AISubtitle>
          <AIDescription>Tire suas dúvidas toda com ela!</AIDescription>
        </AIContent>
        
        <AIVisual>
          <AIHeader>
            🤖 Organi.ai
          </AIHeader>
          <div style={{ fontWeight: 600, marginBottom: '20px' }}>
            A ia que te torna mais produtivo
          </div>
          <ChatInterface>
            <ChatMessage>
              Organi.ai, preciso de uma ajuda sua
            </ChatMessage>
            <ChatMessage>
              Clé, sobre O que vamos procurar hoje?
            </ChatMessage>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              background: '#f7fafc',
              padding: '8px 12px',
              borderRadius: '12px'
            }}>
              <span>✏️</span>
            </div>
          </ChatInterface>
        </AIVisual>
      </AISection>

      <GamesSection id="games-section">
        <GamesContent>
          <GamesTitle>
            <span className="highlight">Minigames</span> para fixar na memória
          </GamesTitle>
          <GamesSubtitle>Aprender também é se divertir!</GamesSubtitle>
          
          <GameButtons>
            <GameButton onClick={handleStartApp}>Flash Cards</GameButton>
            <GameButton onClick={handleStartApp}>Show do milhão</GameButton>
          </GameButtons>
        </GamesContent>

        <QuestionMark>?</QuestionMark>
      </GamesSection>

      <PointsSection id="points-section">
        <PointsContent>
          <PointsIcons>
            <IconCard>⚡</IconCard>
            <IconCard>🚀</IconCard>
          </PointsIcons>
          
          <PointsTitle>Sistema de pontuações ativo</PointsTitle>
          <PointsDescription>
            Ganhe pontos publicando na <span className="highlight">comunidade</span> ou jogando os <span className="highlight">minigames</span>
          </PointsDescription>
        </PointsContent>
      </PointsSection>

      <Footer>
        <FooterContent>
          <FooterTitle>Estude de forma inteligente</FooterTitle>
          <FooterSubtitle>
            Utilize o <span className="highlight">Organiz.ei</span> hoje mesmo
          </FooterSubtitle>
          <FooterButton onClick={handleStartApp}>
            Iniciar o app ↗
          </FooterButton>
        </FooterContent>
        
        <Copyright>
          <span>Organiz.ei</span>
          <span>©Direitos autorais garantidos</span>
        </Copyright>
      </Footer>
    </LandingContainer>
  );
} 