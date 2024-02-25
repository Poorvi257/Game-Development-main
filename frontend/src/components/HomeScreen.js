import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../DataContext';
import { jwtDecode } from 'jwt-decode';
import { getProfileHistory } from '../services/Home';

const HomeScreen = () => {
    const { allAgents, fetchAgentsData } = useData();

    const [history, setHistory] = useState([]);
    const [isHistoryAvailable, setFlag] = useState(false)

    useEffect(() => {
        fetchAgentsData();
    }, []);

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
                if (!res){
                    setFlag(true)
                }
                else{
                    setFlag(false)
                setHistory(res || []);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div>
            <h1>Welcome to the Game</h1>
            <Link to="/selection-screen">
                <button>Start Game</button>
            </Link>
            <h2>History of Selected Agents</h2>
            {isHistoryAvailable ?
                <h4>There is no History, start Playing!</h4>
                :
                <table>
                    <thead>
                        <tr>
                            <th>Agent Name</th>
                            <th>Selection Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history?.slice(0, 10).map((item, index) => (
                            <tr key={index}>
                                <td><img src="" /></td>
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
