import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import RealTimeStats from '../../pages/RealTimesStats';
import './styles.css'; 
import { jwtDecode } from 'jwt-decode';

const Form = () => {
  const navigate = useNavigate();
  const [motivo, setCallReason] = useState('');
  const [setor, setSector] = useState('');
  const [problema, setProblem] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [showFormularios, setShowFormularios] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      const nome = decodedToken.nome;
      setUserName(nome);
    }
  }, []);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9Çç~´áéíóúâêîôûãõäëïöüÁÉÍÓÚÂÊÎÔÛÃÕÄËÏÖÜ ]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (setor === '') {
      setFormError('Por favor, selecione um setor válido.');
      return;
    }

    const token = localStorage.getItem('authToken');

    try {
      const response = await api.post('/form/create', {
        motivo,
        setor,
        problema,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        setShowModal(true); 
        fetchFormularios();
        setFormError('');
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

  const fetchFormularios = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/form/me');
      setFormularios(response.data);
      setShowFormularios(true);
    } catch (error) {
      console.error('Erro ao carregar os formulários:', error);
      setError('Não foi possível carregar os formulários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const closeFormularios = () => {
    setShowFormularios(false);
  };

  const goToUpdateProfile = () => {
    navigate('/perfil-info');
  };

  return (
    <div>
      <button id="form-logout-button" onClick={handleLogout}>Logout</button>
      <button id="update-profile-button" onClick={goToUpdateProfile}>Atualizar Perfil</button>

      <div className="form-page">
        <RealTimeStats />
        {userName && <p className="welcome-message">Bem-vindo(a), {userName}!</p>}
        <div className="form-container">
          <h2>Formulário de Chamado</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                id="motivo"
                type="text"
                value={motivo}
                onChange={(e) => setCallReason(sanitizeInput(e.target.value))}
                placeholder="Descreva o motivo"
                required
              />
            </div>
            <div>
              <select
                id="setor"
                value={setor}
                onChange={(e) => setSector(e.target.value)}
                required
              >
                <option value="">Selecione o setor</option>
                <option value="Técnico">Técnico</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Logística">Logística</option>
              </select>
            </div>
            <div>
              <input
                id="problema"
                type="text"
                value={problema}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Descreva o problema"
                required
              />
            </div>
            {formError && <p style={{ color: 'red' }}>{formError}</p>}
            <button type="submit">Enviar</button>
          </form>

          {showModal && (
            <div id="modal-form">
              <div id="modal-form-content">
                <h3>Formulário cadastrado com sucesso!</h3>
                <button onClick={closeModal}>Ok</button>
              </div>
            </div>
          )}
          <button onClick={fetchFormularios} className="meus-formularios-button">
            Meus Formulários
          </button>

          {showFormularios && (
            <>
              <h2>Meus Formulários Criados</h2>
              <button onClick={closeFormularios} className="close-formularios-button">
                Fechar Formulários
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
                        <p>Id: {form.id}</p>
                        <p>Status: {form.status}</p>
                        <p>Mensagem: {form.mensagem}</p>
                        <p>Data de Criação: {new Date(form.dataCriacao).toLocaleString()}</p>
                        <p>Ultima att: {new Date(form.dataAtualizacao).toLocaleString()}</p>
                      </li>
                    ))
                  ) : (
                    <p>Você ainda não criou nenhum formulário.</p>
                  )}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;