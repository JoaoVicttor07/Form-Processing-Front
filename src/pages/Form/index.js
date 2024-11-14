import React, { useState } from 'react';
import './styles.css';

function Index() {
  const [forms, setForms] = useState([]);  // Estado para armazenar os formulários
  const [view, setView] = useState('home');  // Controla a exibição das telas (home, form, review)
  const [user, setUser] = useState({ name: "Usuário Placeholder" });  // Estado para o usuário
  const [error, setError] = useState(null);  // Estado para erros
  const [formToDelete, setFormToDelete] = useState(null);  // Índice do formulário a ser deletado
  const [confirmDelete, setConfirmDelete] = useState(false);  // Estado para controlar a confirmação de exclusão

  // Função para adicionar um novo formulário à lista
  const handleAddForm = (newForm) => {
    setForms((prevForms) => [...prevForms, newForm]);  // Adiciona o novo formulário ao estado
    setView('home');  // Volta para a página inicial após o envio
  };

  // Função para exibir a confirmação de exclusão
  const handleDeleteForm = (index) => {
    setFormToDelete(index);  // Armazena o índice do formulário a ser deletado
    setConfirmDelete(true);  // Exibe a confirmação de exclusão
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = () => {
    setForms((prevForms) => prevForms.filter((_, i) => i !== formToDelete));  // Remove o formulário
    setConfirmDelete(false);  // Fecha a caixa de confirmação
  };

  // Função para cancelar a exclusão
  const handleCancelDelete = () => {
    setConfirmDelete(false);  // Fecha a caixa de confirmação
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
        <button
          className="back-button"
          onClick={() => setView('home')}
        >
          &larr; Voltar
        </button>
        <h2>Formulários Anteriores</h2>
        {forms.length === 0 ? (
          <p>Não existem tickets.</p>  // Mensagem quando não houver formulários
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
                {form.photo && <img src={form.photo} alt="Problema" style={{ width: '100px', height: 'auto' }} />}
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteForm(index)} >
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

  // Função para formatação automática do telefone
  const formatPhone = (phone) => {
    return phone
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'); // Formata no padrão (XX) XXXXX-XXXX
  };

  // Função para lidar com o envio do formulário
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validação simples do formulário
    if (!problem || !callReason || !product || !contactEmail || !contactPhone) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Gerar o token com base no número de formulários já enviados
    // Gerar o token único para cada ticket/formulário
    // O token é gerado com base no número de formulários já enviados
    // Ele serve para identificar e rastrear cada ticket individualmente
    const token = `ticket#${forms.length + 1}`;

    const newForm = {
      problem,
      callReason,
      product,
      contact: { email: contactEmail, phone: contactPhone },
      photo,
      submitDate: new Date().toLocaleDateString(),
      status: 'Aguardando',
      token,  // Incluindo o token
    };

    // Simulação de envio (sem backend)
    try {
      // Simulando uma resposta de sucesso
      const simulatedResponse = { message: 'Ticket criado com sucesso' };
      if (simulatedResponse.message === 'Ticket criado com sucesso') {
        onSubmit(newForm);  // Chama a função onSubmit do componente pai para adicionar o ticket
        setError(null);  // Limpa erros se a simulação for bem-sucedida

        // Limpar os campos após envio
        setProblem('');
        setCallReason('');
        setProduct('');
        setContactEmail('');
        setContactPhone('');
        setPhoto(null);  // Limpar a foto também
      } else {
        setError(simulatedResponse.message || 'Erro ao criar ticket');
      }
    } catch (error) {
      console.error('Erro ao enviar ticket:', error);
      setError('Ocorreu um erro ao enviar o formulário.');
    }
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
          placeholder="Ex.: O dispositivo não liga"
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
          setView('home');  // Retorna para a tela inicial
          setError(null);  // Limpa os erros
        }}
      >
        Cancelar
      </button>
    </form>
  );
}

export default Index;