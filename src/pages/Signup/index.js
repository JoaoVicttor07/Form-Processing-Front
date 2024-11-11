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
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignup = () => {
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

    // Verificar formato de email
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

    // Verificar critérios da senha
    if (password.length < 6) {
      setPasswordError(true);
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(true);
      setError('O campo confirmar senha é obrigatório.');
      return;
    }

    // Verificar correspondência da senha com confirmar senha
    if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
      setError('As senhas não coincidem.');
      return;
    }

    // Enviar dados para o backend (simulação)
    console.log('Cadastro realizado:', { name, email, password });
    setSuccess(true);
  };

  return (
    <div className="signup-container">
      <h2>Cadastro de Usuário</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <label>Nome:</label>
        {nameError && <span className="error-asterisk">*</span>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        {emailError && <span className="error-asterisk">*</span>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Senha:</label>
        {passwordError && <span className="error-asterisk">*</span>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirmar Senha:</label>
        {confirmPasswordError && <span className="error-asterisk">*</span>}
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