import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api'; 
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
      console.log('Enviando requisição para /auth/login com:', { email, senha });
      const response = await api.post('/auth/login', { email, senha }, { headers: { 'Content-Type': 'application/json' } });
      console.log('Resposta da API:', response);

      if (response.status === 200) {
        const { token } = response.data;
        console.log('Token recebido:', token);

        let role;
        try {
          const decoded = jwtDecode(token);
          role = decoded.role;
          console.log('Campo role decodificado do token:', role);
        } catch (err) {
          console.error('Erro ao decodificar o token:', err);
          setGeneralError('Erro ao processar informações do usuário');
          return;
        }

        localStorage.setItem('authToken', token);

        if (role === 'ADMIN') {
          console.log('Usuário é ADMIN, redirecionando para /AdminDashboard');
          navigate('/AdminDashboard');
        } else if (role === 'USER') {
          console.log('Usuário é USER, redirecionando para /Form');
          navigate('/Form');
        } else {
          console.log('Role desconhecido:', role);
          setGeneralError('Role desconhecido');
        }
      } else {
        setGeneralError('Email ou senha incorretos');
        console.log('Email ou senha incorretos');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setGeneralError('Email ou senha incorretos');
      } else {
        setGeneralError('Erro ao conectar com o servidor');
      }
      console.error('Erro ao conectar com o servidor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src="/logoyour.png" alt="Logo" className="logo" />
      <div className="login-container">
        <h3>Inicie sessão na Your Ticket</h3>
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
          <label htmlFor="senha">
            Senha:<span className="error-asterisk">{fieldErrors.senha && '*'}</span>
          </label>
          <input
            id="senha"
            type="password"
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
            'Login'
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