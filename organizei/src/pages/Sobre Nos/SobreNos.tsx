import { Header } from "../../Components/Header";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const Section = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #2196f3;
  margin-bottom: 20px;
`;

const Text = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
`;

export function SobreNos() {
  return (
    <>
      <Header />
      <Container>
        <Title>Sobre Nós</Title>

        <Section>
          <SectionTitle>Nossa História</SectionTitle>
          <Text>
            O Organizei nasceu da necessidade de tornar a organização de estudos mais eficiente e acessível. 
            Nossa plataforma foi desenvolvida pensando em estudantes que buscam uma maneira inteligente de 
            gerenciar seus materiais de estudo e compartilhar conhecimento.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Nossa Missão</SectionTitle>
          <Text>
            Acreditamos que o conhecimento deve ser compartilhado e que a organização é a chave para 
            um aprendizado eficaz. Nossa missão é proporcionar ferramentas que facilitem a jornada 
            acadêmica de nossos usuários.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Nossos Valores</SectionTitle>
          <Text>
            • Colaboração: Incentivamos a troca de conhecimento entre usuários
          </Text>
          <Text>
            • Inovação: Buscamos constantemente melhorar nossa plataforma
          </Text>
          <Text>
            • Simplicidade: Mantemos nossa interface intuitiva e fácil de usar
          </Text>
          <Text>
            • Qualidade: Garantimos a melhor experiência para nossos usuários
          </Text>
        </Section>
      </Container>
    </>
  );
}
