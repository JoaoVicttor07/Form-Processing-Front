import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Importe a configuração da API
import './styles.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    const errors = { email: false, password: false };
    setFieldErrors(errors);
    setGeneralError('');

    if (!email) errors.email = true;
    else if (!validateEmail(email)) errors.email = true;

    if (!password) errors.password = true;

    if (!email) setGeneralError('Campo de email vazio');
    else if (!validateEmail(email)) setGeneralError('Formato de email inválido');
    else if (!password) setGeneralError('A senha é obrigatória');

    setFieldErrors(errors);

    // Interrompendo se houver qualquer erro
    if (errors.email || errors.password) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.status === 200) {
        const { role } = response.data;
        if (role === 'ADMIN') {
          navigate('/AdminDashboard');
        } else if (role === 'USER') {
          navigate('/Form');
        }
      } else {
        setGeneralError('Email ou senha incorretos');
      }
    } catch (error) {
      setGeneralError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Digite as suas credenciais</h2>
      {generalError && <div className="error-message" aria-live="polite">{generalError}</div>}
      <div>
        <label htmlFor="email">
          Email:<span className="error-asterisk">{fieldErrors.email && '*'}</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldErrors.email ? 'input-error' : ''}
          aria-invalid={fieldErrors.email}
        />
      </div>
      <div>
        <label htmlFor="password">
          Senha:<span className="error-asterisk">{fieldErrors.password && '*'}</span>
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldErrors.password ? 'input-error' : ''}
          aria-invalid={fieldErrors.password}
        />
      </div>
      <button onClick={handleLogin} disabled={loading} className="button-loading">
        {loading ? (
          <>
            Carregando...
            <div className="spinner"></div>
          </>
        ) : (
          'Login'
        )}
      </button>
      <div className="signup-link">
        <p>Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p>
      </div>
    </div>
  );
}

export default Login;