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

export const ButtonCriar = styled.button`
  background-color: #e9e8e8;
  color: black;
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease;
    filter: brightness(0);
  }

  &:hover {
    background-color: black;
    color: white;

    img {
      filter: brightness(0) invert(1);
    }
  }
`;

export const ButtonExcluir = styled.button`
  background-color: #e9e8e8;
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    filter: invert(0%);
    transition: filter 0.3s ease;
    width: 24px;
    height: 24px;
  }

  &:hover {
    background-color: red;

    img {
      filter: brightness(0) invert(1);
    }
  }

  &.ativo {
    background-color: red;

    img {
      filter: brightness(0) invert(1);
    }
  }
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
  border-radius: 16px;
  padding: 12px;
  min-height: 80px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.12);
  }

  /* Modo excluir */
  &.modo-excluir {
    border: 2px dashed red;
    opacity: 0.3;
    pointer-events: auto;
    transform: none;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    /* Manter tamanho original */
    min-height: 80px;
    padding: 12px;
    width: 100%;

    &:hover {
      background-color: #ff4d4d;
      opacity: 1;
      border: 2px dashed red;
      transform: none;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
      /* Manter tamanho no hover */
      min-height: 80px;
      padding: 12px;
      width: 100%;
    }

    &:hover .icon-excluir {
      display: flex;
      opacity: 1;
    }

    &:hover .card-content {
      opacity: 0;
      visibility: hidden;
    }
  }

  /* Hover dentro do modo excluir */
  &.hover-excluir {
    background-color: #ff4d4d;
    opacity: 1;
    border: 2px dashed red;
    transform: none;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
    /* Manter tamanho */
    min-height: 80px;
    padding: 12px;
    width: 100%;
  }

  /* Card para adicionar */
  &.add-card {
    background-color: transparent;
    border: 2px dashed #bbb;
    box-shadow: none;
    justify-content: center;
    align-items: center;
    padding: 0;
    min-height: 80px;

    &:hover {
      transform: none;
      box-shadow: none;
      background-color: rgba(0, 0, 0, 0.02);
    }
  }

  /* Conteúdo normal do card */
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  /* Ícone de exclusão */
  .icon-excluir {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    display: none;
    pointer-events: none;
    z-index: 10;

    img {
      width: 42px;
      height: 42px;
      filter: brightness(0) invert(1);
    }
  }
`;

/* Título */
export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 220px;
`;

/* Data */
export const CardDate = styled.p`
  font-size: 13px;
  color: #888;
`;

/* Ícone de publicado */
export const PublishedIcon = styled.img`
  width: 18px;
  height: 18px;
`;

export const Avatar = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
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

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ConfirmOverlay = styled(ModalOverlay)`
  z-index: 1100;
`;
export const ConfirmBox = styled.div``;
export const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 450px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);

  h2 {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }

  p {
    font-size: 14px;
    color: #333;
    margin: 0;
  }
`;

export const ImageUploadArea = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
  }

  span {
    font-size: 50px;
    color: #bcbcbc;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 10px 15px;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 16px;
  }
`;

export const CreateButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #0066d6;
  }
`;

/* 🔥 NOVO - Modal Detalhes do Card */
export const DetalhesContainer = styled.div`
  background: white;
  display: flex;
  border-radius: 20px;
  padding: 20px;
  width: 1000px;
  max-height: 90vh;
  gap: 20px;
  overflow-y: auto;
`;

export const Sidebar = styled.div`
  width: 250px;
  background: #f8f8f8;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SidebarCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 {
    margin: 0;
    font-size: 14px;
    color: #888;
  }

  p {
    margin: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 10px;
  }
`;

export const PrioridadeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .baixa {
    background-color: #00c853;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .media {
    background-color: #ffab00;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .alta {
    background-color: #d50000;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const UploadArea = styled.div`
  background: #eaeaea;
  border-radius: 20px;
  height: 400px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;

  button {
    background: #222;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
  }
`;

export const SaveButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #0066d6;
  }
`;

/* Grid e ScrollButton permanecem iguais */
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
