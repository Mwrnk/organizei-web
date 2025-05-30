import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 24px;
`;

const ProgressSlider = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 200px;
  background: #f8f9fa;
  border-radius: 24px;
  padding: 20px;
  margin-top: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SlideItem = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: ${props => props.active ? 1 : 0.3};
  transform: scale(${props => props.active ? 1 : 0.9});
  transition: all 0.3s ease;

  .icon {
    width: 64px;
    height: 64px;
    background: white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    img {
      width: 32px;
      height: 32px;
    }
  }

  .title {
    font-size: ${props => props.active ? '24px' : '18px'};
    font-weight: 600;
    color: #333;
    margin: 0;
    text-align: center;
    max-width: 200px;
  }

  .points {
    font-size: ${props => props.active ? '32px' : '24px'};
    font-weight: 700;
    color: #007AFF;
    margin: 0;
  }
`;

const ProgressText = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 16px;
`;

const Tag = styled.p`
  color: #666;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0 0 32px 0;
  text-align: center;
`;

export function PontosView() {
  const [currentPoints, setCurrentPoints] = useState(300);
  const [currentLevel, setCurrentLevel] = useState('chocante');

  const levels = [
    { name: 'iniciante', points: 0, title: 'Calma, você é iniciante...' },
    { name: 'chocante', points: 300, title: 'Você está chocante!' },
    { name: 'uau', points: 900, title: 'Uau, você está incrível!' },
    { name: 'expert', points: 1500, title: 'Expert em organização!' },
    { name: 'mestre', points: 2500, title: 'Mestre supremo!' },
  ];

  useEffect(() => {
    // Aqui você pode fazer uma chamada à API para buscar os pontos reais do usuário
    // Por enquanto vamos usar o valor estático de 300
  }, []);

  const getNextLevel = () => {
    const currentLevelIndex = levels.findIndex(level => level.name === currentLevel);
    if (currentLevelIndex < levels.length - 1) {
      return levels[currentLevelIndex + 1];
    }
    return null;
  };

  const nextLevel = getNextLevel();

  return (
    <Container>
      <Tag>#pontos</Tag>
      <Title>Sua jornada de organização</Title>
      
      <ProgressSlider>
        {levels.map((level) => (
          <SlideItem 
            key={level.name}
            active={level.name === currentLevel}
          >
            <div className="icon">
              {level.name === currentLevel && (
                <img src="/path-to-your-icon.svg" alt={level.name} />
              )}
            </div>
            <p className="title">{level.title}</p>
            <p className="points">+{level.points}pts</p>
          </SlideItem>
        ))}
      </ProgressSlider>

      {nextLevel && (
        <ProgressText>
          Consiga {nextLevel.points - currentPoints}pts para alcançar o próximo nível 🚀
        </ProgressText>
      )}
    </Container>
  );
} 