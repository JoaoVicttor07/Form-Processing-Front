import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Importe a configuração da API
import './styles.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => { // Marque a função como async
    let valid = true;
    setEmailError(false);
    setPasswordError(false);

    if (!email && !password) {
      setEmailError(true);
      setPasswordError(true);
      setError('Campos obrigatórios não preenchidos');
      valid = false;
    } else if (!email) {
      setEmailError(true);
      setError('Campos obrigatórios não preenchidos');
      valid = false;
    } else if (!password) {
      setPasswordError(true);
      setError('Campos obrigatórios não preenchidos');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError(true);
      setError('Formato de email inválido');
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.status === 200) {
        const { role } = response.data;
        if (role === 'admin') {
          navigate('/AdminDashboard');
        } else if (role === 'user') {
          navigate('/Form');
        }
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Digite as suas credenciais</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div className="error-message">Email é obrigatório</div>}
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div className="error-message">Senha é obrigatória</div>}
      </div>
      <button onClick={handleLogin}>Login</button>
      <div className="signup-link">
        <p>Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p>
      </div>
    </div>
  );
}

export default Login;