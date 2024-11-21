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
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [priorityError, setPriorityError] = useState(''); // Novo estado para erro prioritário
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateFields = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '' };
    let firstError = ''; // Mensagem do erro prioritário

    // Validações
    if (!name) {
        errors.name = 'O campo nome é obrigatório.';
        firstError = firstError || errors.name;
    }
    if (!email) {
        errors.email = 'O campo email é obrigatório.';
        firstError = firstError || errors.email;
    } else if (!validateEmail(email)) {
        errors.email = 'Formato de email inválido.';
        firstError = firstError || errors.email;
    }
    if (!password) {
        errors.password = 'O campo senha é obrigatório.';
        firstError = firstError || errors.password;
    } else if (password.length < 6) { // Condição para no mínimo 6 caracteres
        errors.password = 'A senha deve ter no mínimo 6 caracteres.';
        firstError = firstError || errors.password;
    }
    if (!confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória.';
        firstError = firstError || errors.confirmPassword;
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem.';
        firstError = firstError || errors.confirmPassword;
    }

    setFieldErrors(errors);
    setPriorityError(firstError); // Define o erro prioritário
    return !firstError; // Retorna true se não houver erros
};


  const handleSignup = async (e) => {
    e.preventDefault(); // Prevenir comportamento padrão do formulário
    setFieldErrors({ name: '', email: '', password: '', confirmPassword: '' });
    setPriorityError('');
    setSuccess(false);

    if (!validateFields()) return; // Interrompe se houver erros

    setLoading(true);

    try {
      console.log('Enviando dados para a API:', { name, email, password });
      const response = await api.post('/auth/register', { name, email, password });
      console.log('Resposta da API:', response);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
      } else {
        setPriorityError('Erro ao criar conta, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      if (error.response) {
        console.error('Dados da resposta de erro:', error.response.data);
        setPriorityError(error.response.data.message || 'Erro ao criar conta, tente novamente.');
      } else {
        setPriorityError('Erro ao criar conta, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Crie sua conta</h2>
      {priorityError && <div className="error-message" aria-live="polite">{priorityError}</div>}
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldErrors.name ? 'input-error' : ''}
            aria-invalid={fieldErrors.name ? 'true' : 'false'}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldErrors.email ? 'input-error' : ''}
            aria-invalid={fieldErrors.email ? 'true' : 'false'}
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldErrors.password ? 'input-error' : ''}
            aria-invalid={fieldErrors.password ? 'true' : 'false'}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirme a Senha:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldErrors.confirmPassword ? 'input-error' : ''}
            aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
          />
        </div>
        <button type="submit" disabled={loading} className="button-loading">
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
  );
}

export default Signup;
