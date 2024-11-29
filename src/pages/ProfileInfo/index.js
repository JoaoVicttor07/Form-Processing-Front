import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

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
        alert('Não foi possível carregar o perfil.');
      }
    };

    fetchUserProfile();
  }, []);

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Meu Perfil</h2>
        <p><strong>Nome:</strong> {userData.nome}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <button className="btn btn-primary" onClick={() => navigate('/perfil-update')}>Editar Perfil</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Voltar</button>
      </div>
    </div>
  );
};

export default ProfileInfo;