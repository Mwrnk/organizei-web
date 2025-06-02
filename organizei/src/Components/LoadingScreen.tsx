import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import loadingVideo from '../../assets/Ativo 2.mp4';

const GlobalStyle = createGlobalStyle`
  body:has(.loading-container) {
    &::before {
      display: none !important;
    }
    &::after {
      display: none !important;
    }
  }
`;

const LoadingContainer = styled.div.attrs({ className: 'loading-container' })`
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
  &::-webkit-media-controls-timeline {
    display: none;
  }
  &::-webkit-media-controls {
    display: none !important;
  }
  &::-webkit-media-controls-start-playback-button {
    display: none !important;
  }
  &::-webkit-loading-indicator {
    display: none !important;
  }
`;

interface LoadingScreenProps {
  isVisible: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      <GlobalStyle />
      <LoadingContainer>
        <LoadingVideo
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          loading="eager"
        >
          <source src={loadingVideo} type="video/mp4" priority="high" />
          Seu navegador não suporta vídeos.
        </LoadingVideo>
      </LoadingContainer>
    </>
  );
}; 