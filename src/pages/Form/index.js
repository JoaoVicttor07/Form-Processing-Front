import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles.css'; // ou o arquivo de estilos que você estiver usando

function Index() {
  const [forms, setForms] = useState([]);  // Estado para armazenar os formulários enviados
  const [user, setUser] = useState({ name: "Usuário Placeholder" });  // Estado para o usuário

  // Função para adicionar um novo formulário à lista
  const handleAddForm = (newForm) => {
    setForms([...forms, newForm]);
  };

  return (
    <div>
      <h1>Serviços Eletrônicos</h1>
      <p>Bem-vindo, {user.name}</p>

      {/* Componente Form, passando a função handleAddForm como prop */}
      <Form onSubmit={handleAddForm} />

      {/* Exibindo a lista de formulários enviados */}
      <h2>Formulários Enviados</h2>
      <ul>
        {forms.map((form, index) => (
          <li key={index}>
            <p><strong>Problema:</strong> {form.problem}</p>
            <p><strong>Motivo:</strong> {form.callReason}</p>
            <p><strong>Produto:</strong> {form.product}</p>
            <p><strong>Data de Envio:</strong> {form.submitDate}</p>
            <p><strong>Status:</strong> {form.status}</p>
            <p><strong>Contato:</strong> {form.contact.email}, {form.contact.phone}</p>
            {form.photo && <img src={form.photo} alt="Problema" style={{ width: '100px', height: 'auto' }} />}
          </li>
        ))}
      </ul>
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

  // Função para lidar com o envio do formulário
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newForm = {
      problem,
      callReason,
      product,
      contact: { email: contactEmail, phone: contactPhone },
      photo,
      submitDate: new Date().toLocaleDateString(),
      status: 'Enviado'
    };
    onSubmit(newForm);  // Chama a função onSubmit recebida como prop do componente pai
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
        <label>Problema:</label>
        <input type="text" value={problem} onChange={(e) => setProblem(e.target.value)} required />
      </div>
      <div>
        <label>Motivo da Chamada:</label>
        <input type="text" value={callReason} onChange={(e) => setCallReason(e.target.value)} required />
      </div>
      <div>
        <label>Produto Relacionado:</label>
        <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} required />
      </div>
      <div>
        <label>Email para Contato:</label>
        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
      </div>
      <div>
        <label>Telefone para Contato:</label>
        <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
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

export default Form;