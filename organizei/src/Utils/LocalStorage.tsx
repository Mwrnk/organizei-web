// Chaves usadas no localStorage
const TOKEN_KEY = 'authenticacao';
const USER_ID_KEY = 'idUsuario';
const USER_EMAIL_KEY = 'email';

// Funções para gerenciar o token JWT
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Funções para gerenciar o ID do usuário
export const setUserId = (id: string): void => {
  localStorage.setItem(USER_ID_KEY, id);
};

export const getUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY);
};

export const removeUserId = (): void => {
  localStorage.removeItem(USER_ID_KEY);
};

// Funções para gerenciar o email do usuário
export const setUserEmail = (email: string): void => {
  localStorage.setItem(USER_EMAIL_KEY, email);
};

export const getUserEmail = (): string | null => {
  return localStorage.getItem(USER_EMAIL_KEY);
};

export const removeUserEmail = (): void => {
  localStorage.removeItem(USER_EMAIL_KEY);
};

// Função para limpar todos os dados de autenticação
export const clearAuthData = (): void => {
  removeToken();
  removeUserId();
  removeUserEmail();
};

// Verifica se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
