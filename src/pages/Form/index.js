import React, { useState } from 'react';
import './styles.css';

function Index() {
  const [forms, setForms] = useState([]);
  const [user, setUser] = useState({ name: "Usuário Placeholder" });
  const [currentPage, setCurrentPage] = useState('home');

  const handleAddForm = (newForm) => {
    setForms([...forms, newForm]);
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleCreateNewForm = () => {
    setCurrentPage('form');
  };

  const handleReviewForm = () => {
    setCurrentPage('review');
  };

  return (
    <div className="container">
      <h1>Serviços Eletrônicos</h1>
      <p>Bem-vindo, {user.name}</p>

      {/* Página inicial */}
      <div className={`home ${currentPage === 'home' ? 'active' : ''}`}>
        <h2>Escolha uma opção:</h2>
        <button onClick={handleCreateNewForm}>Criar Novo Formulário</button>
        {forms.length > 0 && (
          <button onClick={handleReviewForm}>Revisar Formulários Enviados</button>
        )}
      </div>

      {/* Página de formulário */}
      <div className={`form ${currentPage === 'form' ? 'active' : ''}`}>
        <h2>Criar Novo Formulário</h2>
        <Form onSubmit={handleAddForm} />
        <button onClick={handleBackToHome}>Voltar para Página Inicial</button>
      </div>

      {/* Página de revisão de formulários */}
      <div className={`review ${currentPage === 'review' ? 'active' : ''}`}>
        <h2>Formulários Enviados</h2>
        <ul>
          {forms.length > 0 ? (
            forms.map((form, index) => (
              <li key={index}>
                <p><strong>Problema:</strong> {form.problem}</p>
                <p><strong>Motivo:</strong> {form.callReason}</p>
                <p><strong>Produto:</strong> {form.product}</p>
                <p><strong>Data de Envio:</strong> {form.submitDate}</p>
                <p><strong>Status:</strong> {form.status}</p>
                <p><strong>Contato:</strong> {form.contact.email}, {form.contact.phone}</p>
                {form.photo && <img src={form.photo} alt="Problema" />}
              </li>
            ))
          ) : (
            <p>Nenhum formulário enviado ainda.</p>
          )}
        </ul>
        <button onClick={handleBackToHome}>Voltar para Página Inicial</button>
      </div>
    </div>
  );
}

function Form({ onSubmit }) {
  const [problem, setProblem] = useState('');
  const [callReason, setCallReason] = useState('');
  const [product, setProduct] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newForm = {
      problem,
      callReason,
      product,
      contact: { email: contactEmail, phone: contactPhone },
      photo,
      submitDate: new Date().toLocaleDateString(),
      status: 'Enviado',
    };
    onSubmit(newForm);
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
          required
        />
      </div>
      <div>
        <label>Produto Relacionado:</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Problema:</label>
        <input
          type="text"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
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
          required
        />
      </div>
      <div>
        <label>Telefone:</label>
        <input
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Foto do Problema:</label>
        <input type="file" onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))} />
      </div>
      <button type="submit">Enviar</button>
      <button type="button" onClick={() => {
        setProblem('');
        setCallReason('');
        setProduct('');
        setContactEmail('');
        setContactPhone('');
        setPhoto(null);
      }}>Cancelar</button>
    </form>
  );
}

export default Index;