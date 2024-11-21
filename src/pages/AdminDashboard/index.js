import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [supportForms, setSupportForms] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [filter, setFilter] = useState({ status: '', date: '', sector: '' });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
    }
    // Fetch data from backend (simulação)
    setSupportForms([
      // Dados simulados
      { id: 1, reason: 'Problema 1', sector: 'TI', status: 'Pendente', date: '05-10-2024' },
      { id: 2, reason: 'Problema 2', sector: 'RH', status: 'Resolvido', date: '03-10-2024' },
    ]);
    setLogs([
      // Dados simulados
      { id: 1, adminId: 1, formId: 1, changes: 'Status alterado para resolvido', date: '05-10-2024' },
    ]);
    setNotifications([
      // Dados simulados
      { id: 1, formId: 1, message: 'Seu problema foi resolvido', status: 'Enviado', date: '05-10-2024' },
    ]);
  }, [navigate]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
  };

  const handleStatusChange = (formId, newStatus) => {
    // Update status in backend (simulação)
    setSupportForms(supportForms.map(form => form.id === formId ? { ...form, status: newStatus } : form));
  };

  const handleLogout = () => {
    // Remover o token de autenticação do localStorage
    localStorage.removeItem('authToken');
    console.log('Token removido do localStorage');
    // Redirecionar para a página de login
    navigate('/signin');
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <button onClick={() => setSelectedForm(null)}>Lista de Formulários de Suporte</button>
        <button onClick={() => setSelectedForm('logs')}>Logs de Ações</button>
        <button onClick={() => setSelectedForm('notifications')}>Notificações</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {!selectedForm && (
        <div className="support-forms">
          <h2>Formulários de Suporte</h2>
          <div className="filters">
            <input type="text" name="status" placeholder="Status" value={filter.status} onChange={handleFilterChange} />
            <input type="date" name="date" placeholder="Data de Envio" value={filter.date} onChange={handleFilterChange} />
            <input type="text" name="sector" placeholder="Setor" value={filter.sector} onChange={handleFilterChange} />
          </div>
          <ul>
            {supportForms
              .filter(form => 
                (filter.status ? form.status.includes(filter.status) : true) &&
                (filter.date ? form.date.includes(filter.date) : true) &&
                (filter.sector ? form.sector.includes(filter.sector) : true)
              )
              .map(form => (
                <li key={form.id} onClick={() => handleFormSelect(form)}>
                  {form.id} - {form.reason} - {form.sector} - {form.status} - {form.date}
                </li>
              ))}
          </ul>
        </div>
      )}

      {selectedForm && selectedForm !== 'logs' && selectedForm !== 'notifications' && (
        <div className="form-details">
          <h2>Detalhes do Formulário</h2>
          <p>ID do Usuário: {selectedForm.userId}</p>
          <p>Motivo: {selectedForm.reason}</p>
          <p>Setor: {selectedForm.sector}</p>
          <p>Status: {selectedForm.status}</p>
          <p>Mensagem: {selectedForm.message}</p>
          <p>Data de Envio: {selectedForm.date}</p>
          <button onClick={() => handleStatusChange(selectedForm.id, 'Resolved')}>Marcar como Resolvido</button>
        </div>
      )}

      {selectedForm === 'logs' && (
        <div className="logs">
          <h2>Logs de Ações</h2>
          <ul>
            {logs.map(log => (
              <li key={log.id}>
                {log.id} - Admin {log.adminId} - Form {log.formId} - {log.changes} - {log.date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedForm === 'notifications' && (
        <div className="notifications">
          <h2>Notificações</h2>
          <ul>
            {notifications.map(notification => (
              <li key={notification.id}>
                {notification.id} - Form {notification.formId} - {notification.message} - {notification.status} - {notification.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;