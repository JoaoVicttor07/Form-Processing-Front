import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Importe a configuração da API
import './styles.css';

function Signup() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ nome: '', email: '', senha: '', confirmSenha: '' });
  const [priorityError, setPriorityError] = useState(''); // Novo estado para erro prioritário
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateFields = () => {
    const errors = { nome: '', email: '', senha: '', confirmSenha: '' };
    let firstError = ''; // Mensagem do erro prioritário

    // Validações
    if (!nome) {
        errors.nome = 'O campo nome é obrigatório.';
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
    } else if (senha.length < 6) { // Condição para no mínimo 6 caracteres
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
    setPriorityError(firstError); // Define o erro prioritário
    return !firstError; // Retorna true se não houver erros
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevenir comportamento padrão do formulário
    setFieldErrors({ nome: '', email: '', senha: '', confirmSenha: '' });
    setPriorityError('');
    setSuccess(false);

    if (!validateFields()) return; // Interrompe se houver erros

    setLoading(true);

    try {
      console.log('Enviando dados para a API:', { nome, email, senha });
      const response = await api.post('/auth/register', { nome, email, senha });
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
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={fieldErrors.nome ? 'input-error' : ''}
            aria-invalid={fieldErrors.nome ? 'true' : 'false'}
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
          <label htmlFor="senha">Senha:</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={fieldErrors.senha ? 'input-error' : ''}
            aria-invalid={fieldErrors.senha ? 'true' : 'false'}
          />
        </div>
        <div>
          <label htmlFor="confirmSenha">Confirme a Senha:</label>
          <input
            id="confirmSenha"
            type="password"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
            className={fieldErrors.confirmSenha ? 'input-error' : ''}
            aria-invalid={fieldErrors.confirmSenha ? 'true' : 'false'}
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