export interface TutorialStep {
  title: string;
  description: string;
  icon?: string;
}

import adicionarCard from '../../../assets/adicionarCard.svg';
import lixeira from '../../../assets/lixeira.svg';

export const tutorialSteps: TutorialStep[] = [
  {
    title: "Bem-vindo à tela Escolar!",
    description: "Aqui você organiza seus estudos com listas e cards personalizados."
  },
  {
    title: "Criar nova lista",
    description: "Clique em '+ Criar nova lista' no topo da tela para começar sua organização.",
    icon: adicionarCard
  },
  {
    title: "Adicionar cards",
    description: "Dentro de cada lista, você pode adicionar cards com conteúdos diversos."
  },
  {
    title: "Reorganizar cards",
    description: "Arraste os cards entre listas para reorganizá-los da forma que quiser."
  },
  {
    title: "Visualizar e editar cards",
    description: "Clique em um card para abrir o modal de detalhes, editar o título e visualizar PDFs anexados."
  },
  {
    title: "Anexar arquivos",
    description: "No modal do card, você pode fazer upload de PDFs e imagens para complementar o conteúdo."
  },
  {
    title: "Apagar cards",
    description: "Na lateral direita da página, clique no ícone de lixeira para remover o card da lista.",
    icon: lixeira
  },
  {
    title: "Editar listas",
    description: "Acima de cada lista, há um botão 'Editar Lista' que permite renomeá-la."
  },
  {
    title: "Excluir listas",
    description: "Acima de cada lista também há um botão 'Excluir Lista' para remover a lista inteira com seus cards."
  },
  {
    title: "Tutorial concluído!",
    description: "Agora você conhece todas as funções da página Escolar. Boas anotações!"
  }
]; 