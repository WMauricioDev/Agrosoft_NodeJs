  import React from 'react';
  import { useAuth } from '../../context/AuthContext';
  // import NotAuthenticated from './NotAuthenticated';
  import LoginPage from '@/pages/usuarios/LoginPage';
  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <>{children}</> : <LoginPage />;
  };

  export default PrivateRoute;