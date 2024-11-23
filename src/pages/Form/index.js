import React, { useState } from 'react';
import api from '../../services/api'; // Certifique-se de ajustar o caminho conforme necessário

const Form = () => {
  const [motivo, setCallReason] = useState('');
  const [setor, setSector] = useState('');
  const [problema, setProblem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enviando formulário...');

    try {
      const response = await api.post('/form/create', {
        motivo,
        setor,
        problema,
      });

      if (response.status === 200) {
        console.log('Formulário enviado com sucesso!');
      } else {
        console.log('Erro ao enviar o formulário:', response.statusText);
      }
    } catch (error) {
      console.log('Erro ao enviar o formulário:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Motivo:</label>
        <input
          type="text"
          value={motivo}
          onChange={(e) => setCallReason(e.target.value)}
          placeholder="Descreva o motivo"
          required
        />
      </div>
      <div>
        <label>Setor:</label>
        <input
          type="text"
          value={setor}
          onChange={(e) => setSector(e.target.value)}
          placeholder="Indique o setor"
          required
        />
      </div>
      <div>
        <label>Problema:</label>
        <textarea
          value={problema}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Descreva o problema"
          required
        />
      </div>
      <button type="submit">Enviar</button>
      <button
        type="button"
        onClick={() => {
          setCallReason('');
          setSector('');
          setProblem('');
        }}
      >
        Limpar
      </button>
    </form>
  );
};

export default Form;