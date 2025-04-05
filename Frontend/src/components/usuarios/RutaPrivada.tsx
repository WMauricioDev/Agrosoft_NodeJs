  import React from 'react';
  import { useAuth } from '../../context/AuthContext';
  import NotAuthenticated from './NotAuthenticated';

  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <>{children}</> : <NotAuthenticated />;
  };

  export default PrivateRoute;