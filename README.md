
# Organize.ei

## 📚 Introdução

Bem-vindo ao Organizei, somos um projeto desenvolvido para buscar ajudar estudantes a se organizarem de forma que seus estudos possam ser otimizados. Nossa API ainda está em construção, mas por aqui você já consegue visualizar algumas coisas como tela de login mobile e web.

O projeto contará com as entidades **Usuário**, **Quadro**, **Lista**, **Card**, **tipoCard**, e **plano**.

### Tecnologias Utilizadas

- **Backend:**
  - Node.js com **Express**
  - **bcrypt / bcryptjs** 
  - **dotenv** 
  - **jsonwebtoken** 
  - **knex** 
  - **mongoose** 
  - **uuid** 
  - **zod**

- **Frontend Web:**
  - **React 19**
  - **Styled Components**

- **Mobile (React Native com Expo):**
  - **Expo**
  - **React Navigation**
  - **Axios**
  - **AsyncStorage**
  - **Reanimated, Safe Area Context, NetInfo, etc.**

---

## ⚙️ Instalação

### Requisitos

Para rodar a API localmente, você precisa dos seguintes pré-requisitos:

- **Node.js**: versão 16.x ou superior
- **npm** ou **yarn**: para gerenciar pacotes
- **MongoDB**: local ou em nuvem (MongoDB Atlas)

---

## 🚀 Executando o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/organizei-api.git
cd organizei-api
```

2. Instale as dependências:

```bash
npm install
# ou
yarn
```

3. Configure o arquivo `.env`:

```env
PORT=3000
DATABASE_URL="sua_conexao_postgresql"
JWT_SECRET="sua_chave_secreta"
MONGO_URI="sua_string_mongodb"
```

4. Rode as migrations (se estiver usando Knex com banco relacional):

```bash
npx knex migrate:latest
```

5. Inicie o servidor:

```bash
npm run dev
# ou
yarn dev
```

---

## 🧩 Estrutura do Projeto

```bash
organizei-api/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── index.js
└── .env
```

---

## 🛠️ Funcionalidades (em desenvolvimento)

- [x] Autenticação JWT
- [x] Criptografia de senhas
- [ ] Integração completa com MongoDB
- [ ] CRUD de Quadros, Listas e Cards
- [ ] Plano Premium (futuramente)
- [ ] Testes automatizados

---

## 👤 Equipe

- Matheus Ribas - [@usuario1](https://github.com/usuario1)
- Mateus Silva Ramos - [@usuario2](https://github.com/usuario2)

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 💡 Observações Finais

Ainda estamos trabalhando na documentação oficial da API (Swagger ou Postman). Em breve você poderá visualizar todos os endpoints e realizar testes diretamente por lá.

Enquanto isso, agradecemos por estar acompanhando o desenvolvimento do **Organizei**! 🎓📅✨
