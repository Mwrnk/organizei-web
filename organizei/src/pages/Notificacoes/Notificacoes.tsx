import { useState } from 'react';
import { Header } from '../../Components/Header';
import styled from 'styled-components';

const NotificacoesContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

const NotificacoesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }
`;

const NotificacaoLista = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificacaoItem = styled.div<{ lida: boolean }>`
  padding: 15px;
  border-radius: 8px;
  background-color: ${props => props.lida ? '#f5f5f5' : '#e8f4f8'};
  border-left: 4px solid ${props => props.lida ? '#ccc' : '#3498db'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const NotificacaoConteudo = styled.div`
  flex: 1;
`;

const NotificacaoTitulo = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const NotificacaoMensagem = styled.p`
  margin: 0;
  color: #666;
`;

const NotificacaoData = styled.span`
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 5px;
`;

const NotificacaoAcoes = styled.div`
  display: flex;
  gap: 10px;
`;

const BotaoAcao = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #3498db;
  font-size: 14px;
  padding: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BotaoLimparTodas = styled.button`
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const SemNotificacoes = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
`;

type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
};

export function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    {
      id: 1,
      titulo: 'Nova tarefa atribuída',
      mensagem: 'Você recebeu uma nova tarefa para revisar o relatório mensal.',
      data: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
      lida: false
    },
    {
      id: 2,
      titulo: 'Lembrete de reunião',
      mensagem: 'Reunião de planejamento amanhã às 10h.',
      data: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
      lida: false
    },
    {
      id: 3,
      titulo: 'Prazo próximo',
      mensagem: 'A tarefa "Finalizar apresentação" vence em 2 dias.',
      data: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
      lida: true
    }
  ]);

  const marcarComoLida = (id: number) => {
    setNotificacoes(prev => 
      prev.map(notificacao => 
        notificacao.id === id ? { ...notificacao, lida: true } : notificacao
      )
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => 
      prev.map(notificacao => ({ ...notificacao, lida: true }))
    );
  };

  const excluirNotificacao = (id: number) => {
    setNotificacoes(prev => prev.filter(notificacao => notificacao.id !== id));
  };

  const limparTodasNotificacoes = () => {
    setNotificacoes([]);
  };

  // Formatar data relativa (ex: "há 30 minutos", "há 2 horas")
  const formatarDataRelativa = (data: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    
    const minutos = Math.floor(diff / (1000 * 60));
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) {
      return `há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    } else if (horas < 24) {
      return `há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    } else {
      return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
    }
  };

  return (
    <>
      <Header />
      <NotificacoesContainer>
        <NotificacoesHeader>
          <h2>Notificações</h2>
          <div>
            {notificacoes.length > 0 && (
              <>
                <BotaoLimparTodas onClick={marcarTodasComoLidas}>
                  Marcar todas como lidas
                </BotaoLimparTodas>
                <BotaoLimparTodas onClick={limparTodasNotificacoes} style={{ marginLeft: '10px' }}>
                  Limpar todas
                </BotaoLimparTodas>
              </>
            )}
          </div>
        </NotificacoesHeader>

        {notificacoes.length > 0 ? (
          <NotificacaoLista>
            {notificacoes.map(notificacao => (
              <NotificacaoItem key={notificacao.id} lida={notificacao.lida}>
                <NotificacaoConteudo>
                  <NotificacaoTitulo>{notificacao.titulo}</NotificacaoTitulo>
                  <NotificacaoMensagem>{notificacao.mensagem}</NotificacaoMensagem>
                  <NotificacaoData>{formatarDataRelativa(notificacao.data)}</NotificacaoData>
                </NotificacaoConteudo>
                <NotificacaoAcoes>
                  {!notificacao.lida && (
                    <BotaoAcao onClick={() => marcarComoLida(notificacao.id)}>
                      Marcar como lida
                    </BotaoAcao>
                  )}
                  <BotaoAcao onClick={() => excluirNotificacao(notificacao.id)}>
                    Excluir
                  </BotaoAcao>
                </NotificacaoAcoes>
              </NotificacaoItem>
            ))}
          </NotificacaoLista>
        ) : (
          <SemNotificacoes>
            <p>Você não tem notificações no momento.</p>
          </SemNotificacoes>
        )}
      </NotificacoesContainer>
    </>
  );
} 
