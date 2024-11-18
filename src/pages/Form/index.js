import React, { useState } from 'react';
import './styles.css';
import { sendEmail } from '../../components/emailSender'; // minúsculas
import { generateToken } from '../../components/tokenGenerator'; // minúsculas

function Index() {
  const [forms, setForms] = useState([]);
  const [view, setView] = useState('home');
  const [user, setUser] = useState({ name: "Usuário Placeholder" });
  const [error, setError] = useState(null);
  const [formToDelete, setFormToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAddForm = async (newForm) => {
    // Gera o token único para o formulário
    const token = generateToken(forms.length);

    // Cria o formulário com o token
    const updatedForm = { ...newForm, token };

    try {
      // Simula o envio de e-mail com informações do ticket
      await sendEmail(updatedForm.contact.email, token, updatedForm.status);

      // Adiciona o formulário à lista
      setForms((prevForms) => [...prevForms, updatedForm]);
      setView('home'); // Retorna à tela inicial após o envio
    } catch (err) {
      console.error("Erro ao enviar o e-mail:", err);
      setError(err.message || "Erro ao enviar o e-mail.");
    }
  };

  const handleDeleteForm = (index) => {
    setFormToDelete(index);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    setForms((prevForms) => prevForms.filter((_, i) => i !== formToDelete));
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="container">
      {/* Tela inicial */}
      <div className={`home ${view === 'home' ? 'active' : ''}`}>
        <h1>Serviços Eletrônicos</h1>
        <p>Bem-vindo, {user.name}</p>
        <button onClick={() => setView('form')}>Criar Novo Formulário</button>
        {forms.length > 0 && (
          <button onClick={() => setView('review')}>Ver Formulários Anteriores</button>
        )}
      </div>

      {/* Tela de formulário */}
      <div className={`form ${view === 'form' ? 'active' : ''}`}>
        <Form onSubmit={handleAddForm} setView={setView} setError={setError} forms={forms} />
      </div>

      {/* Tela de revisão dos formulários enviados */}
      <div className={`review ${view === 'review' ? 'active' : ''}`}>
        <button className="back-button" onClick={() => setView('home')}>
          &larr; Voltar
        </button>
        <h2>Formulários Anteriores</h2>
        {forms.length === 0 ? (
          <p>Não existem tickets.</p>
        ) : (
          <ul>
            {forms.map((form, index) => (
              <li key={index}>
                <p><strong>Token:</strong> {form.token}</p>
                <p><strong>Motivo:</strong> {form.callReason}</p>
                <p><strong>Produto:</strong> {form.product}</p>
                <p><strong>Problema:</strong> {form.problem}</p>
                <p><strong>Data de Envio:</strong> {form.submitDate}</p>
                <p><strong>Status:</strong> {form.status}</p>
                <p><strong>Contato:</strong> {form.contact.email}, {form.contact.phone}</p>
                {form.photo && (
                  <img
                    src={form.photo}
                    alt="Problema"
                    style={{ width: '100px', height: 'auto' }}
                  />
                )}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteForm(index)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Caixa de confirmação de exclusão */}
      {confirmDelete && (
        <div className="confirmation-box">
          <p>Tem certeza de que deseja apagar este ticket?</p>
          <button onClick={handleConfirmDelete}>Sim</button>
          <button onClick={handleCancelDelete}>Cancelar</button>
        </div>
      )}

      {/* Exibição de erros */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

function Form({ onSubmit, setView, setError, forms }) {
  const [problem, setProblem] = useState('');
  const [callReason, setCallReason] = useState('');
  const [product, setProduct] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photo, setPhoto] = useState(null);

  const formatPhone = (phone) => {
    return phone
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!problem || !callReason || !product || !contactEmail || !contactPhone) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const newForm = {
      problem,
      callReason,
      product,
      contact: { email: contactEmail, phone: contactPhone },
      photo,
      submitDate: new Date().toLocaleDateString(),
      status: 'Aguardando',
    };

    onSubmit(newForm);
    setError(null);
    setProblem('');
    setCallReason('');
    setProduct('');
    setContactEmail('');
    setContactPhone('');
    setPhoto(null);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h3>Relatar Problema</h3>
      <div>
        <label>Motivo da Chamada:</label>
        <input
          type="text"
          value={callReason}
          onChange={(e) => setCallReason(e.target.value)}
          placeholder="Ex.: Vírus"
          required
        />
      </div>
      <div>
        <label>Produto Relacionado:</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Ex.: Notebook"
          required
        />
      </div>
      <div>
        <label>Problema:</label>
        <input
          type="text"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Ex.: O dispositivo não liga..."
          required
        />
      </div>
      <h3>Para Contato</h3>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Ex.: usuario@dominio.com"
          required
        />
      </div>
      <div>
        <label>Telefone:</label>
        <input
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(formatPhone(e.target.value))}
          placeholder="Ex.: (11) 98765-4321"
          required
        />
      </div>
      <div>
        <label>Foto (opcional):</label>
        <input
          type="file"
          onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
        />
      </div>
      <button type="submit">Enviar</button>
      <button
        type="button"
        onClick={() => {
          setProblem('');
          setCallReason('');
          setProduct('');
          setContactEmail('');
          setContactPhone('');
          setPhoto(null);
          setView('home');
          setError(null);
        }}
      >
        Cancelar
      </button>
    </form>
  );
}

export default Index;