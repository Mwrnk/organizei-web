import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000000;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }
`;

export const StepContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  min-height: 120px;
`;

export const StepNumber = styled.div`
  font-size: 14px;
  color: #666666;
  margin-bottom: 4px;
`;

export const Title = styled.h2`
  color: #000000;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

export const Description = styled.p`
  color: #666666;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
`;

export const NavigationArea = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
`;

export const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
      transform: translateY(-2px);
    }
  ` : `
    background: #f5f5f5;
    color: #000000;
    
    &:hover {
      background: #e0e0e0;
      transform: translateY(-2px);
    }
  `}
`;

export const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

export const ProgressDot = styled.button<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

export const IllustrationArea = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  background: #f9f9f9;
  border-radius: 16px;
  padding: 16px;
`;

export const IconText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #000000;
  font-weight: 500;
  margin: 0 4px;
  transition: all 0.2s ease;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: #e0e0e0;
    transform: translateY(-1px);
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  
  label {
    font-size: 14px;
    color: #666666;
    cursor: pointer;
  }
`; 