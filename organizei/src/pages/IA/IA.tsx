import { useState, useEffect } from "react";
import { Header } from "../../Components/Header";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled from "styled-components";
import axios from "axios";

const ChatContainer = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 40px auto;
  padding: 40px 32px 32px 32px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  @media (max-width: 900px) {
    max-width: 98vw;
    padding: 16px 2vw 20px 2vw;
  }
`;

const ChatHeader = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const ChatMessages = styled.div`
  flex: 1;
  min-height: 480px;
  max-height: 65vh;
  overflow-y: auto;
  padding: 18px 0;
  background-color: #f5f5f5;
  border-radius: 16px;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: 600px) {
    min-height: 320px;
    max-height: 45vh;
    gap: 14px;
  }
`;

const MessageRow = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: ${({ isUser }) => (isUser ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: 18px;
  margin: 0 8px;
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ isUser }) => (isUser ? '#1d1b20' : '#e1e1e1')};
  color: ${({ isUser }) => (isUser ? '#fff' : '#333')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 8px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  position: relative;
  max-width: 80%;
  padding: 18px 22px;
  border-radius: 22px;
  font-size: 17px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  ${({ isUser }) =>
    isUser
      ? `
      background: linear-gradient(90deg, #1d1b20 80%, #2c2c2c 100%);
      color: #fff;
      border-bottom-right-radius: 8px;
      align-self: flex-end;
      margin-left: auto;
      &::after {
        content: '';
        position: absolute;
        right: -12px;
        bottom: 8px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 12px solid #1d1b20;
      }
    `
      : `
      background: #e1e1e1;
      color: #333;
      border-bottom-left-radius: 8px;
      align-self: flex-start;
      &::after {
        content: '';
        position: absolute;
        left: -12px;
        bottom: 8px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 12px solid #e1e1e1;
      }
    `}
  word-break: break-word;
  transition: background 0.2s;
`;

const ChatForm = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border-radius: 25px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 17px;
  &:focus {
    border-color: #1d1b20;
  }
`;

const SendButton = styled.button`
  background-color: #1d1b20;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0 24px;
  cursor: pointer;
  font-size: 17px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2c2c2c;
  }
`;

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

export function IA() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  usePageLoading(isInitialLoading);

  // Simular carregamento inicial da IA
  useEffect(() => {
    const initializeIA = async () => {
      setIsInitialLoading(true);
      
      // Simular delay de inicialização
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mensagem de boas-vindas da IA
      const welcomeMessage: Message = {
        id: Date.now(),
        text: "Olá! Eu sou a ORGAN.IA, sua assistente de organização. Como posso ajudá-lo hoje?",
        isUser: false,
      };
      
      setMessages([welcomeMessage]);
      setIsInitialLoading(false);
    };

    initializeIA();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/chat", {
        message: newMessage,
      });

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.data.response,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: "Erro ao se comunicar com a IA. Tente novamente mais tarde.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ChatContainer>
        <ChatHeader>
          <h2>ORGAN.IA</h2>
          <p>Converse com nossa IA para ajudar na organização</p>
        </ChatHeader>

        <ChatMessages>
          {messages.map((message) => (
            <MessageRow key={message.id} isUser={message.isUser}>
              <Avatar isUser={message.isUser}>
                {message.isUser ? 'T' : 'IA'}
              </Avatar>
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </MessageRow>
          ))}
          {loading && (
            <MessageRow isUser={false}>
              <Avatar isUser={false}>IA</Avatar>
              <MessageBubble isUser={false}>Analisando...</MessageBubble>
            </MessageRow>
          )}
        </ChatMessages>

        <ChatForm onSubmit={handleSendMessage}>
          <ChatInput
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <SendButton type="submit" disabled={loading}>
            Enviar
          </SendButton>
        </ChatForm>
      </ChatContainer>
    </>
  );
}
