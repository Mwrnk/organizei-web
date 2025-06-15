import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Kodchasan', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #E9E8E8;
  }

  button {
    font-family: 'Kodchasan', sans-serif;
  }

  input {
    font-family: 'Kodchasan', sans-serif;
  }
`; 