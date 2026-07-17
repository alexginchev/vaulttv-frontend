import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('vaulttv_user');
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = (token, username, role) => {
    localStorage.setItem('vaulttv_token', token);
    const userData = { username, role };
    localStorage.setItem('vaulttv_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('vaulttv_token');
    localStorage.removeItem('vaulttv_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}