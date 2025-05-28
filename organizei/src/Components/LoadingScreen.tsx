import React from 'react';
import styled from 'styled-components';
import loadingVideo from '../../assets/Ativo 2.mp4';

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
`;

const LoadingVideo = styled.video`
  width: 400px;
  height: 400px;
  object-fit: contain;
`;

interface LoadingScreenProps {
  isVisible: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <LoadingContainer>
      <LoadingVideo
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={loadingVideo} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </LoadingVideo>
    </LoadingContainer>
  );
}; 