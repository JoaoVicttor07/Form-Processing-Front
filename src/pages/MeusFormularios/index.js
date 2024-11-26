import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import RealTimeStats from '../../pages/RealTimesStats';

const MeusFormularios = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFormularios = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/form/me');
      setFormularios(response.data);
    } catch (error) {
      console.error('Erro ao carregar os formulários:', error);
      setError('Não foi possível carregar os formulários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  const navigateToForm = () => {
    navigate('/form');
  };

  return (
    <div className="form-container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2>Meus Formulários Criados</h2>

      <button onClick={navigateToForm} className="back-to-form-button">
        Voltar para Criar Formulário
      </button>

      {loading ? (
        <p>Carregando formulários...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {formularios.length > 0 ? (
            formularios.map((form) => (
              <li key={form.id}>
                <h4>Motivo: {form.motivo}</h4>
                <p>Setor: {form.setor}</p>
                <p>Problema: {form.problema}</p>
                <p>Status: {form.status}</p>
                <p>Data de Criação: {new Date(form.dataCriacao).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <p>Você ainda não criou nenhum formulário.</p>
          )}
        </ul>
      )}

      <div className="real-time-stats-container">
        <RealTimeStats />
      </div>
    </div>
  );
};

export default MeusFormularios;
