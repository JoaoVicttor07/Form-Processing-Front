import React, { useState } from 'react';
import './Login.css';

function Form({ onSubmit }) {
  const [problem, setProblem] = useState('');
  const [callReason, setCallReason] = useState('');
  const [product, setProduct] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      problem,
      callReason,
      product,
      contact: { email: contactEmail, phone: contactPhone },
      photo,
      submitDate: new Date().toLocaleDateString(),
      status: 'Enviado'
    });
    // Reset fields after submit
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
        // Opção de cancelar e resetar campos
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