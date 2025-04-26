import axios from "axios";
import { getToken, clearAuthData } from "../Utils/LocalStorage";
import { isTokenExpired } from "./getTokenData";

// Criando uma instância do axios com URL base
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Se existe token, verifica se está expirado
    if (token) {
      if (isTokenExpired(token)) {
        // Se expirado, limpa dados de autenticação
        clearAuthData();
        window.location.href = "/";
        return Promise.reject("Token expirado. Faça login novamente.");
      }
      
      // Adiciona o token ao header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erros de autenticação (401) ou autorização (403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      clearAuthData();
      window.location.href = "/";
    }
    
    return Promise.reject(error);
  }
);

export default api; 
