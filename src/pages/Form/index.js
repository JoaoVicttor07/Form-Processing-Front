import React, { useState, useEffect } from 'react';
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
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        fetchFormularios(); // Atualiza a lista de formulários após a criação
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

      <h2>Meus Formulários Criados</h2>
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
    </div>
  );
};

export default Form;