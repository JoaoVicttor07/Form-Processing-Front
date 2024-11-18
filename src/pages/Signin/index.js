import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  const handleLogin = () => {
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

    // Simulação de autenticação
    if (email === 'admin@exemplo.com' && password === 'admin123') {
      navigate('/AdminDashboard');
    } else if (email === 'usuario@example.com' && password === 'usuario123') {
      navigate('/Form');
    } else {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div>
    <img src= "/logoyour.png" alt=" logo" />
    <div className="login-container">
      <h3>Inicie sessão na Your Ticket</h3>
      {error && <div className="error-message">{error}</div>}
      <div>
        
        {emailError && <span className="error-asterisk">*</span>}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
       
        {passwordError && <span className="error-asterisk">*</span>}
        <input
          type="password"
          placeholder='Senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Acessar</button>
      <div className="signup-link">
        <p>Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p>
      </div>
    </div>
    </div>
  );
}

export default Login;