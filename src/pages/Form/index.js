import React, { useState } from 'react';
import './styles.css';

function Form() {
  const [problem, setProblem] = useState('');
  const [callReason, setCallReason] = useState('');
  const [product, setProduct] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photo, setPhoto] = useState(null);
  
  // Lista de formulários enviados
  const [forms, setForms] = useState([]);

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

    // Adiciona o formulário enviado à lista de formulários
    setForms([...forms, newForm]);

    // Reset campos após envio
    setProblem('');
    setCallReason('');
    setProduct('');
    setContactEmail('');
    setContactPhone('');
    setPhoto(null);
  };

  return (
    <div>
      <h1>Serviços Eletrônicos</h1>
      
      {/* Formulário de relato */}
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

      {/* Lista de formulários enviados */}
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

export default Form;