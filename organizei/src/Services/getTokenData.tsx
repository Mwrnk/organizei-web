// Decodifica um token JWT para obter as informações contidas nele
export const decodeToken = (token: string): any => {
  try {
    // Token JWT tem três partes separadas por pontos
    // Header.Payload.Signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodifica o payload Base64Url para JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

// Verifica se o token já expirou
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    
    // Verifica se o token tem um campo de expiração
    if (!decoded.exp) return false;
    
    // Converte o timestamp de expiração para milissegundos
    const expirationDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();
    
    return currentDate > expirationDate;
  } catch (error) {
    console.error('Erro ao verificar expiração do token:', error);
    return true;
  }
};

// Obtém o tempo restante de validade do token em segundos
export const getTokenRemainingTime = (token: string): number => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;
    
    const expirationDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();
    
    return Math.max(0, Math.floor((expirationDate.getTime() - currentDate.getTime()) / 1000));
  } catch (error) {
    console.error('Erro ao calcular tempo restante do token:', error);
    return 0;
  }
};

// Verifica se o token precisa ser renovado (menos de 5 minutos para expirar)
export const shouldRefreshToken = (token: string): boolean => {
  const remainingTime = getTokenRemainingTime(token);
  // Renovar se faltar menos de 5 minutos para expirar
  return remainingTime > 0 && remainingTime < 300;
};
