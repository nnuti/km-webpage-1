import { useIsAuthenticated } from '@azure/msal-react';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    // const token = localStorage.getItem('idToken');
    // const isAuthenticated = token ? true : false;

    // const isAuthenticated = useIsAuthenticated();
    const isAuthenticated = true;


    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
