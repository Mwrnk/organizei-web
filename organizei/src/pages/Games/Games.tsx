import { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../Components/Header";
import { useAuth } from "../../Contexts/AuthContexts";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled, { css } from "styled-components";
import { LoadingScreen } from "../../Components/LoadingScreen";
import { toast } from 'react-toastify';

// Tipos locais
type Tag = {
  _id: string;
  name: string;
};

type Flashcard = {
  _id: string;
  front: string;
  back: string;
  tags: Tag[];
};

type CardType = {
  _id: string;
  title: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
};

type QuizSession = {
  sessionId: string;
  question: QuizQuestion;
  cardTitle: string;
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FlashcardContainer = styled.div`
  perspective: 1000px;
  width: 400px;
  height: 250px;
  margin: 20px auto;
`;

const FlashcardInner = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${({ isFlipped }) =>
    isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"};
  cursor: pointer;
`;

const FlashcardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border: 2px solid #e0e0e0;
`;

const FlashcardFront = styled(FlashcardFace)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const FlashcardBack = styled(FlashcardFace)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
`;

const FlashText = styled.p`
  font-size: 18px;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  font-weight: 500;
`;

const FlashcardStepTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 15px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const GradeButton = styled.button`
  padding: 10px 16px;
  margin: 6px;
  border: none;
  border-radius: 8px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }
`;

const GradeContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const GradeText = styled.p`
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
`;

const FlipInstruction = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  font-style: italic;
`;

// Novos Styled Components para seleção de tipo de criação





const CreationFlowContainer = styled.div`
  display: flex;
  min-height: 70vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  animation: slideIn 0.5s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FlashcardPreview = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const CreationContent = styled.div`
  flex: 1;
  padding: 60px 40px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StepTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #2d3748;
`;

const StepSubtitle = styled.p`
  font-size: 18px;
  color: #718096;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const StepButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  align-self: flex-start;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 20px;
  color: #718096;
  transition: color 0.3s ease;

  &:hover {
    color: #2d3748;
  }
`;

const SearchInput = styled.input`
  width: 89%;
  padding: 16px 20px 16px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e");
  background-position: 16px center;
  background-repeat: no-repeat;
  background-size: 20px;
  position: relative;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23667eea'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e");
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 500;
  }
`;

const CardOption = styled.div`
  padding: 20px 25px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #667eea;
    background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
  }

  &:active {
    transform: translateY(-1px) scale(1.01);
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: linear-gradient(135deg, #667eea, #764ba2, #ffd89b);
    border-radius: 0 3px 3px 0;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
    width: 8px;
  }

  &::after {
    content: "▶";
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #667eea;
    font-size: 16px;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
    right: 15px;
  }
`;

const CardOptionTitle = styled.div`
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardOptionSubtitle = styled.div`
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
  padding-right: 40px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.5s ease;
  width: ${({ progress }) => progress}%;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #718096;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SmallLoadingSpinner = styled(LoadingSpinner)`
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin-right: 10px;
  border-color: #e2e8f0;
  border-left-color: #667eea;
`;

const NameInput = styled.input`
  width: 100%;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 18px;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;



const PreviewCard = styled.div`
  width: 300px;
  height: 200px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #a0aec0;
  position: relative;
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 25px;
    z-index: -1;
    opacity: 0.1;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #718096;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const CreateFirstCardButton = styled(StepButton)`
  margin: 0 auto;
`;

const TagsContainer = styled.div`
  margin-bottom: 20px;
`;

const TagsTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 15px;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  max-height: 200px;
  overflow-y: auto;
`;

const TagItem = styled.div<{ selected: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid ${({ selected }) => (selected ? "#667eea" : "#e2e8f0")};
  background: ${({ selected }) => (selected ? "#667eea" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#2d3748")};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: #667eea;
    background: ${({ selected }) => (selected ? "#5a67d8" : "#f7fafc")};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: "${({ selected }) => (selected ? '✓' : '')}";
    font-size: 12px;
    opacity: ${({ selected }) => (selected ? 1 : 0)};
    transition: opacity 0.3s ease;
  }
`;

const CreateTagButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  background: transparent;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  width: 100%;
  margin-bottom: 20px;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: #f7fafc;
  }
`;

const TagModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const TagModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
`;

const TagModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    border-radius: 2px;
  }
`;

const TagModalInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
`;

const TagModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const TagModalButton = styled.button<{ variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ variant }) =>
    variant === "primary"
      ? `
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
    }
  `
      : `
    background: #f7fafc;
    color: #718096;
    
    &:hover {
      background: #edf2f7;
    }
  `}
`;

const SelectedTagsPreview = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const SelectedTagsTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SelectedTagsCount = styled.span`
  color: #667eea;
  font-weight: 600;
`;

const AllFlashcardsSection = styled.div`
  margin-top: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 2px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FlashcardCount = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const FlashcardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const FlashcardCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #667eea;
    background: #f8fafc;
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const FlashcardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const FlashcardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const FlashcardDate = styled.span`
  font-size: 12px;
  color: #718096;
  background: #f7fafc;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  margin-left: 10px;
`;

const FlashcardContent = styled.div`
  margin-bottom: 20px;
`;

const ContentSection = styled.div`
  margin-bottom: 15px;
`;

const ContentLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const ContentText = styled.div`
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
  background: #f7fafc;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #e2e8f0;
`;

const FlashcardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 15px;
`;

const FlashcardTag = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;



const EmptyFlashcardsState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  border: 2px dashed #e2e8f0;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 12px;
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  color: #718096;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const CreateFirstFlashcardButton = styled(StepButton)`
  margin: 0 auto;
`;

const GameSelectionContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const GameSelectionContent = styled.div`
  background: white;
  border-radius: 30px;
  padding: 60px 40px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 800px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const GameTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const GameSubtitle = styled.p`
  font-size: 20px;
  color: #718096;
  margin-bottom: 50px;
  line-height: 1.6;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const GameCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const GameIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const GameCardTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 15px;
`;

const GameCardDescription = styled.p`
  font-size: 16px;
  color: #718096;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const GameCardFeature = styled.div`
  background: #f7fafc;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  color: #4a5568;
  font-weight: 600;
  border-left: 4px solid #667eea;
`;

const PointsIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
`;

const LightningIcon = styled.span`
  font-size: 18px;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const CardsSelectionArea = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
  margin-top: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(226, 232, 240, 0.3);
    border-radius: 10px;
    margin: 10px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    background-clip: content-box;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px;
`;

// Mensagem visual de feedback
const FeedbackMessage = styled.div<{ type: 'success' | 'error' | 'warning' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideInRight 0.3s ease-out;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;

  background: ${({ type }) => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      case 'error':
        return 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)';
    }
  }};

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Novos Styled Components para o Jogo do Milhão
const QuizContainer = styled.div`
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  border-radius: 20px;
  padding: 40px;
  min-height: 600px;
  color: white;
  position: relative;
  overflow: hidden;
  margin: 20px auto;
  max-width: 1000px;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const QuizHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
`;

const QuizProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  color: #cbd5e0;
  font-size: 14px;
`;

const QuizProgressBar = styled.div`
  width: 200px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const QuizProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const QuizTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const QuizCardTitle = styled.h3`
  font-size: 20px;
  color: #cbd5e0;
  font-weight: 400;
`;

const QuizQuestion = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
`;

const QuestionText = styled.h2`
  font-size: 24px;
  line-height: 1.5;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  position: relative;
  z-index: 1;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionButton = styled.button<{
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  showResult?: boolean;
}>`
  padding: 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: ${({ isSelected, isCorrect, isWrong, showResult }) => {
    if (showResult) {
      if (isCorrect) return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      if (isWrong) return 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
    }
    if (isSelected) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  text-align: left;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: #667eea;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: ${({ showResult }) => showResult ? 1 : 0.8};
  }
`;

const QuizStats = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
`;

const StatItem = styled.div`
  text-align: center;
  color: white;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #cbd5e0;
`;

const QuizResult = styled.div`
  text-align: center;
  padding: 40px;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin-top: 30px;
`;

const ResultTitle = styled.h2<{ isSuccess: boolean }>`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 20px;
  background: ${({ isSuccess }) => 
    isSuccess 
      ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
      : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ResultMessage = styled.p`
  font-size: 20px;
  color: #cbd5e0;
  margin-bottom: 30px;
`;

const QuizSetupSection = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 40px;
  border-radius: 25px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin: 20px auto;
  max-width: 900px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #667eea, #764ba2, #ffd89b);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const QuizSetupTitle = styled.h2`
  font-size: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  font-weight: 800;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const QuizSetupSubtitle = styled.p`
  font-size: 18px;
  color: #718096;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
`;

const QuizSetupForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  z-index: 1;
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 12px;
  color: #2d3748;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuestionAmountSelect = styled.select`
  width: 100%;
  padding: 18px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  font-size: 16px;
  color: #4a5568;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 50px;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
`;

const StartQuizButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 18px 40px;
  border: none;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(5px);
`;

const AnswerExplanation = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #cbd5e0;
  font-size: 16px;
  line-height: 1.6;
`;

const TagFilterContainer = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TagFilterTitle = styled.h4`
  font-size: 16px;
  color: #2d3748;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearFiltersButton = styled.button`
  padding: 6px 12px;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #718096;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    background: #f7fafc;
    color: #4a5568;
  }
`;

const TagSearchContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const TagSearchInput = styled.input`
  width: 97%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TagSearchResults = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  display: ${({ show }) => (show ? 'block' : 'none')};
  border: 1px solid #e2e8f0;
`;

const TagSearchResult = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f7fafc;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const SelectedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 8px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
`;

const SelectedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
`;

const StudyButton = styled.button`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export function Games() {
  const { user } = useAuth();
  const token = localStorage.getItem("authenticacao");

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  usePageLoading(isDataLoading);

  const [showGameSelection, setShowGameSelection] = useState(true);
  const [selectedGame, setSelectedGame] = useState<'flashcards' | 'quiz' | null>(null);

  const [selectedCardId, setSelectedCardId] = useState("");
  const [creationType, setCreationType] = useState<'ai' | 'manual' | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const [tagList, setTagList] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [creationStep, setCreationStep] = useState(0);
  const [newFlashcardName, setNewFlashcardName] = useState("");
  const [createdFlashcard, setCreatedFlashcard] = useState<Flashcard | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCardTitle, setSelectedCardTitle] = useState("");
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [questionAmount, setQuestionAmount] = useState(5);

  // Estado para mensagens de feedback
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  // Estados para o Jogo do Milhão
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizStats, setQuizStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    pointsEarned: 0,
    timeSpent: 0,
    currentQuestion: 1
  });

  // Add new states for tag filtering
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [showTagResults, setShowTagResults] = useState(false);

  // Filter tags based on search term
  const filteredTags = tagList.filter(tag => 
    tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase()) &&
    !activeTagFilters.includes(tag._id)
  );

  // Handle tag search input focus
  const handleTagSearchFocus = () => {
    setShowTagResults(true);
  };

  // Handle clicking outside of tag search
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.tag-search-container')) {
      setShowTagResults(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para mostrar mensagem de feedback
  const showFeedback = (text: string, type: 'success' | 'error' | 'warning') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const loadFlashcards = async () => {
    try {
      const res = await axios.get("http://localhost:3000/flashcards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlashcards(res.data.data);
    } catch (err) {
      console.error("Erro ao carregar flashcards", err);
      showFeedback("Erro ao carregar flashcards", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCards = async () => {
    try {
      const res = await axios.get("http://localhost:3000/cards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Cards recebidos:", res.data.data);
      setCards(
        res.data.data.map((card: { _id?: string; id?: string; title: string }) => ({
          _id: card._id || card.id,
          title: card.title,
        }))
      );
    } catch (err) {
      console.error("Erro ao carregar cards do usuário", err);
      showFeedback("Erro ao carregar cards", "error");
    }
  };

  const loadTags = async () => {
    try {
      console.log('Carregando tags...');
      const res = await axios.get("http://localhost:3000/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Tags recebidas:', res.data);
      
      const formattedTags = res.data.tags.map((tag: Tag) => ({ 
        _id: tag._id, 
        name: tag.name 
      }));
      console.log('Tags formatadas:', formattedTags);
      
      setTagList(formattedTags);
    } catch (err) {
      console.error("Erro ao carregar tags:", err);
      showFeedback("Erro ao carregar tags. Por favor, recarregue a página.", "error");
    }
  };

  const createTagFromModal = async () => {
    if (!newTag.trim()) return;
    try {
      await axios.post(
        "http://localhost:3000/tags",
        { name: newTag.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadTags();

      setNewTag("");
      setShowCreateTagModal(false);
      showFeedback("Tag criada com sucesso!", "success");
    } catch (err: unknown) {
      console.error("Erro ao criar tag", err);
      let message = "Erro desconhecido";
      if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        message = errorObj.response?.data?.message || message;
      }
      showFeedback(`Erro ao criar tag: ${message}`, "error");
    }
  };

  const toggleTagSelection = (tagId: string) => {
    if (!tagId) {
      console.error('Invalid tagId:', tagId);
      return;
    }

    console.log('Toggling tag:', tagId);
    console.log('Current selected tags:', selectedTags);
    
    setSelectedTags((prev: string[]) => {
      const isSelected = prev.includes(tagId);
      const newTags = isSelected
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId];
      
      console.log('New selected tags:', newTags);
      return newTags;
    });
  };

  const resetPartialCreationFlow = () => {
    // Reset all fields to start a new flashcard from the beginning
    setCreationStep(0);
    setSelectedCardId("");
    setSelectedCardTitle("");
    setNewFlashcardName("");
    setCreatedFlashcard(null);
    setSearchTerm("");
    setIsCreating(false);
    setSelectedTags([]);
    setCreationType(null);
    setFront("");
    setBack("");
  };

  const getProgressPercentage = () => {
    switch (creationStep) {
      case 0:
        return 0;
      case 1:
        return 20;
      case 2:
        return 40;
      case 3:
        return 60;
      case 4:
        return 80;
      case 5:
        return 100;
      default:
        return 0;
    }
  };

  const createManualFlashcard = async () => {
    console.log('Creating manual flashcard with:', {
      selectedCardId,
      front,
      back,
      selectedTags,
      tagList,
      token
    });

    // Validação detalhada
    if (!selectedCardId) {
      showFeedback("Por favor, selecione um card", "warning");
      return;
    }
    if (!front.trim()) {
      showFeedback("Por favor, preencha a frente do flashcard", "warning");
      return;
    }
    if (!back.trim()) {
      showFeedback("Por favor, preencha o verso do flashcard", "warning");
      return;
    }
    if (selectedTags.length === 0) {
      showFeedback("Por favor, selecione pelo menos uma tag", "warning");
      return;
    }
    if (!token) {
      showFeedback("Erro de autenticação. Por favor, faça login novamente", "error");
      return;
    }

    setIsCreating(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/flashcards",
        {
          cardId: selectedCardId,
          front: front.trim(),
          back: back.trim(),
          tags: selectedTags,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Manual flashcard creation response:', response.data);

      const newFlashcard: Flashcard = {
        _id: response.data.data._id || Date.now().toString(),
        front: front.trim(),
        back: back.trim(),
        tags: selectedTags.map((tagId) => {
          const tag = tagList.find((t) => t._id === tagId);
          return tag ? tag : { _id: tagId, name: tagId };
        }),
      };

      setCreatedFlashcard(newFlashcard);
      loadFlashcards();
      showFeedback("Flashcard criado com sucesso! Você pode criar outro flashcard.", "success");
      resetPartialCreationFlow();
    } catch (error: unknown) {
      console.error("Erro ao criar flashcard manualmente:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        console.error('Response error:', axiosError.response?.data);
        showFeedback(`Erro ao criar flashcard: ${axiosError.response?.data?.message || 'Erro desconhecido'}`, "error");
      } else {
        showFeedback("Erro ao criar flashcard. Por favor, tente novamente.", "error");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const createFlashcardFromFlow = async () => {
    console.log('Creating AI flashcard with:', {
      selectedCardId,
      newFlashcardName,
      selectedTags,
      tagList,
      token
    });

    // Validação detalhada
    if (!selectedCardId) {
      showFeedback("Por favor, selecione um card", "warning");
      return;
    }
    if (!newFlashcardName.trim()) {
      showFeedback("Por favor, preencha o nome do flashcard", "warning");
      return;
    }
    if (selectedTags.length === 0) {
      showFeedback("Por favor, selecione pelo menos uma tag", "warning");
      return;
    }
    if (!token) {
      showFeedback("Erro de autenticação. Por favor, faça login novamente", "error");
      return;
    }

    setIsCreating(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/flashcards/withAI`,
        {
          cardId: selectedCardId,
          amount: 1,
          tags: selectedTags,
          title: newFlashcardName.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('AI flashcard creation response:', response.data);

      const flashcardData = response.data.data[0] || response.data.data;
      const newFlashcard: Flashcard = {
        _id: flashcardData._id || Date.now().toString(),
        front: flashcardData.front || newFlashcardName.trim(),
        back: flashcardData.back || "Resposta gerada pela IA",
        tags: selectedTags.map((tagId) => {
          const tag = tagList.find((t) => t._id === tagId);
          return tag ? tag : { _id: tagId, name: tagId };
        }),
      };

      setCreatedFlashcard(newFlashcard);
      loadFlashcards();
      showFeedback("Flashcard criado com sucesso usando IA! Você pode criar outro flashcard.", "success");
      resetPartialCreationFlow();
    } catch (error: unknown) {
      console.error("Erro ao criar flashcard com IA:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        console.error('Response error:', axiosError.response?.data);
        showFeedback(`Erro ao criar flashcard: ${axiosError.response?.data?.message || 'Erro desconhecido'}`, "error");
      } else {
        showFeedback("Erro ao criar flashcard. Por favor, tente novamente.", "error");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Funções do Jogo do Milhão
  const resetQuiz = () => {
    setQuizSession(null);
    setSelectedAnswer(null);
    setShowQuizResult(false);
    setIsCorrect(false);
    setCorrectAnswerIndex(null);
    setCurrentCardId(null);
    setQuizStats({
      totalQuestions: questionAmount,
      correctAnswers: 0,
      pointsEarned: 0,
      timeSpent: 0,
      currentQuestion: 1
    });
  };

  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false);

  const startQuiz = async (cardId: string) => {
    setIsLoadingQuiz(true);
    setCurrentCardId(cardId);
    try {
      const response = await axios.post(
        `http://localhost:3000/quiz/start/${cardId}`,
        { amount: questionAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuizSession(response.data.data);
      setSelectedAnswer(null);
      setShowQuizResult(false);
      setIsCorrect(false);
      setCorrectAnswerIndex(null);
      setQuizStats({
        totalQuestions: questionAmount,
        correctAnswers: 0,
        pointsEarned: 0,
        timeSpent: 0,
        currentQuestion: 1
      });
    } catch (error: any) {
      console.error('Erro ao iniciar quiz:', error);
      
      if (error.response?.status === 404) {
        toast.error('Quiz não encontrado. Verifique se o card selecionado existe.');
      } else if (error.response?.data?.message?.includes('active session')) {
        toast.warning('Você já tem uma sessão de quiz ativa. Por favor, aguarde alguns minutos ou tente novamente mais tarde.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
      } else {
        toast.error('Erro ao iniciar o quiz. Por favor, tente novamente.');
      }
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!currentCardId) return;
    
    setIsLoadingNextQuestion(true);
    try {
      // Se ainda há perguntas restantes
      if (quizStats.currentQuestion <= quizStats.totalQuestions) {
        // Inicia uma nova sessão para a próxima pergunta
        const response = await axios.post(
          `http://localhost:3000/quiz/start/${currentCardId}`,
          { amount: questionAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setQuizSession(response.data.data);
        setSelectedAnswer(null);
        setShowQuizResult(false);
      }
    } catch (error: any) {
      console.error('Erro ao carregar próxima pergunta:', error);
      if (error.response?.status === 404) {
        toast.error('Quiz não encontrado. Por favor, inicie um novo jogo.');
        resetQuiz();
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
      } else {
        toast.error('Erro ao carregar próxima pergunta. Por favor, tente novamente.');
      }
    } finally {
      setIsLoadingNextQuestion(false);
    }
  };

  const [isAnswering, setIsAnswering] = useState(false);

  const answerQuestion = async () => {
    if (selectedAnswer === null || !quizSession) return;
    setIsAnswering(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/quiz/answer/${quizSession.sessionId}`,
        {
          answer: selectedAnswer,
          timeSpent: 30 // You can implement a timer if needed
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = response.data.data;
      setIsCorrect(result.isCorrect);
      setCorrectAnswerIndex(result.correctAnswer);
      setShowQuizResult(true);

      setQuizStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + (result.isCorrect ? 1 : 0),
        pointsEarned: prev.pointsEarned + (result.pointsEarned || 0),
        currentQuestion: prev.currentQuestion + 1
      }));

      if (result.isCorrect) {
        toast.success(`Resposta correta! +${result.pointsEarned} pontos`);
      } else {
        toast.info(`Resposta incorreta. A resposta correta era: ${quizSession.question.options[result.correctAnswer]}`);
      }
    } catch (error: any) {
      console.error('Erro ao responder pergunta:', error);
      
      if (error.response?.status === 404) {
        toast.error('Sessão não encontrada. Por favor, inicie um novo quiz.');
        resetQuiz();
      } else if (error.response?.status === 400) {
        toast.error('Resposta inválida. Por favor, tente novamente.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
      } else {
        toast.error('Erro ao processar resposta. Por favor, tente novamente.');
      }
    } finally {
      setIsAnswering(false);
    }
  };

  const renderGameSelection = () => {
    return (
      <>
        <Header />
        <GameSelectionContainer>
          <GameSelectionContent>
            <GameTitle>O que vai jogar hoje?</GameTitle>
            <GameSubtitle>
              <LightningIcon>⚡</LightningIcon>
              30pts
            </GameSubtitle>
            
            <GamesGrid>
              <GameCard onClick={() => {
                setShowGameSelection(false);
                setSelectedGame('flashcards');
              }}>
                <GameIcon>🎴</GameIcon>
                <GameCardTitle>Flash Cards</GameCardTitle>
                <GameCardDescription>
                  Perguntas geradas por IA com o tema da matéria escolhida...
                </GameCardDescription>
                <GameCardFeature>
                  Teste seus conhecimentos
                </GameCardFeature>
                <PointsIndicator>
                  <LightningIcon>⚡</LightningIcon>
                  Ganhe pontos por acerto
                </PointsIndicator>
              </GameCard>

              <GameCard onClick={() => {
                setShowGameSelection(false);
                setSelectedGame('quiz');
              }}>
                <GameIcon>💰</GameIcon>
                <GameCardTitle>Jogo do milhão</GameCardTitle>
                <GameCardDescription>
                  Inúmeras perguntas com temas diversos.
                </GameCardDescription>
                <GameCardFeature>
                  Desafie seus limites
                </GameCardFeature>
                <PointsIndicator>
                  <LightningIcon>⚡</LightningIcon>
                  Recompensas especiais
                </PointsIndicator>
              </GameCard>
            </GamesGrid>
          </GameSelectionContent>
        </GameSelectionContainer>
      </>
    );
  };

  const renderOptions = () => {
    if (!quizSession?.question.options) return null;

    return (
      <>
        <OptionsGrid>
          {quizSession.question.options.map((option, index) => (
            <OptionButton
              key={index}
              isSelected={selectedAnswer === index}
              isCorrect={showQuizResult && correctAnswerIndex === index}
              isWrong={showQuizResult && selectedAnswer === index && selectedAnswer !== correctAnswerIndex}
              showResult={showQuizResult}
              onClick={() => !showQuizResult && setSelectedAnswer(index)}
              disabled={showQuizResult}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ 
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  background: selectedAnswer === index ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </div>
            </OptionButton>
          ))}
        </OptionsGrid>
        
        {showQuizResult && (
          <AnswerExplanation>
            <p style={{ marginBottom: '10px' }}>
              {isCorrect ? (
                <span style={{ color: '#48bb78' }}>✓ Parabéns! Você acertou!</span>
              ) : (
                <>
                  <span style={{ color: '#f56565' }}>✗ Resposta incorreta.</span>
                  <br />
                  <strong>A resposta correta era:</strong>
                  <br />
                  Alternativa {String.fromCharCode(65 + (correctAnswerIndex || 0))}: {quizSession.question.options[correctAnswerIndex || 0]}
                </>
              )}
            </p>
          </AnswerExplanation>
        )}
      </>
    );
  };

  const renderQuiz = () => {
    if (!quizSession && !isLoadingQuiz) {
      return (
        <>
          <Header />
          <Container>
            <BackButton onClick={() => {
              setSelectedGame(null);
              setShowGameSelection(true);
            }}>
              ← Voltar
            </BackButton>

            <QuizSetupSection>
              <QuizSetupTitle>💰 Configurar Quiz</QuizSetupTitle>
              <QuizSetupSubtitle>
                Escolha a quantidade de perguntas e selecione um card para começar sua jornada rumo ao milhão!
              </QuizSetupSubtitle>
              
              <QuizSetupForm>
                <FormSection>
                  <FormLabel htmlFor="questionAmount">
                    🎯 Quantidade de Perguntas
                  </FormLabel>
                  <QuestionAmountSelect
                    id="questionAmount"
                    value={questionAmount}
                    onChange={(e) => setQuestionAmount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} pergunta{num > 1 ? 's' : ''}</option>
                    ))}
                  </QuestionAmountSelect>
                </FormSection>

                <FormSection>
                  <FormLabel>
                    🔍 Selecionar Card
                  </FormLabel>
                  <SearchInput
                    placeholder="🔍 Pesquisar cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <CardsSelectionArea>
                    <CardsContainer>
                      {cards.length === 0 ? (
                        <EmptyFlashcardsState style={{ 
                          margin: '20px 0',
                          padding: '40px 20px',
                          border: '2px dashed rgba(102, 126, 234, 0.3)'
                        }}>
                          <EmptyIcon>📚</EmptyIcon>
                          <EmptyTitle style={{ fontSize: '20px', marginBottom: '8px' }}>
                            Nenhum card disponível
                          </EmptyTitle>
                          <EmptyDescription style={{ fontSize: '14px', marginBottom: '20px' }}>
                            Você precisa criar cards na seção Escolar antes de jogar.
                          </EmptyDescription>
                          <CreateFirstFlashcardButton
                            onClick={() => (window.location.href = "/escolar")}
                            style={{ padding: '12px 24px', fontSize: '14px' }}
                          >
                            Ir para Escolar
                          </CreateFirstFlashcardButton>
                        </EmptyFlashcardsState>
                      ) : cards
                          .filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()))
                          .length === 0 ? (
                        <EmptyFlashcardsState style={{ 
                          margin: '20px 0',
                          padding: '40px 20px',
                          border: '2px dashed rgba(102, 126, 234, 0.3)'
                        }}>
                          <EmptyIcon>🔍</EmptyIcon>
                          <EmptyTitle style={{ fontSize: '20px', marginBottom: '8px' }}>
                            Nenhum card encontrado
                          </EmptyTitle>
                          <EmptyDescription style={{ fontSize: '14px', marginBottom: '0' }}>
                            Tente pesquisar com outros termos ou verifique a ortografia.
                          </EmptyDescription>
                        </EmptyFlashcardsState>
                      ) : (
                        cards
                          .filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((card) => (
                            <CardOption
                              key={card._id}
                              onClick={() => startQuiz(card._id)}
                            >
                              <CardOptionTitle>🎴 {card.title}</CardOptionTitle>
                              <CardOptionSubtitle>
                                💎 Iniciar quiz com {questionAmount} pergunta{questionAmount > 1 ? 's' : ''} • Ganhe pontos por cada acerto!
                              </CardOptionSubtitle>
                            </CardOption>
                          ))
                      )}
                    </CardsContainer>
                  </CardsSelectionArea>
                </FormSection>
              </QuizSetupForm>
            </QuizSetupSection>
          </Container>
        </>
      );
    }

    return (
      <>
        <Header />
        <Container>
          <BackButton onClick={resetQuiz}>
            ← Voltar
          </BackButton>

          <QuizContainer>
            {isLoadingQuiz ? (
                              <LoadingOverlay>
                  <SmallLoadingSpinner />
                </LoadingOverlay>
            ) : (
              <>
                <QuizHeader>
                  <QuizTitle>Jogo do Milhão</QuizTitle>
                  <QuizCardTitle>{quizSession?.cardTitle}</QuizCardTitle>
                  <QuizProgress>
                    <span>Pergunta {quizStats.currentQuestion} de {quizStats.totalQuestions}</span>
                    <QuizProgressBar>
                      <QuizProgressFill 
                        progress={(quizStats.currentQuestion / quizStats.totalQuestions) * 100} 
                      />
                    </QuizProgressBar>
                  </QuizProgress>
                </QuizHeader>

                <QuizStats>
                  <StatItem>
                    <StatValue>{quizStats.correctAnswers}</StatValue>
                    <StatLabel>Acertos</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{quizStats.pointsEarned}</StatValue>
                    <StatLabel>Pontos</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>
                      {Math.round((quizStats.correctAnswers / (quizStats.currentQuestion - 1)) * 100 || 0)}%
                    </StatValue>
                    <StatLabel>Taxa de Acerto</StatLabel>
                  </StatItem>
                </QuizStats>

                {!showQuizResult ? (
                  <>
                    <QuizQuestion>
                      <QuestionText>{quizSession?.question.question}</QuestionText>
                    </QuizQuestion>

                    <OptionsGrid>
                      {quizSession?.question.options.map((option, index) => (
                        <OptionButton
                          key={index}
                          isSelected={selectedAnswer === index}
                          onClick={() => !showQuizResult && setSelectedAnswer(index)}
                          disabled={showQuizResult}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ 
                              minWidth: '24px',
                              height: '24px',
                              borderRadius: '12px',
                              background: selectedAnswer === index ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px'
                            }}>
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </div>
                        </OptionButton>
                      ))}
                    </OptionsGrid>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <OptionButton
                        onClick={answerQuestion}
                        disabled={selectedAnswer === null || isAnswering}
                        style={{
                          width: 'auto',
                          padding: '15px 30px',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: '600',
                          opacity: isAnswering ? 0.7 : 1,
                          cursor: isAnswering ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isAnswering ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <SmallLoadingSpinner />
                            Enviando resposta...
                          </div>
                        ) : (
                          selectedAnswer === null ? 'Escolha uma opção' : 'Confirmar Resposta'
                        )}
                      </OptionButton>
                    </div>
                  </>
                ) : (
                  <QuizResult>
                    <ResultTitle isSuccess={isCorrect}>
                      {isCorrect ? '🎉 Parabéns!' : '😔 Que pena!'}
                    </ResultTitle>
                    <ResultMessage>
                      {isCorrect 
                        ? 'Você acertou! Continue assim!' 
                        : `A resposta correta era a opção ${String.fromCharCode(65 + (correctAnswerIndex || 0))}`
                      }
                    </ResultMessage>
                    
                    {quizStats.currentQuestion > quizStats.totalQuestions ? (
                      <>
                        <div style={{ marginBottom: '20px' }}>
                          <h3 style={{ color: '#cbd5e0', marginBottom: '15px' }}>Resultado Final</h3>
                          <p>Total de perguntas: {quizStats.totalQuestions}</p>
                          <p>Acertos: {quizStats.correctAnswers}</p>
                          <p>Taxa de acerto: {Math.round((quizStats.correctAnswers / quizStats.totalQuestions) * 100)}%</p>
                          <p>Pontos ganhos: {quizStats.pointsEarned}</p>
                        </div>
                        <StartQuizButton onClick={resetQuiz}>
                          Jogar Novamente
                        </StartQuizButton>
                      </>
                    ) : (
                      <StartQuizButton 
                        onClick={handleNextQuestion}
                        disabled={isLoadingNextQuestion}
                      >
                        {isLoadingNextQuestion ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <SmallLoadingSpinner />
                            Carregando próxima pergunta...
                          </div>
                        ) : (
                          'Próxima Pergunta'
                        )}
                      </StartQuizButton>
                    )}
                  </QuizResult>
                )}
              </>
            )}
          </QuizContainer>
        </Container>
      </>
    );
  };

  const renderCreationStep = () => {
    switch (creationStep) {
      case 0:
        return (
          <CreationFlowContainer>
            <FlashcardPreview>
              <PreviewCard>{cards.length === 0 ? "📚" : "?"}</PreviewCard>
            </FlashcardPreview>
            <CreationContent>
              <ProgressBar>
                <ProgressFill progress={getProgressPercentage()} />
              </ProgressBar>
              <StepIndicator>Passo 1 de 5</StepIndicator>
              <StepTitle>
                Uma nova forma de{" "}
                <span style={{ color: "#667eea" }}>aprender</span>!
              </StepTitle>
              <StepSubtitle>
                Acerte e ganhe <strong>+pontos</strong> e depois troque eles!
              </StepSubtitle>
              {cards.length === 0 ? (
                <EmptyState>
                  <EmptyStateIcon>📝</EmptyStateIcon>
                  <EmptyStateText>
                    Você precisa criar pelo menos um card na seção Escolar antes
                    de criar flashcards.
                  </EmptyStateText>
                  <CreateFirstCardButton
                    onClick={() => (window.location.href = "/escolar")}
                  >
                    Ir para Escolar
                  </CreateFirstCardButton>
                </EmptyState>
              ) : (
                <StepButton onClick={() => setCreationStep(1)}>
                  🚀 Criar Flashcards
                </StepButton>
              )}
            </CreationContent>
          </CreationFlowContainer>
        );

      case 1:
        return (
          <CreationFlowContainer>
            <FlashcardPreview>
              <PreviewCard>🤔</PreviewCard>
            </FlashcardPreview>
            <CreationContent>
              <ProgressBar>
                <ProgressFill progress={getProgressPercentage()} />
              </ProgressBar>
              <StepIndicator>Passo 2 de 5</StepIndicator>
              <BackButton onClick={() => setCreationStep(0)}>← Voltar</BackButton>
              <StepTitle>Como deseja criar?</StepTitle>
              <StepSubtitle>Escolha o método de criação dos flashcards</StepSubtitle>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <button
                  onClick={() => setCreationType('ai')}
                  style={{
                    flex: 1,
                    padding: '30px',
                    borderRadius: '15px',
                    border: '2px solid #667eea',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                  }}
                >
                  <div style={{ fontSize: '40px' }}>🤖</div>
                  <h3 style={{ fontSize: '20px', margin: 0 }}>Criar com IA</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, textAlign: 'center' }}>
                    Deixe a IA gerar perguntas e respostas automaticamente baseadas no seu card
                  </p>
                </button>

                <button
                  onClick={() => setCreationType('manual')}
                  style={{
                    flex: 1,
                    padding: '30px',
                    borderRadius: '15px',
                    border: '2px solid #4facfe',
                    background: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                  }}
                >
                  <div style={{ fontSize: '40px' }}>✍️</div>
                  <h3 style={{ fontSize: '20px', margin: 0 }}>Criar Manualmente</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, textAlign: 'center' }}>
                    Crie suas próprias perguntas e respostas personalizadas
                  </p>
                </button>
              </div>

              {creationType && (
                <StepButton onClick={() => setCreationStep(2)}>
                  Próximo: Selecionar Card
                </StepButton>
              )}
            </CreationContent>
          </CreationFlowContainer>
        );

      case 2:
        return (
          <CreationFlowContainer>
            <FlashcardPreview>
              <PreviewCard>{selectedCardTitle ? "📋" : "?"}</PreviewCard>
            </FlashcardPreview>
            <CreationContent>
              <ProgressBar>
                <ProgressFill progress={getProgressPercentage()} />
              </ProgressBar>
              <StepIndicator>Passo 3 de 5</StepIndicator>
              <BackButton onClick={() => setCreationStep(1)}>← Voltar</BackButton>
              <StepTitle>Qual card?</StepTitle>
              <StepSubtitle>
                Escolha o card que irá servir de base para as perguntas.
              </StepSubtitle>
              <SearchInput
                placeholder="🔍 Pesquisar cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {cards.length === 0 ? (
                <EmptyState>
                  <EmptyStateText>
                    {searchTerm
                      ? "Nenhum card encontrado com esse termo."
                      : "Nenhum card disponível."}
                  </EmptyStateText>
                </EmptyState>
              ) : (
                <CardsSelectionArea>
                  <CardsContainer>
                    {cards
                      .filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((card) => (
                        <CardOption
                          key={card._id}
                          onClick={() => {
                            setSelectedCardId(card._id);
                            setSelectedCardTitle(card.title);
                            setCreationStep(3);
                          }}
                        >
                          <CardOptionTitle>{card.title}</CardOptionTitle>
                          <CardOptionSubtitle>
                            Clique para selecionar este card
                          </CardOptionSubtitle>
                        </CardOption>
                      ))}
                  </CardsContainer>
                </CardsSelectionArea>
              )}
            </CreationContent>
          </CreationFlowContainer>
        );

      case 3:
        return (
          <CreationFlowContainer>
            <FlashcardPreview>
              <PreviewCard
                style={{
                  fontSize: "24px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {creationType === 'manual' ? (
                  <div style={{ fontSize: '18px' }}>
                    <div>Frente: {front || "Digite a pergunta..."}</div>
                    <div style={{ marginTop: '10px' }}>Verso: {back || "Digite a resposta..."}</div>
                  </div>
                ) : (
                  newFlashcardName || "Digite o nome..."
                )}
              </PreviewCard>
            </FlashcardPreview>
            <CreationContent>
              <ProgressBar>
                <ProgressFill progress={getProgressPercentage()} />
              </ProgressBar>
              <StepIndicator>Passo 4 de 5</StepIndicator>
              <BackButton onClick={() => setCreationStep(2)}>← Voltar</BackButton>
              
              {creationType === 'manual' ? (
                <>
                  <StepTitle>Criar Flashcard Manual</StepTitle>
                  <StepSubtitle>
                    Digite a pergunta e a resposta do seu flashcard
                  </StepSubtitle>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <ContentLabel>Frente (Pergunta)</ContentLabel>
                    <TagModalInput
                      placeholder="Digite a pergunta..."
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <ContentLabel>Verso (Resposta)</ContentLabel>
                    <TagModalInput
                      placeholder="Digite a resposta..."
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <StepTitle>Nome do Flashcard</StepTitle>
                  <StepSubtitle>
                    Digite um nome ou tema para gerar o flashcard com IA
                  </StepSubtitle>
                  <NameInput
                    placeholder="Ex: O que é fotossíntese?"
                    value={newFlashcardName}
                    onChange={(e) => setNewFlashcardName(e.target.value)}
                  />
                </>
              )}

              <StepButton
                onClick={() => setCreationStep(4)}
                disabled={creationType === 'manual' ? !front.trim() || !back.trim() : !newFlashcardName.trim()}
              >
                {creationType === 'manual' 
                  ? ((!front.trim() || !back.trim()) ? '⚠️ Preencha todos os campos' : 'Próximo: Selecionar Tags')
                  : (!newFlashcardName.trim() ? '⚠️ Digite um nome' : 'Próximo: Selecionar Tags')
                }
              </StepButton>
            </CreationContent>
          </CreationFlowContainer>
        );

      case 4:
        return (
          <CreationFlowContainer>
            <FlashcardPreview>
              <PreviewCard>
                {creationType === 'manual' ? (
                  <div style={{ fontSize: '18px' }}>
                    <div>Frente: {front}</div>
                    <div style={{ marginTop: '10px' }}>Verso: {back}</div>
                  </div>
                ) : (
                  newFlashcardName
                )}
              </PreviewCard>
            </FlashcardPreview>
            <CreationContent>
              <ProgressBar>
                <ProgressFill progress={getProgressPercentage()} />
              </ProgressBar>
              <StepIndicator>Passo 5 de 5</StepIndicator>
              <BackButton onClick={() => setCreationStep(3)}>← Voltar</BackButton>
              <StepTitle>Selecionar Tags</StepTitle>
              <StepSubtitle>
                Escolha as tags que melhor descrevem seu flashcard
              </StepSubtitle>

              <TagsContainer>
                <CreateTagButton onClick={() => setShowCreateTagModal(true)}>
                  ➕ Criar Nova Tag
                </CreateTagButton>

                {tagList.length === 0 ? (
                  <EmptyState>
                    <EmptyStateText>
                      Nenhuma tag disponível. Crie sua primeira tag!
                    </EmptyStateText>
                  </EmptyState>
                ) : (
                  <>
                    <TagsTitle>Tags Disponíveis:</TagsTitle>
                    <TagsList>
                      {tagList.map((tag) => (
                        <TagItem
                          key={tag._id}
                          selected={selectedTags.includes(tag._id)}
                          onClick={() => toggleTagSelection(tag._id)}
                        >
                          {tag.name}
                          {selectedTags.includes(tag._id) && (
                            <span style={{ fontSize: '12px', marginLeft: 'auto' }}>✓</span>
                          )}
                        </TagItem>
                      ))}
                    </TagsList>
                  </>
                )}

                {selectedTags.length > 0 ? (
                  <SelectedTagsPreview>
                    <SelectedTagsTitle>
                      <SelectedTagsCount>
                        {selectedTags.length}
                      </SelectedTagsCount>{" "}
                      tag(s) selecionada(s)
                    </SelectedTagsTitle>
                    <TagsList>
                      {selectedTags.map((tagId) => {
                        const tag = tagList.find((t) => t._id === tagId);
                        return tag ? (
                          <TagItem key={tagId} selected={true}>
                            {tag.name}
                            <span style={{ fontSize: '12px', marginLeft: 'auto' }}>✓</span>
                          </TagItem>
                        ) : null;
                      })}
                    </TagsList>
                  </SelectedTagsPreview>
                ) : (
                  <div style={{ 
                    padding: '12px', 
                    background: '#FEF2F2', 
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    color: '#991B1B',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px'
                  }}>
                    ⚠️ Selecione pelo menos uma tag para continuar
                  </div>
                )}
              </TagsContainer>

              <StepButton
                onClick={creationType === 'manual' ? createManualFlashcard : createFlashcardFromFlow}
                disabled={selectedTags.length === 0 || isCreating}
                style={{
                  opacity: selectedTags.length === 0 ? 0.6 : 1,
                  cursor: selectedTags.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                                  {isCreating ? (
                    <>
                      <SmallLoadingSpinner />
                      {creationType === 'manual' ? 'Criando...' : 'Criando com IA...'}
                    </>
                  ) : (
                  <>
                    {selectedTags.length === 0 ? '⚠️ Selecione pelo menos uma tag' : (
                      creationType === 'manual' ? '✍️ Finalizar Criação Manual' : '🤖 Finalizar e Gerar com IA'
                    )}
                  </>
                )}
              </StepButton>
            </CreationContent>
          </CreationFlowContainer>
        );

      default:
        return null;
    }
  };

  const handleGrade = async (grade: number) => {
    const current = flashcards[currentIndex];
    try {
      await axios.patch(
        `http://localhost:3000/flashcards/doreview/${current._id}`,
        { grade },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowBack(false);
      setCurrentIndex((prev) => prev + 1);
      showFeedback(`Flashcard avaliado com nota ${grade}`, "success");
    } catch (err) {
      console.error("Erro ao avaliar", err);
      showFeedback("Erro ao avaliar flashcard", "error");
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (token && user) {
        setIsDataLoading(true);
        try {
          await Promise.all([
            loadFlashcards(),
            loadCards(),
            loadTags()
          ]);
        } catch (error) {
          console.error('Erro ao carregar dados iniciais:', error);
        } finally {
          setIsDataLoading(false);
        }
      }
    };

    loadInitialData();
  }, [token, user]);

  // Add new functions for tag filtering
  const toggleTagFilter = (tagId: string) => {
    setActiveTagFilters(prev => {
      const isActive = prev.includes(tagId);
      return isActive ? prev.filter(id => id !== tagId) : [...prev, tagId];
    });
  };

  const clearTagFilters = () => {
    setActiveTagFilters([]);
  };

  // Update filtered flashcards when filters or flashcards change
  useEffect(() => {
    if (activeTagFilters.length === 0) {
      setFilteredFlashcards(flashcards);
    } else {
      const filtered = flashcards.filter(flashcard => 
        flashcard.tags.some(tag => 
          activeTagFilters.includes(typeof tag === 'object' ? tag._id : tag)
        )
      );
      setFilteredFlashcards(filtered);
    }
  }, [activeTagFilters, flashcards]);

  // Function to start studying filtered flashcards
  const startStudyMode = () => {
    setStudyMode(true);
    setStudyIndex(0);
    setShowBack(false);
  };

  // Function to exit study mode
  const exitStudyMode = () => {
    setStudyMode(false);
    setStudyIndex(0);
    setShowBack(false);
  };

  // Function to handle next flashcard in study mode
  const handleNextStudyCard = () => {
    if (studyIndex < filteredFlashcards.length - 1) {
      setStudyIndex(prev => prev + 1);
      setShowBack(false);
    } else {
      exitStudyMode();
    }
  };

  if (isLoading)
    return (
      <Container>
        <LoadingScreen isVisible={true} />
      </Container>
    );

  const current = flashcards[currentIndex];

  // Renderizar o Jogo do Milhão se estiver selecionado
  if (selectedGame === 'quiz') {
    return renderQuiz();
  }

  return (
    <>
      {feedbackMessage && (
        <FeedbackMessage type={feedbackMessage.type}>
          {feedbackMessage.type === 'success' && '✅'}
          {feedbackMessage.type === 'error' && '❌'}
          {feedbackMessage.type === 'warning' && '⚠️'}
          {feedbackMessage.text}
        </FeedbackMessage>
      )}

      {showGameSelection ? (
        renderGameSelection()
      ) : (
        <>
          <Header />
          <Container style={{ padding: '0 20px' }}>
            <BackButton onClick={() => {
              setShowGameSelection(true);
              setSelectedGame(null);
              resetPartialCreationFlow();
            }}>
              ← Voltar para seleção de jogos
            </BackButton>

            {!studyMode ? (
              <>
                {renderCreationStep()}

                {showCreateTagModal && (
                  <TagModal onClick={() => setShowCreateTagModal(false)}>
                    <TagModalContent onClick={(e) => e.stopPropagation()}>
                      <TagModalTitle>Criar Nova Tag</TagModalTitle>
                      <TagModalInput
                        placeholder="Digite o nome da nova tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && createTagFromModal()}
                      />
                      <TagModalButtons>
                        <TagModalButton
                          variant="secondary"
                          onClick={() => setShowCreateTagModal(false)}
                        >
                          Cancelar
                        </TagModalButton>
                        <TagModalButton variant="primary" onClick={createTagFromModal}>
                          Criar Tag
                        </TagModalButton>
                      </TagModalButtons>
                    </TagModalContent>
                  </TagModal>
                )}

                <AllFlashcardsSection>
                  <SectionHeader>
                    <SectionTitle>
                      📚 Seus Flashcards
                      <FlashcardCount>
                        {activeTagFilters.length > 0 
                          ? `${filteredFlashcards.length} filtrados` 
                          : flashcards.length}
                      </FlashcardCount>
                    </SectionTitle>
                  </SectionHeader>

                  <TagFilterContainer>
                    <TagFilterTitle>
                      🏷️ Filtrar por Tags
                      {activeTagFilters.length > 0 && (
                        <ClearFiltersButton onClick={clearTagFilters}>
                          Limpar Filtros
                        </ClearFiltersButton>
                      )}
                    </TagFilterTitle>

                    <TagSearchContainer className="tag-search-container">
                      <TagSearchInput
                        placeholder="🔍 Buscar tags..."
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                        onFocus={handleTagSearchFocus}
                      />

                      {activeTagFilters.length > 0 && (
                        <SelectedTagsContainer>
                          {activeTagFilters.map(tagId => {
                            const tag = tagList.find(t => t._id === tagId);
                            return tag ? (
                              <SelectedTag key={tag._id}>
                                {tag.name}
                                <button onClick={() => toggleTagFilter(tag._id)}>×</button>
                              </SelectedTag>
                            ) : null;
                          })}
                        </SelectedTagsContainer>
                      )}

                      <TagSearchResults show={showTagResults && filteredTags.length > 0}>
                        {filteredTags.map(tag => (
                          <TagSearchResult
                            key={tag._id}
                            onClick={() => {
                              toggleTagFilter(tag._id);
                              setTagSearchTerm("");
                              setShowTagResults(false);
                            }}
                          >
                            <span>🏷️</span>
                            {tag.name}
                          </TagSearchResult>
                        ))}
                      </TagSearchResults>
                    </TagSearchContainer>
                  </TagFilterContainer>

                  {filteredFlashcards.length === 0 ? (
                    <EmptyFlashcardsState>
                      <EmptyIcon>🎴</EmptyIcon>
                      <EmptyTitle>
                        {activeTagFilters.length > 0 
                          ? 'Nenhum flashcard encontrado com os filtros selecionados' 
                          : 'Nenhum flashcard criado ainda'}
                      </EmptyTitle>
                      <EmptyDescription>
                        {activeTagFilters.length > 0 
                          ? 'Tente selecionar outras tags ou limpar os filtros.'
                          : 'Crie seu primeiro flashcard usando o fluxo step-by-step acima.'}
                      </EmptyDescription>
                      {activeTagFilters.length > 0 ? (
                        <CreateFirstFlashcardButton onClick={clearTagFilters}>
                          Limpar Filtros
                        </CreateFirstFlashcardButton>
                      ) : (
                        <CreateFirstFlashcardButton onClick={() => setCreationStep(0)}>
                          🚀 Criar Primeiro Flashcard
                        </CreateFirstFlashcardButton>
                      )}
                    </EmptyFlashcardsState>
                  ) : (
                    <>
                      {activeTagFilters.length > 0 && (
                        <div style={{ 
                          textAlign: 'center', 
                          marginBottom: '20px' 
                        }}>
                          <StudyButton 
                            onClick={startStudyMode}
                            disabled={filteredFlashcards.length === 0}
                          >
                            📚 Estudar Flashcards Filtrados
                          </StudyButton>
                        </div>
                      )}
                      <FlashcardsGrid>
                        {filteredFlashcards.map((fc) => (
                          <FlashcardCard 
                            key={fc._id}
                            onClick={() => {
                              const index = filteredFlashcards.findIndex(f => f._id === fc._id);
                              setStudyIndex(index);
                              startStudyMode();
                            }}>
                            <FlashcardHeader>
                              <FlashcardTitle>{fc.front}</FlashcardTitle>
                              <FlashcardDate>Criado recentemente</FlashcardDate>
                            </FlashcardHeader>

                            <FlashcardContent>
                              <ContentSection>
                                <ContentLabel>Pergunta</ContentLabel>
                                <ContentText>{fc.front}</ContentText>
                              </ContentSection>
                            </FlashcardContent>

                            {fc.tags && fc.tags.length > 0 && (
                              <FlashcardTags onClick={(e) => e.stopPropagation()}>
                                {fc.tags.map((tag, index) => (
                                  <FlashcardTag 
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTagFilter(
                                        typeof tag === 'object' ? tag._id : tag
                                      );
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {typeof tag === "object" ? tag.name : tag}
                                  </FlashcardTag>
                                ))}
                              </FlashcardTags>
                            )}
                          </FlashcardCard>
                        ))}
                      </FlashcardsGrid>
                    </>
                  )}
                </AllFlashcardsSection>
              </>
            ) : (
              // Study Mode UI
              <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <BackButton onClick={exitStudyMode}>
                  ← Voltar para lista
                </BackButton>
                
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '20px',
                  color: '#4A5568'
                }}>
                  Estudando {studyIndex + 1} de {filteredFlashcards.length} flashcards
                </div>

                <FlashcardContainer>
                  <FlashcardInner
                    isFlipped={showBack}
                    onClick={() => setShowBack(!showBack)}
                  >
                    <FlashcardFront>
                      <FlashcardStepTitle>Pergunta</FlashcardStepTitle>
                      <FlashText>{filteredFlashcards[studyIndex].front}</FlashText>
                    </FlashcardFront>
                    <FlashcardBack>
                      <FlashcardStepTitle>Resposta</FlashcardStepTitle>
                      <FlashText>{filteredFlashcards[studyIndex].back}</FlashText>
                    </FlashcardBack>
                  </FlashcardInner>
                </FlashcardContainer>

                <FlipInstruction>
                  {!showBack
                    ? "Clique no cartão para ver a resposta"
                    : "Clique no cartão para voltar à pergunta"}
                </FlipInstruction>

                {showBack && (
                  <GradeContainer>
                    <GradeText>Como você se saiu? (0 a 5)</GradeText>
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <GradeButton 
                        key={n} 
                        onClick={() => {
                          handleGrade(n);
                          handleNextStudyCard();
                        }}
                      >
                        {n}
                      </GradeButton>
                    ))}
                  </GradeContainer>
                )}
              </div>
            )}
          </Container>
        </>
      )}
    </>
  );
}
