import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getProfileHistory } from '../services/Home';
import { Button } from '@mui/material';
import { useData } from '../DataContext';

const HomeScreen = () => {
    const navigate = useNavigate()
    const { allAgents } = useData();
    const [history, setHistory] = useState([]);
    const [isHistoryAvailable, setFlag] = useState(false)

    const getHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        if (!userId) throw new Error('User ID not found in token');

        let res = await getProfileHistory(userId, token)
        return res
    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getHistory();
                if (!res) {
                    setFlag(true)
                }
                else {
                    setFlag(false)
                    setHistory(res || []);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    const historyWithAgentDetails = (history, agents) => {
        return history.map(historyEntry => {
            const agentDetails = agents.find(agent => agent.id === historyEntry.agent_id);

            return {
                ...historyEntry,
                displayName: agentDetails?.displayName,
                imageUrl: agentDetails?.image_url,
                isEnabled: true
            };
        });
    };

    const enrichedHistory = historyWithAgentDetails(history, allAgents);

    const startGame = () => {
        navigate('/selection-screen', { state: { history: enrichedHistory } });
    };


    return (
        <div>
            <h1>Welcome to the Game</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={startGame}>
                Start Game
            </Button>
            <h2>History of Selected Agents</h2>
            {isHistoryAvailable ?
                <h4>There is no History, start Playing!</h4>
                :
                <table>
                    <thead>
                        <tr>
                            <th>Agent Name</th>
                            <th>Agent Icon</th>
                            <th>Selection Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrichedHistory?.slice(0, 10).map((item, index) => (
                            <tr key={index}>
                                <td><img src={item.imageUrl} height={90} width={90} /></td>
                                <td>{item?.displayName}</td>
                                <td>{item.game_start_time.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    );
};

export default HomeScreen;
