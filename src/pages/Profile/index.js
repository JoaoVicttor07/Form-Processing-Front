import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { nome, email } = response.data;
      setNome(nome);
      setEmail(email);
      setLoading(false); // Dados carregados
    } catch (err) {
      setError('Erro ao carregar os dados do usuário.');
      setLoading(false);
    }
  };

  // Função para excluir o perfil
  const deleteProfile = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      setIsDeleting(true); // Define o estado de exclusão para true

      try {
        await axios.delete('http://localhost:8080/user/delete', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Após a exclusão, removemos o token e redirecionamos para a tela de login
        localStorage.removeItem('authToken');
        navigate('/signin');
      } catch (err) {
        setError('Erro ao excluir o perfil. Tente novamente mais tarde.');
        setIsDeleting(false); // Resetar o estado de exclusão
      }
    }
  };

  // Carregar os dados do usuário assim que o componente for montado
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      nome,
      email,
      senha,
    };

    try {
      const response = await axios.put(
        'http://localhost:8080/user/update', // Substitua pelo seu endpoint
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Dados atualizados com sucesso!');
      setError('');
    } catch (err) {
      setMessage('');
      setError('Erro ao atualizar os dados. Verifique os dados fornecidos ou tente novamente mais tarde.');
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>Atualizar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Atualizar</button>
        </div>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Botão de exclusão */}
      <button
        onClick={deleteProfile}
        disabled={isDeleting} // Desabilita o botão enquanto a exclusão está em andamento
        style={{ backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', marginTop: '20px' }}
      >
        {isDeleting ? 'Excluindo...' : 'Excluir Conta'}
      </button>
    </div>
  );
};

export default UpdateProfile;
