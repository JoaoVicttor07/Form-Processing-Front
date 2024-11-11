import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (!validateEmail(email)) {
      setError('Formato de email inválido');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    // Enviar dados para o backend (simulação)
    console.log('Cadastro realizado:', { name, email, password });
    navigate('/');
  };

  return (
    <div className="signup-container">
      <h2>Cadastro de Usuário</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirmar Senha:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handleSignup}>Cadastrar</button>
      <div className="login-link">
        <p>Já tem uma conta? <Link to="/">Faça login</Link></p>
      </div>
    </div>
  );
}

export default Signup;