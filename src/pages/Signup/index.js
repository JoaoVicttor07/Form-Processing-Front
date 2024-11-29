import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../../services/api';
import RealTimeStats from '../RealTimesStats/index';
import './styles.css';

function Signup() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [captchaValidated, setCaptchaValidated] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ nome: '', email: '', senha: '', confirmSenha: '' });
  const [priorityError, setPriorityError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9Çç~´@.áéíóúâêîôûãõäëïöüÁÉÍÓÚÂÊÎÔÛÃÕÄËÏÖÜ ]/g, '');
  };

  const validateFields = () => {
    const errors = { nome: '', email: '', senha: '', confirmSenha: '' };
    let firstError = '';

    if (!nome) {
      errors.nome = 'O campo nome é obrigatório.';
      firstError = firstError || errors.nome;
    } else if (nome !== sanitizeInput(nome)) {
      errors.nome = 'O campo nome contém caracteres inválidos.';
      firstError = firstError || errors.nome;
    }
    if (!email) {
      errors.email = 'O campo email é obrigatório.';
      firstError = firstError || errors.email;
    } else if (!validateEmail(email)) {
      errors.email = 'Formato de email inválido.';
      firstError = firstError || errors.email;
    }
    if (!senha) {
      errors.senha = 'O campo senha é obrigatório.';
      firstError = firstError || errors.senha;
    } else if (senha.length < 6) {
      errors.senha = 'A senha deve ter no mínimo 6 caracteres.';
      firstError = firstError || errors.senha;
    }
    if (!confirmSenha) {
      errors.confirmSenha = 'Confirmação de senha é obrigatória.';
      firstError = firstError || errors.confirmSenha;
    } else if (senha !== confirmSenha) {
      errors.confirmSenha = 'As senhas não coincidem.';
      firstError = firstError || errors.confirmSenha;
    }

    setFieldErrors(errors);
    setPriorityError(firstError);
    return !firstError; 
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValidated(!!value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFieldErrors({ nome: '', email: '', senha: '', confirmSenha: '' });
    setPriorityError('');
    setSuccess(false);

    if (!validateFields() || !captchaValidated) {
      setPriorityError('Por favor, complete todos os campos e valide o CAPTCHA.');
      return;
    }

    setLoading(true);

    try {
      const sanitizedNome = sanitizeInput(nome);
      const response = await api.post('/auth/register', { nome: sanitizedNome, email, senha });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
      } else {
        setPriorityError('Erro ao criar conta, tente novamente.');
      }
    } catch (error) {
      if (error.response) {
        setPriorityError(error.response.data.message || 'Erro ao criar conta, tente novamente.');
      } else {
        setPriorityError('Erro ao criar conta, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <RealTimeStats /> { }
      <img src="/logoyour.png" alt="Logo" className="logo" />
      <div className="signup-container">
        <h2>Cadastro de Usuário</h2>
        {priorityError && <div className="error-message">{priorityError}</div>}
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="nome">Nome:</label>
            {fieldErrors.nome && <span className="error-asterisk">*</span>}
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(sanitizeInput(e.target.value))}
              className={fieldErrors.nome ? 'input-error' : ''}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            {fieldErrors.email && <span className="error-asterisk">*</span>}
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldErrors.email ? 'input-error' : ''}
            />
          </div>
          <div>
            <label htmlFor="senha">Senha:</label>
            {fieldErrors.senha && <span className="error-asterisk">*</span>}
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={fieldErrors.senha ? 'input-error' : ''}
            />
          </div>
          <div>
            <label htmlFor="confirmSenha">Confirme sua senha:</label>
            {fieldErrors.confirmSenha && <span className="error-asterisk">*</span>}
            <input
              id="confirmSenha"
              type="password"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              className={fieldErrors.confirmSenha ? 'input-error' : ''}
            />
          </div>
          <ReCAPTCHA
            sitekey="6LcBHYsqAAAAAIz6nDnaCMMlKOtEAsg5rsc80jkM"
            onChange={handleCaptchaChange}
          />
          <button type="submit" disabled={!captchaValidated || loading} className="button-loading">
            {loading ? (
              <>
                Carregando...
                <div className="spinner"></div>
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>
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
    </div>
  );
}

export default Signup;