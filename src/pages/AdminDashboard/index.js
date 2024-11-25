import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({ status: '', setor: '', date: '' });

  useEffect(() => {
    // Adiciona a classe 'admin-background' ao body quando o componente é montado
    document.body.classList.add('admin-background');

    // Remove a classe 'admin-background' do body quando o componente é desmontado
    return () => {
      document.body.classList.remove('admin-background');
    };
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/form/list');
        setTickets(response.data);
      } catch (error) {
        console.error('Erro ao buscar tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredTickets = tickets.filter(ticket => {
    return (
      (filters.status === '' || ticket.status === filters.status) &&
      (filters.setor === '' || ticket.setor.toLowerCase().includes(filters.setor.toLowerCase())) &&
      (filters.date === '' || new Date(ticket.date).toLocaleDateString() === new Date(filters.date).toLocaleDateString())
    );
  });

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`Alterando status do ticket ${id} para ${status}`);
      const response = await api.patch(`/form/update/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Resposta da API:', response);
      setTickets(tickets.map(ticket => (ticket.id === id ? { ...ticket, status } : ticket)));
      setSelectedTicket(null);
    } catch (error) {
      console.error('Erro ao alterar status do ticket:', error);
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await api.delete(`/form/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTickets(tickets.filter(ticket => ticket.id !== id));
      setSelectedTicket(null);
    } catch (error) {
      console.error('Erro ao excluir ticket:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="content">
        <div className="main-content">
          <div className="filters">
            <label>
              Status:
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">Todos</option>
                <option value="APROVADO">APROVADO</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="REJEITADO">REJEITADO</option>
              </select>
            </label>
            <label>
              Setor:
              <input type="text" name="setor" value={filters.setor} onChange={handleFilterChange} placeholder="Setor responsável" />
            </label>
            <label>
              Data:
              <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
            </label>
          </div>
          <div className="ticket-list">
            <h2>Lista de Tickets</h2>
            <ul>
              {filteredTickets.map(ticket => (
                <li
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={selectedTicket && selectedTicket.id === ticket.id ? 'selected' : ''}
                >
                  {ticket.id} - {ticket.motivo} - {ticket.status} - {new Date(ticket.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {selectedTicket && (
          <div className="ticket-details">
            <h2>Detalhes do Ticket</h2>
            <p>ID: {selectedTicket.id}</p>
            <p>Motivo: {selectedTicket.motivo}</p>
            <p>Setor: {selectedTicket.setor}</p>
            <p>Problema: {selectedTicket.problema}</p>
            <p>Status: {selectedTicket.status}</p>
            <p>Data: {new Date(selectedTicket.date).toLocaleDateString()}</p>
            <button className="close" onClick={() => setSelectedTicket(null)}>Fechar</button>
            <button className="resolve" onClick={() => handleStatusChange(selectedTicket.id, 'APROVADO')}>Marcar como Aprovado</button>
            <button className="delete" onClick={() => handleDeleteTicket(selectedTicket.id)}>Excluir</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;