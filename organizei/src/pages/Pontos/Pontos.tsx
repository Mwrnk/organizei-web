import { useEffect, useState } from 'react';
import { Header } from '../../Components/Header';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProgressSlider = styled.div`
  position: relative;
  width: 100%;
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

export function Pontos() {
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
    <>
      <Header />
      <Container>
        <ProgressSlider>
          {levels.map((level, index) => (
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
    </>
  );
} 