import { useState } from "react";
import { Header } from "../../Components/Header";
import styled from "styled-components";
import axios from "axios";

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const ChatHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ChatMessages = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 18px;
  ${({ isUser }) =>
    isUser
      ? `
      background-color: #1d1b20;
      color: white;
      align-self: flex-end;
      margin-left: auto;
    `
      : `
      background-color: #e1e1e1;
      color: #333;
      align-self: flex-start;
    `}
  display: flex;
  flex-direction: column;
`;

const ChatForm = styled.form`
  display: flex;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border-radius: 25px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 16px;
  &:focus {
    border-color: #1d1b20;
  }
`;

const SendButton = styled.button`
  background-color: #1d1b20;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0 20px;
  cursor: pointer;
  font-size: 16px;
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
            <MessageBubble key={message.id} isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          ))}
          {loading && (
            <MessageBubble isUser={false}>Analisando...</MessageBubble>
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
