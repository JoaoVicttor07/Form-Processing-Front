import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileInfo = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:8080/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Não foi possível carregar o perfil.');
      }
    };

    fetchUserProfile();
  }, []);

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Meu Perfil</h1>
      <p><strong>Nome:</strong> {userData.nome}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <button onClick={() => navigate('/perfil-update')}>Editar Perfil</button>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
};

export default ProfileInfo;
