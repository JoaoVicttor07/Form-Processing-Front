import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Stats = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalUsers: 0,
    totalForms: 0,
    pendingForms: 0,
    processedForms: 0,
    activeUsers: 0,
    deletedForms: 0,
    inactiveUsers: 0,
    averageFormsPerUser: 0,
    averageProcessingTime: 0,
    completionRate: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/real-time');
        const result = response.data;
        setData((prevData) => ({ ...prevData, ...result }));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const userStats = [
    { name: 'Usuários Ativos', value: data.activeUsers },
    { name: 'Usuários Inativos', value: data.inactiveUsers },
    { name: 'Total de Usuários', value: data.totalUsers },
  ];

  const formStats = [
    { name: 'Formulários Pendentes', value: data.pendingForms },
    { name: 'Formulários Processados', value: data.processedForms },
    { name: 'Formulários Excluídos', value: data.deletedForms },
    { name: 'Total de Formulários', value: data.totalForms },
  ];

  const averageStats = [
    { name: 'Formulários por Usuário', value: data.averageFormsPerUser },
    { name: 'Tempo Médio de Processamento (s)', value: data.averageProcessingTime },
    { name: 'Taxa de Conclusão (%)', value: data.completionRate },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <button id="back-button" onClick={() => navigate(-1)}>Voltar</button>
      <div className="stats-container">
        <h1>Estatísticas em Tempo Real</h1>
        {error ? (
          <p style={{ color: 'red' }}>Erro: {error}</p>
        ) : (
          <div className="charts-wrapper">
            <div className="chart-container">
              <h2>Distribuição de Usuários</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={userStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h2>Estatísticas de Formulários</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h2>Desempenho Médio</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={averageStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;