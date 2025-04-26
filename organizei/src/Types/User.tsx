export type Usuario = {
    _id: string;
    coduser: string;
    name: string;
    dateOfBirth: string;
    email: string;
    role: UserRole;
  };

export enum UserRole {
  FREE = "free",
  PREMIUM = "premium",
  ADMIN = "admin"
}

export type UserPermissions = {
  canAccessAI: boolean;
  canAccessPremiumFeatures: boolean;
  canAccessAdminPanel: boolean;
}

// Função para obter permissões baseadas no role do usuário
export function getUserPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case UserRole.ADMIN:
      return {
        canAccessAI: true,
        canAccessPremiumFeatures: true,
        canAccessAdminPanel: true
      };
    case UserRole.PREMIUM:
      return {
        canAccessAI: true,
        canAccessPremiumFeatures: true,
        canAccessAdminPanel: false
      };
    case UserRole.FREE:
    default:
      return {
        canAccessAI: false,
        canAccessPremiumFeatures: false,
        canAccessAdminPanel: false
      };
  }
}
