import React, { useState, useEffect } from 'react';

function RealTimeStats() {
    const [data, setData] = useState({ totalUsers: 0, totalForms: 0, pendingForms: 0 });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/real-time');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
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
}

export default RealTimeStats;
