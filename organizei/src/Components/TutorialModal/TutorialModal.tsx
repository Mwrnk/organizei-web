import { useEffect, useState } from 'react';
import { tutorialSteps, TutorialStep } from './tutorialSteps';
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  StepContent,
  Title,
  Description,
  NavigationArea,
  Button,
  ProgressDots,
  ProgressDot,
  IconText,
  StepNumber,
  CheckboxContainer
} from './styles';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setDontShowAgain(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('tutorialDisabled', 'true');
    }
    onClose();
  };

  const formatDescription = (step: TutorialStep) => {
    if (!step.icon) return step.description;

    let textToMatch = step.title === "Criar nova lista" ? "'+ Nova Lista'" : "lixeira vermelha";
    const parts = step.description.split(textToMatch);
    
    if (parts.length !== 2) return step.description;

    return (
      <>
        {parts[0]}
        <IconText>
          <img 
            src={step.icon} 
            alt={step.title} 
            style={{ 
              width: '20px', 
              height: '20px',
              filter: step.title === "Apagar cards" ? "invert(23%) sepia(100%) saturate(7414%) hue-rotate(357deg) brightness(94%) contrast(111%)" : undefined
            }} 
          />
          {step.title === "Criar nova lista" ? "+ Nova Lista" : "lixeira"}
        </IconText>
        {parts[1]}
      </>
    );
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>✕</CloseButton>

        <StepContent>
          <StepNumber>
            {currentStep + 1} de {tutorialSteps.length}
          </StepNumber>
          <Title>{currentStepData.title}</Title>
          <Description>{formatDescription(currentStepData)}</Description>
        </StepContent>

        <ProgressDots>
          {tutorialSteps.map((_, index) => (
            <ProgressDot
              key={index}
              active={index === currentStep}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </ProgressDots>

        <NavigationArea>
          {!isFirstStep && (
            <Button variant="secondary" onClick={handlePrevious}>
              ← Anterior
            </Button>
          )}

          {isLastStep ? (
            <>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  id="dontShowAgain"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <label htmlFor="dontShowAgain">Não mostrar novamente</label>
              </CheckboxContainer>
              <Button variant="primary" onClick={handleComplete}>
                Concluir ✨
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Próximo →
            </Button>
          )}
        </NavigationArea>
      </ModalContent>
    </ModalOverlay>
  );
} 