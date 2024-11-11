import React, { useState } from 'react';
import PhoneInput from './PhoneInput';
import './Login.css';

function FormList({ onAddForm }) {
  const [formData, setFormData] = useState({
    problem: '',
    callReason: '',
    product: '',
    submitDate: new Date().toLocaleDateString(),
    status: 'Em andamento',
    contact: {
      email: '',
      phone: ''
    },
    photo: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact')) {
      setFormData({
        ...formData,
        contact: {
          ...formData.contact,
          [name.split('.')[1]]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      photo: URL.createObjectURL(e.target.files[0])
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddForm(formData);
    setFormSubmitted(true);
  };

  const handleCancel = () => {
    setFormData({
      problem: '',
      callReason: '',
      product: '',
      submitDate: new Date().toLocaleDateString(),
      status: 'Em andamento',
      contact: {
        email: '',
        phone: ''
      },
      photo: ''
    });
    setFormSubmitted(false);
  };

  return (
    <div>
      <h2>Relate um Problema</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Problema</label>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Motivo da Chamada</label>
          <input
            type="text"
            name="callReason"
            value={formData.callReason}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Produto Relacionado</label>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Telefone</label>
          <PhoneInput
            value={formData.contact.phone}
            onChange={(e) => handleChange({ target: { name: 'contact.phone', value: e.target.value } })}
          />
        </div>

        <div>
          <label>Foto do Problema</label>
          <input
            type="file"
            onChange={handlePhotoChange}
          />
        </div>

        <div>
          <button type="submit">Enviar</button>
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>

      {formSubmitted && <p>Formulário enviado!</p>}
    </div>
  );
}

export default FormList;