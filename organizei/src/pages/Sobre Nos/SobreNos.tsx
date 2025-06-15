import { Header } from "../../Components/Header";
import styled from "styled-components";

// Import team member images
import mateusWerneckImg from "../../../assets/integrantes/Mateus Werneck.jpg";
import marazoImg from "../../../assets/integrantes/Marazo.png";
import gabrielImg from "../../../assets/integrantes/Gabriel Cunha.png";
import mateusImg from "../../../assets/integrantes/Mateus Silva.png";
import micaelImg from "../../../assets/integrantes/Micael.png";
import tiagoImg from "../../../assets/integrantes/Tiago.png";
import brenoImg from "../../../assets/integrantes/Breno.jpg";
import matheusRibasImg from "../../../assets/integrantes/Matheus Ribas.jpg";


const Container = styled.div`
  max-width: 1400px;
  margin: 0px auto;
  padding: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Line = styled.div`
  flex: 1;
  height: 2px;
  background-color: #DFDFDF;
`;

const LinhaMenor = styled.div`
  width: 300px;
  height: 2px;
  background-color: #DFDFDF;
`;

const Title = styled.p`
  color: #333;
  margin: 0;
  white-space: nowrap;
`;

const Section = styled.section`

  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
`;



const Text = styled.h1`
  font-size: 70px;
  color: #000000;
 
  margin-bottom: 15px;
  text-align: center;
`;

const DivLinhaTitulo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;
const SobreText = styled.p`
  font-size: 20px;
  color: #000000;
  margin-bottom: 15px;
  line-height: 1.6;
 
`;
const DivIntegrantes = styled.div`
  margin-top: 60px;
  padding: 20px 0;
`;

const CarrosselContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 40px 20px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardIntegrante = styled.div<{ elevated?: boolean }>`
  width: 250px;
  transform: translateY(${props => props.elevated ? '-30px' : '0'});
  transition: transform 0.3s ease;
  padding: 10px;
`;

const ImagemIntegrante = styled.img`
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const NomeIntegrante = styled.h3`
  font-size: 20px;
  margin: 0;
  color: #000;
  padding: 0 10px;
`;

const FuncaoIntegrante = styled.p`
  font-size: 16px;
  color: #666;
  margin: 8px 0 0 0;
  font-style: italic;
  padding: 0 10px;
`;

export function SobreNos() {
  const integrantes = [
    { nome: "Matheus Ribas", funcao: "Front-End Web", foto: matheusRibasImg },
    { nome: "Marazo", funcao: "Back-End Dev", foto: marazoImg },
    { nome: "Gabriel Cunha", funcao: "Designer UX/UI", foto: gabrielImg },
    { nome: "Mateus Silva", funcao: "Back-End Dev", foto: mateusImg },
    { nome: "Micael", funcao: "Back-End Dev", foto: micaelImg },
    { nome: "Tiago", funcao: "Back-End Dev", foto: tiagoImg },
    { nome: "Breno", funcao: "Front-End Mobile", foto: brenoImg },
    { nome: "Mateus Werneck", funcao: "Front-End Mobile", foto: mateusWerneckImg },
  ];

  return (
    <>
      <Header />
      <Container>
        <TitleContainer>
          <LinhaMenor />
          <Title>#Sobre</Title>
          <LinhaMenor />
        </TitleContainer>

        <Section>
          
          <Text>
            Conheça quem está por<br />
            trás disso tudo!
          </Text>
          
        </Section>
        <div>
        <DivLinhaTitulo>
          <Title>#Historia</Title>
          <Line />
          
        </DivLinhaTitulo>
        <SobreText>Este app surgiu como um projeto de 
          faculdade para enfrentar um desafio comum: a 
          desorganização nos estudos e o difícil acesso a conteúdos.</SobreText>
          <SobreText>Oferecemos uma plataforma simples e intuitiva, com gamificação, comunidade ativa e IA integrada para facilitar o aprendizado e a organização dos estudos.
         </SobreText>
          <SobreText><strong>Acreditamos na força da educação acessível, prática e eficiente.</strong></SobreText>
        </div>
        <DivIntegrantes>
        <DivLinhaTitulo>
          <Title>#Integrantes</Title>
          <Line />
          
        </DivLinhaTitulo>
        <CarrosselContainer>
          {integrantes.map((integrante, index) => (
            <CardIntegrante key={index} elevated={index % 2 === 1}>
              {integrante.foto ? (
                <ImagemIntegrante src={integrante.foto} alt={integrante.nome} />
              ) : (
                <ImagemIntegrante as="div" />
              )}
              <NomeIntegrante>{integrante.nome}</NomeIntegrante>
              <FuncaoIntegrante>{integrante.funcao}</FuncaoIntegrante>
            </CardIntegrante>
          ))}
        </CarrosselContainer>
        </DivIntegrantes>
      </Container>
    </>
  );
}
