import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import RealTimeStats from '../../pages/RealTimesStats';
import './styles.css'; 

const Form = () => {
  const navigate = useNavigate();
  const [motivo, setCallReason] = useState('');
  const [setor, setSector] = useState('');
  const [problema, setProblem] = useState('');
  const [showModal, setShowModal] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/form/create', {
        motivo,
        setor,
        problema,
      });

      if (response.status === 200 || response.status === 201) {
        setShowModal(true); 
      } else {
        setShowModal(true); 
      }
    } catch (error) {
      setShowModal(true); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const navigateToMeusFormularios = () => {
    navigate('/meus-formularios');
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Formulário cadastrado com sucesso!</h3>
            <button onClick={closeModal}>Ok</button>
          </div>
        </div>
      )}

      <button onClick={navigateToMeusFormularios} className="meus-formularios-button">
        Meus Formulários
      </button>

      <div className="real-time-stats-container">
        <RealTimeStats />
      </div>
    </div>
      
    
  );
};

export default Form;