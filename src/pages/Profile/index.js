import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

const UpdateProfile = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (!token) {
        setError('Token inválido. Faça login novamente.');
        navigate('/signin');
        return;
      }

      const response = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { nome, email } = response.data;
      setNome(nome);
      setEmail(email);
    } catch (error) {
      console.error('Erro ao carregar os dados do usuário:', error);
      setError('Erro ao carregar os dados do usuário.');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9Çç~´@.áéíóúâêîôûãõäëïöüÁÉÍÓÚÂÊÎÔÛÃÕÄËÏÖÜ ]/g, '');
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    const isNomeValid = nome.trim() !== '';
    const isEmailValidFormat = isEmailValid(email);
    const isSenhaValid = senha.length >= 6;
    const isConfirmarSenhaValid = confirmarSenha.length >= 6 && senha === confirmarSenha;

    return isNomeValid && isEmailValidFormat && isSenhaValid && isConfirmarSenhaValid;
  };

  const handleUpdate = async () => {
    setMessage('');
    setError('');

    if (!isFormValid()) {
      setError('Todos os campos são obrigatórios, o e-mail deve ser válido e as senhas devem ter pelo menos 6 caracteres e coincidir.');
      return;
    }

    const sanitizedNome = sanitizeInput(nome);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSenha = senha ? sanitizeInput(senha) : '';

    const userData = { nome: sanitizedNome, email: sanitizedEmail };
    if (sanitizedSenha) {
      userData.senha = sanitizedSenha;
    }

    try {
      await api.put('/user/update', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Perfil atualizado com sucesso.');
      localStorage.removeItem('authToken');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      setError('Erro ao atualizar o perfil.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete('/user/delete', {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Conta excluída com sucesso.');
      localStorage.removeItem('authToken');
      navigate('/signup');
    } catch (error) {
      console.error('Erro ao excluir a conta:', error);
      setError('Erro ao excluir a conta.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const openConfirmationModal = (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const openDeleteConfirmationModal = (e) => {
    e.preventDefault();
    setShowDeleteConfirmationModal(true);
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  return (
    <div className="profile-container">
      <h2>Atualizar Perfil</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <form onSubmit={openConfirmationModal} className="profile-form">
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(sanitizeInput(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(sanitizeInput(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Nova Senha:</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(sanitizeInput(e.target.value))}
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Nova Senha:</label>
            <input
              id="confirmarSenha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(sanitizeInput(e.target.value))}
              minLength="6"
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={!isFormValid()}>Atualizar</button>
            <button type="button" onClick={openDeleteConfirmationModal} className="btn btn-danger">Excluir Conta</button>
          </div>
        </form>
      )}
      <button onClick={handleBack} className="btn btn-secondary">Voltar</button>

      {showConfirmationModal && (
        <div id="confirmation-modal">
          <div id="confirmation-modal-content">
            <p>Tem certeza que deseja atualizar seu perfil? Você será redirecionado para o login após a atualização.</p>
            <button className="btn btn-primary" onClick={handleUpdate}>Confirmar ação</button>
            <button className="btn btn-secondary" onClick={closeConfirmationModal}>Cancelar</button>
          </div>
        </div>
      )}

      {showDeleteConfirmationModal && (
        <div id="delete-confirmation-modal">
          <div id="delete-confirmation-modal-content">
            <p>Tem certeza que deseja excluir sua conta? Esta ação é irreversível.</p>
            <button className="btn btn-danger" onClick={handleDelete}>Confirmar Ação</button>
            <button className="btn btn-secondary" onClick={closeDeleteConfirmationModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;