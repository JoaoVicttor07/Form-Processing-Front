import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Certifique-se de ajustar o caminho conforme necessário
import './styles.css'; // Importe o arquivo CSS

const Form = () => {
  const navigate = useNavigate();
  const [motivo, setCallReason] = useState('');
  const [setor, setSector] = useState('');
  const [problema, setProblem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enviando formulário...');

    try {
      const response = await api.post('/form/create', {
        motivo,
        setor,
        problema,
      });

      if (response.status === 200) {
        console.log('Formulário enviado com sucesso!');
      } else {
        console.log('Erro ao enviar o formulário:', response.statusText);
      }
    } catch (error) {
      console.log('Erro ao enviar o formulário:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  return (
    <div className="form-container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2>Formulário de Chamado</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="motivo">Motivo:</label>
          <input
            id="motivo"
            type="text"
            value={motivo}
            onChange={(e) => setCallReason(e.target.value)}
            placeholder="Descreva o motivo"
            required
          />
        </div>
        <div>
          <label htmlFor="setor">Setor:</label>
          <input
            id="setor"
            type="text"
            value={setor}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Informe o setor"
            required
          />
        </div>
        <div>
          <label htmlFor="problema">Problema:</label>
          <input
            id="problema"
            type="text"
            value={problema}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Descreva o problema"
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Form;