import { useState, useEffect } from "react";
import { Header } from "../../Components/Header";
import { usePageLoading } from "../../Utils/usePageLoading";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContexts";
import IconIA from "../../../assets/bot.svg";

const ChatContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px); /* Considerando o header */
  margin: 0;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 900px) {
    padding: 20px;
  }
`;

const ChatBox = styled.div`
  width: 100%;
  max-width: 1000px;
  background-color: #fff;
  border-radius: 24px;
  padding: 32px;
  margin-top: 60px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);

  @media (max-width: 900px) {
    padding: 24px;
    margin-top: 40px;
  }
`;

const ChatHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: 100px;

  img {
    width: 40px;
    height: 40px;
    margin-top: -30px;
    margin-right: -140px;
  }

  h2 {
    font-size: 2.5rem;
    margin: 0;
  }
  p {
    font-size: 1.1rem;
    color: #666;
    margin-top: 12px;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 24px;
  background-color: #f5f5f5;
  border-radius: 16px;
  margin: 0 auto;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 900px;

  @media (max-width: 600px) {
    min-height: 320px;
    max-height: 65vh;
    gap: 14px;
    padding: 16px;
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
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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

const MarkdownContent = styled.div`
  h1 {
    font-size: 24px;
    margin: 16px 0 12px;
    font-weight: 600;
  }
  h2 {
    font-size: 20px;
    margin: 14px 0 10px;
    font-weight: 600;
  }
  h3 {
    font-size: 18px;
    margin: 12px 0 8px;
    font-weight: 600;
  }
  ul {
    margin: 8px 0;
    padding-left: 20px;
  }
  li {
    margin: 4px 0;
  }
  strong {
    font-weight: 600;
  }
  p {
    margin: 8px 0;
    line-height: 1.5;
  }
`;

// Componente para renderizar markdown
function MarkdownMessage({ text }: { text: string }) {
  // Função para converter markdown em HTML
  const parseMarkdown = (md: string) => {
    let html = md;

    // Converter headers (agora usando \n em vez de \\n)
    html = html.replace(/### (.*?)\n/g, '<h3>$1</h3>\n');
    html = html.replace(/## (.*?)\n/g, '<h2>$1</h2>\n');
    html = html.replace(/# (.*?)\n/g, '<h1>$1</h1>\n');

    // Converter negrito
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Converter listas
    const lines = html.split('\n');
    let inList = false;
    html = lines.map(line => {
      if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        if (!inList) {
          inList = true;
          return `<ul><li>${content}</li>`;
        }
        return `<li>${content}</li>`;
      } else if (inList) {
        inList = false;
        return `</ul>${line}`;
      }
      return line;
    }).join('\n');

    if (inList) {
      html += '</ul>';
    }

    // Converter parágrafos (ignorando linhas que já são HTML)
    html = html.split('\n').map(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('<') && !trimmed.endsWith('>')) {
        return `<p>${line}</p>`;
      }
      return line;
    }).join('');

    // Escapar caracteres HTML apenas no conteúdo, não nas tags
    return html
      .replace(/&(?![a-zA-Z]+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      // Restaurar as tags HTML que queremos manter
      .replace(/&lt;(\/?)h[1-3]&gt;/g, '<$1h$2>')
      .replace(/&lt;(\/?)strong&gt;/g, '<$1strong>')
      .replace(/&lt;(\/?)p&gt;/g, '<$1p>')
      .replace(/&lt;(\/?)ul&gt;/g, '<$1ul>')
      .replace(/&lt;(\/?)li&gt;/g, '<$1li>');
  };

  return (
    <MarkdownContent dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} />
  );
}

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
  const { user } = useAuth();

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
        text: "Olá! Eu sou a Organ.ai, sua assistente de organização. Como posso ajudá-lo hoje?",
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
        <ChatBox>
          <ChatHeader>
            <img src={IconIA} alt="Organ.ai" />
            <div>
              <h2>Organ.ai</h2>
              <p>Converse com nossa IA para ajudar na organização</p>
            </div>
          </ChatHeader>

          <ChatMessages>
            {messages.map((message) => (
              <MessageRow key={message.id} isUser={message.isUser}>
                <Avatar isUser={message.isUser}>
                  {message.isUser ? (
                    user?.profileImage ? (
                      <img src={user.profileImage} alt="User" />
                    ) : (
                      'M'
                    )
                  ) : (
                    'IA'
                  )}
                </Avatar>
                <MessageBubble isUser={message.isUser}>
                  {message.isUser ? (
                    message.text
                  ) : (
                    <MarkdownMessage text={message.text} />
                  )}
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
        </ChatBox>
      </ChatContainer>
    </>
  );
}
