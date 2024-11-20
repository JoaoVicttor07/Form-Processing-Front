import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Importe a configuração da API
import './styles.css';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignup = async () => {
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setError('');
    setSuccess(false);

    // Verificar se todos os campos estão vazios
    if (!name && !email && !password && !confirmPassword) {
      setNameError(true);
      setEmailError(true);
      setPasswordError(true);
      setConfirmPasswordError(true);
      setError('Todos os campos são obrigatórios.');
      return;
    }

    // Verificar campos específicos vazios
    if (!name) {
      setNameError(true);
      setError('O campo nome é obrigatório.');
      return;
    }

    if (!email) {
      setEmailError(true);
      setError('O campo email é obrigatório.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      setError('Formato de email inválido.');
      return;
    }

    if (!password) {
      setPasswordError(true);
      setError('O campo senha é obrigatório.');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando dados para a API:', { name, email, password });
      const response = await api.post('/auth/register', { name, email, password });
      console.log('Resposta da API:', response);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
      } else {
        setError('Erro ao criar conta, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      if (error.response) {
        console.error('Dados da resposta de erro:', error.response.data);
        setError(error.response.data.message || 'Erro ao criar conta, tente novamente.');
      } else {
        setError('Erro ao criar conta, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Crie sua conta</h2>
      {error && <div className="error-message" aria-live="polite">{error}</div>}
      <div>
        <label htmlFor="name">Nome:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={nameError ? 'input-error' : ''}
          aria-invalid={nameError}
        />
        {nameError && <div className="error-message">O campo nome é obrigatório.</div>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={emailError ? 'input-error' : ''}
          aria-invalid={emailError}
        />
        {emailError && <div className="error-message">{emailError === 'Formato de email inválido.' ? 'Formato de email inválido.' : 'O campo email é obrigatório.'}</div>}
      </div>
      <div>
        <label htmlFor="password">Senha:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={passwordError ? 'input-error' : ''}
          aria-invalid={passwordError}
        />
        {passwordError && <div className="error-message">O campo senha é obrigatório.</div>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirme a Senha:</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={confirmPasswordError ? 'input-error' : ''}
          aria-invalid={confirmPasswordError}
        />
        {confirmPasswordError && <div className="error-message">As senhas não coincidem.</div>}
      </div>
      <button onClick={handleSignup} disabled={loading} className="button-loading">
        {loading ? (
          <>
            Carregando...
            <div className="spinner"></div>
          </>
        ) : (
          'Cadastrar'
        )}
      </button>
      <div className="login-link">
        <p>Já tem uma conta? <Link to="/">Faça login</Link></p>
      </div>

      {success && (
        <div className="modal">
          <div className="modal-content">
            <h3>Cadastro realizado com sucesso!</h3>
            <button onClick={() => navigate('/')}>Faça login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;