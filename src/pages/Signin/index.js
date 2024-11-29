import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';
import RealTimeStats from '../RealTimesStats/index';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: false, senha: false });
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = { email: false, senha: false };
    setFieldErrors(errors);
    setGeneralError('');

    if (!email) errors.email = true;
    else if (!validateEmail(email)) errors.email = true;

    if (!senha) errors.senha = true;

    if (!email) setGeneralError('Campo de email vazio');
    else if (!validateEmail(email)) setGeneralError('Formato de email inválido');
    else if (!senha) setGeneralError('A senha é obrigatória');

    setFieldErrors(errors);

    if (errors.email || errors.senha) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, senha }, { headers: { 'Content-Type': 'application/json' } });

      if (response.status === 200) {
        const { token } = response.data;
        let role;
        try {
          const decoded = jwtDecode(token);
          role = decoded.role;
        } catch (err) {
          setGeneralError('Erro ao processar informações do usuário');
          return;
        }

        localStorage.setItem('authToken', token);

        if (role === 'ADMIN') {
          navigate('/AdminDashboard');
        } else if (role === 'USER') {
          navigate('/Form');
        } else {
          setGeneralError('Role desconhecido');
        }
      } else {
        setGeneralError('Email ou senha incorretos');
      }
    } catch (error) {
      setGeneralError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <RealTimeStats /> { }
      <img src="/logoyour.png" alt="Logo" className="logo" />
      <div className="login-container">
        <h2>Inicie sessão na Your Ticket</h2>
        {generalError && <div className="error-message" aria-live="polite">{generalError}</div>}
        <div>
          <label htmlFor="email">
            <span className="error-asterisk">{fieldErrors.email && '*'}</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder='E-mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldErrors.email ? 'input-error' : ''}
            aria-invalid={fieldErrors.email}
          />
        </div>
        <div>
          <label htmlFor="senha">
            <span className="error-asterisk">{fieldErrors.senha && '*'}</span>
          </label>
          <input
            id="senha"
            type="password"
            placeholder='Senha'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={fieldErrors.senha ? 'input-error' : ''}
            aria-invalid={fieldErrors.senha}
          />
        </div>
        <button onClick={handleLogin} disabled={loading} className="button-loading">
          {loading ? (
            <>
              Carregando...
              <div className="spinner"></div>
            </>
          ) : (
            'Acessar'
          )}
        </button>
        <div className="signup-link">
          <p>Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;