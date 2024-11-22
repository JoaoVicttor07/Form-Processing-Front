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
        <div>
            <h1>Real-Time Statistics</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <>
                    <p>Total Users: {data.totalUsers}</p>
                    <p>Total Forms: {data.totalForms}</p>
                    <p>Pending Forms: {data.pendingForms}</p>
                </>
            )}
        </div>
    );
}

export default RealTimeStats;
