import styled from 'styled-components';

export const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '240px' : '88px'};
  background-color: var(--nav-bg);
  transition: width 0.3s ease;
  z-index: 1000;
  border-right: 1px solid var(--border);
`;

export const SidebarContent = styled.div`
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  img {
    max-width: 100%;
    height: auto;
  }
`;

export const MenuItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--nav-text);
  background-color: ${props => props.isActive ? 'var(--hover)' : 'transparent'};

  &:hover {
    background-color: var(--hover);
  }

  svg, img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    fill: var(--icon-color);
    filter: ${props => props.theme === 'dark' ? 'brightness(10)' : 'none'};
  }

  span {
    font-size: 16px;
    white-space: nowrap;
    color: var(--nav-text);
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--primary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    width: 16px;
    height: 16px;
    fill: var(--button-text);
  }

  &:hover {
    transform: scale(1.1);
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: var(--border);
  margin: 16px 0;
`; 