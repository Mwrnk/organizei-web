import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../Contexts/AuthContexts';
import styled from 'styled-components';
import setaDireita from '../../../assets/setaDireita.svg';
import setaEsquerda from '../../../assets/setaEsquerda.svg';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Subtitle = styled.p`
  color: #555;
  margin-bottom: 8px;
`;

const CarouselContainer = styled.div`
  position: relative;
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  height: 400px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  width: 90%;
  margin: 40px auto 0;
`;

interface ProgressContainerProps {
  $currentIndex: number;
  $isDragging: boolean;
  $dragOffset: number;
}

const ProgressContainer = styled.div<ProgressContainerProps>`
  display: flex;
  height: 100%;
  width: 500%;
  transition: ${props => props.$isDragging ? 'none' : 'transform 0.5s ease'};
  transform: translateX(calc(${props => {
    const baseTransform = (-20 * props.$currentIndex);
    const dragPercentage = (props.$dragOffset / window.innerWidth) * 100;
    return `${baseTransform + dragPercentage}%`;
  }}));
  cursor: grab;
  user-select: none;
  
  /* Hide scrollbar but keep functionality */
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: grabbing;
  }
`;

const LevelCard = styled.div<{ active?: boolean; locked?: boolean }>`
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  opacity: ${props => props.active ? 1 : 0.3};
  transition: all 0.5s ease;
  transform: scale(${props => props.active ? 1 : 0.85});
  position: relative;
  flex-shrink: 0;
  filter: ${props => props.locked ? 'grayscale(100%)' : 'none'};
`;

const CurrentLevelTag = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #007AFF;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
`;

const LevelTitle = styled.h3<{ active?: boolean; locked?: boolean }>`
  font-size: ${props => props.active ? '42px' : '32px'};
  margin: 0;
  color: ${props => props.locked ? '#666' : '#333'};
  text-align: center;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-top: ${props => props.active ? '40px' : '0'};
`;

const Points = styled.div<{ locked?: boolean }>`
  font-size: 64px;
  font-weight: 700;
  color: ${props => props.locked ? '#666' : '#007AFF'};
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LightningIcon = styled.div<{ locked?: boolean }>`
  width: 80px;
  height: 80px;
  background: ${props => props.locked ? '#e0e0e0' : 'white'};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: ${props => props.locked ? '0 8px 24px rgba(0,0,0,0.05)' : '0 8px 24px rgba(0,0,0,0.1)'};
`;

const LockedBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(102, 102, 102, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 5px;' : 'right: 5px;'}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.3s ease;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  z-index: 10;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const NextLevelInfo = styled.p`
  text-align: center;
  color: #666;
  margin-top: 24px;
  font-size: 16px;
`;

interface Level {
  title: string;
  points: number;
  description: string;
}

const levels: Level[] = [
  { title: "Calma, você é iniciante...", points: 0, description: "Comece sua jornada" },
  { title: "Você está chocante!", points: 300, description: "Continue evoluindo!" },
  { title: "Uau, você está incrível!", points: 900, description: "Você está indo muito bem!" },
  { title: "Expert em organização!", points: 1500, description: "Quase lá!" },
  { title: "Mestre supremo!", points: 2500, description: "Você alcançou o nível máximo!" }
];

export function PontosView() {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserPoints(user?.orgPoints || 0);
  }, [user?.orgPoints]);

  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (userPoints >= levels[i].points) {
        return i;
      }
    }
    return 0;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = currentLevel < levels.length - 1 ? levels[currentLevel + 1] : null;
  const pointsToNextLevel = nextLevel ? nextLevel.points - userPoints : 0;

  const handleNavigation = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'right' && currentIndex < levels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    setDragOffset(diff);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].pageX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const threshold = window.innerWidth * 0.1; // 10% of screen width
    const movement = dragOffset;
    
    if (Math.abs(movement) > threshold) {
      if (movement > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (movement < 0 && currentIndex < levels.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.shiftKey) {
        e.preventDefault();
        if (e.deltaY > 0 && currentIndex < levels.length - 1) {
          setCurrentIndex(prev => Math.min(prev + 1, levels.length - 1));
        } else if (e.deltaY < 0 && currentIndex > 0) {
          setCurrentIndex(prev => Math.max(prev - 1, 0));
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex]);

  return (
    <Container>
      <Subtitle>#pontos</Subtitle>
      <Title>Sua jornada de organização</Title>

      <CarouselContainer ref={containerRef}>
        <NavigationButton 
          direction="left" 
          onClick={() => handleNavigation('left')}
          disabled={currentIndex === 0}
        >
          <img src={setaEsquerda} alt="Anterior" />
        </NavigationButton>

        <ProgressContainer 
          $currentIndex={currentIndex}
          $isDragging={isDragging}
          $dragOffset={dragOffset}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {levels.map((level, index) => {
            const isLocked = index > currentLevel;
            return (
              <LevelCard 
                key={index}
                active={index === currentIndex}
                locked={isLocked}
              >
                {index === currentLevel && (
                  <CurrentLevelTag>Seu nível atual</CurrentLevelTag>
                )}
                {isLocked && (
                  <LockedBadge>🔒 Bloqueado</LockedBadge>
                )}
                <LevelTitle 
                  active={index === currentIndex}
                  locked={isLocked}
                >
                  {level.title}
                </LevelTitle>
                
                <LightningIcon locked={isLocked}>
                  ⚡
                </LightningIcon>
                <Points locked={isLocked}>
                  +{index === currentLevel ? userPoints : level.points}pts
                </Points>
              </LevelCard>
            );
          })}
        </ProgressContainer>

        <NavigationButton 
          direction="right" 
          onClick={() => handleNavigation('right')}
          disabled={currentIndex === levels.length - 1}
        >
          <img src={setaDireita} alt="Próximo" />
        </NavigationButton>
      </CarouselContainer>

      {nextLevel && (
        <NextLevelInfo>
          Consiga mais {pointsToNextLevel}pts para alcançar o próximo nível 🚀
        </NextLevelInfo>
      )}
    </Container>
  );
} 