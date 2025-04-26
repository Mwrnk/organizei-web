import { useState } from 'react';
import { Header } from '../../Components/Header';
import styled from 'styled-components';

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
  ${({ isUser }) => isUser
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
    `
  }
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
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! Sou o assistente virtual do Organiz.ei. Como posso ajudar você?", isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Adiciona a mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simula resposta da IA após 1 segundo
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: getAIResponse(newMessage),
        isUser: false
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Função simples para simular respostas da IA
  const getAIResponse = (message: string): string => {
    const normalizedMessage = message.toLowerCase();
    
    if (normalizedMessage.includes('olá') || normalizedMessage.includes('oi') || normalizedMessage.includes('hey')) {
      return 'Olá! Como posso ajudar você hoje?';
    }
    
    if (normalizedMessage.includes('ajuda') || normalizedMessage.includes('ajudar')) {
      return 'Posso ajudar você a organizar suas tarefas, planejar sua rotina ou responder dúvidas sobre o Organiz.ei!';
    }
    
    if (normalizedMessage.includes('tarefa') || normalizedMessage.includes('tarefas')) {
      return 'Para gerenciar suas tarefas, você pode usar nossa funcionalidade de listas de tarefas. Quer que eu crie uma nova lista para você?';
    }
    
    if (normalizedMessage.includes('obrigado') || normalizedMessage.includes('obrigada')) {
      return 'De nada! Estou aqui para ajudar. Tem mais alguma coisa em que posso auxiliar?';
    }
    
    return 'Entendi. Como posso ajudar você com isso? Sou especialista em organização de tarefas e planejamento.';
  };

  return (
    <>
      <Header />
      <ChatContainer>
        <ChatHeader>
          <h2>Assistente Virtual</h2>
          <p>Versão Premium - Converse com nossa IA para ajudar na organização</p>
        </ChatHeader>
        
        <ChatMessages>
          {messages.map(message => (
            <MessageBubble key={message.id} isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          ))}
        </ChatMessages>
        
        <ChatForm onSubmit={handleSendMessage}>
          <ChatInput
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <SendButton type="submit">Enviar</SendButton>
        </ChatForm>
      </ChatContainer>
    </>
  );
} 
