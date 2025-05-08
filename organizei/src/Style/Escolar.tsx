import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
`;
export const Subtitle = styled.p`
  color: #555;
  margin-bottom: 8px;
`;
export const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
`;
export const ButtonPrimary = styled.button`
  padding: 10px 16px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
`;
export const ScrollWrapper = styled.div`
  position: relative;
  margin-top: 16px;
  &:hover button {
    opacity: 1;
  }
`;
export const ListColumn = styled.div`
  min-width: 300px;
  scroll-snap-align: start;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;
 export const ColumnTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
`;
export const CardArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const Card = styled.div`
  background-color: white;
  border: 1.5px dashed #bbb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
`;
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
export const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
`;
export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 12px;
`;
export const ButtonGroup = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;
  button {
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
  }
  .confirm {
    background: #007bff;
    color: white;
    border: none;
  }
  .cancel {
    background: #ccc;
    border: none;
  }
`;
export const DetalhesCardModal = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 320px;
  text-align: center;
`;
export const ConfirmOverlay = styled(ModalOverlay)`
  z-index: 1100;
`;
export const ConfirmBox = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 320px;
  text-align: center;
`;

export const Grid = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScrollButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "left",
})<{ left?: boolean }>`
  position: absolute;
  top: 50%;
  ${({ left }) => (left ? "left: -20px;" : "right: -20px;")}
  transform: translateY(-50%);
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
`;
