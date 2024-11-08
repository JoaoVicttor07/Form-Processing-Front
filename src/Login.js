import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

function Login() {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate('/user-dashboard');
  };

  const handleAdminLogin = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <button onClick={handleUserLogin}>Logar como Admin</button>
      <button onClick={handleAdminLogin}>Logar como Usuário</button>
      
    </div>
  );
}

export default Login;