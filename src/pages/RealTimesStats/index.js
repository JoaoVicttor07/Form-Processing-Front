import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RealTimeStats = () => {
  const [data, setData] = useState({ totalUsers: 0, totalForms: 0, pendingForms: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/real-time');
        const result = response.data;
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="real-time-stats">
      <h1>Estatísticas em tempo real</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <>
          <p>Número de usuários que se beneficiam do nosso sistema: {data.totalUsers}</p>
          <p>Número de formulários criados: {data.totalForms}</p>
          <p>Número de formulários pendentes: {data.pendingForms}</p>
        </>
      )}
    </div>
  );
};

export default RealTimeStats;