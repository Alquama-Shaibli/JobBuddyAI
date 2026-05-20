import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';


function PrivateRoute( { children } ) {
  const { currentUser, loading } = useAuth();
  console.log(currentUser);

  if(loading) return <div>Loading...</div>;

  if(!currentUser) return <Navigate to= '/sign-in' />;

  return children;
}

export default PrivateRoute