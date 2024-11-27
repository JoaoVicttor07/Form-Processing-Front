import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Importe a configuração da API
import './styles.css'; // Importe o arquivo de estilos

const UpdateProfile = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Para controlar o carregamento dos dados
  const [isDeleting, setIsDeleting] = useState(false); // Para controlar o estado de exclusão

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); // Assume que o token JWT está armazenado no localStorage

  // Função para carregar os dados do usuário
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Fetching user data with token:', token);
      const response = await api.get('/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userData = response.data;
      setNome(userData.nome);
      setEmail(userData.email);
      console.log('User data fetched successfully:', userData);
    } catch (error) {
      console.error('Erro ao carregar os dados do usuário:', error);
      setError('Erro ao carregar os dados do usuário.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9Çç~´@.áéíóúâêîôûãõäëïöüÁÉÍÓÚÂÊÎÔÛÃÕÄËÏÖÜ ]/g, '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.put('/user/profile', { nome: sanitizeInput(nome), email: sanitizeInput(email), senha: sanitizeInput(senha) }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Perfil atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      setError('Erro ao atualizar o perfil.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage('');
    setError('');

    try {
      await api.delete('/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      localStorage.removeItem('authToken');
      navigate('/signin');
    } catch (error) {
      console.error('Erro ao excluir o perfil:', error);
      setError('Erro ao excluir o perfil.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navega para a página anterior
  };

  return (
    <div className="profile-container">
      <h2>Atualizar Perfil</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <form onSubmit={handleUpdate} className="profile-form">
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
            <label htmlFor="senha">Senha:</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(sanitizeInput(e.target.value))}
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary">Atualizar</button>
        </form>
      )}
      <button onClick={handleDelete} disabled={isDeleting} className="btn btn-danger">
        {isDeleting ? 'Excluindo...' : 'Excluir Perfil'}
      </button>
      <button onClick={handleBack} className="btn btn-secondary">Voltar</button>
    </div>
  );
};

export default UpdateProfile;