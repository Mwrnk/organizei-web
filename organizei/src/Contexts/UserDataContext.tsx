import { ReactNode, createContext, useContext, useState } from 'react';

interface UserDataContextType {
  refreshUserData: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUserData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <UserDataContext.Provider value={{ refreshUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData deve ser usado dentro de um UserDataProvider');
  }
  return context;
} 