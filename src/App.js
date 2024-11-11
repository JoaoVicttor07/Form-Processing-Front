import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin/index';
import FormList from './components/FormList';

function App() {
  const [forms, setForms] = useState([]);
  const [user, setUser] = useState({ name: "Usuário Placeholder" });

  const handleAddForm = (formData) => {
    setForms([...forms, formData]);
  };

return (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </Router>

    <div className="App">
      <h1>Serviços Eletrônicos</h1>
      <p>Bem-vindo, {user.name}</p>

      <FormList onAddForm={handleAddForm} />

      <h2>Formulários Enviados</h2>
      <ul>
        {forms.map((form, index) => (
          <li key={index}>
            <p>Problema: {form.problem}</p>
            <p>Motivo: {form.callReason}</p>
            <p>Produto: {form.product}</p>
            <p>Data de Envio: {form.submitDate}</p>
            <p>Status: {form.status}</p>
            <p>Contato: {form.contact.email}, {form.contact.phone}</p>
            <img src={form.photo} alt="Problema" style={{ width: '100px', height: 'auto' }} />
          </li>
        ))}
      </ul>
    </div>
  </>
);
}

export default App;