import React, { useState } from 'react';
import './styles.css';
import api from '../../services/api';

function Form({ onSubmit, setView, setError }) {
  const [callReason, setCallReason] = useState('');
  const [sector, setSector] = useState('');
  const [problem, setProblem] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!callReason || !sector || !problem) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const authToken = localStorage.getItem('authToken'); // Obtém o token do localStorage
    if (!authToken) {
      setError('Usuário não autenticado. Faça login novamente.');
      return;
    }

    try {
      const response = await api.post(
        '/form/create', 
        { 
          motivo, 
          setor, 
          problema 
        },
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          } 
        }
      );

      if (response.status === 201) {
        onSubmit(response.data); 
        setError(null);
        setCallReason('');
        setSector('');
        setProblem('');
        setView('home'); 
      } else {
        setError('Erro ao enviar o formulário.');
      }
    } catch (err) {
      console.error('Erro ao enviar o formulário:', err);
      setError(err.response?.data?.message || 'Erro ao conectar ao servidor.');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h3>Criar Formulário</h3>
      <div>
        <label>Motivo:</label>
        <input
          type="text"
          value={motivo}
          onChange={(e) => setCallReason(e.target.value)}
          placeholder="Descreva o motivo"
          required
        />
      </div>
      <div>
        <label>Setor:</label>
        <input
          type="text"
          value={setor}
          onChange={(e) => setSector(e.target.value)}
          placeholder="Indique o setor"
          required
        />
      </div>
      <div>
        <label>Problema:</label>
        <textarea
          value={problema}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Descreva o problema"
          required
        />
      </div>
      <button type="submit">Enviar</button>
      <button
        type="button"
        onClick={() => {
          setCallReason('');
          setSector('');
          setProblem('');
          setView('home');
          setError(null);
        }}
      >
        Cancelar
      </button>
    </form>
  );
}

export default Form;
