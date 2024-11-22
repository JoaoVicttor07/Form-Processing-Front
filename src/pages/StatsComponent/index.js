import { useEffect, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const StatsComponent = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalForms: 0,
        pendingForms: 0,
    });

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/real-time-stats");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/stats", (message) => {
                setStats(JSON.parse(message.body));
            });
        });

        return () => {
            if (stompClient) stompClient.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Real-Time Stats</h1>
            <p>Total Users: {stats.totalUsers}</p>
            <p>Total Forms: {stats.totalForms}</p>
            <p>Pending Forms: {stats.pendingForms}</p>
        </div>
    );
};

export default StatsComponent;
