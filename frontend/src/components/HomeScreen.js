import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../DataContext';

const HomeScreen = () => {
    const { allAgents, fetchAgentsData } = useData();

    useEffect(() => {
        fetchAgentsData();
    }, []);

    return (
        <div>
            <h1>Welcome to the Game</h1>
            <Link to="/selection-screen">
                <button>Start Game</button>
            </Link>
            <h2>History of Selected Agents</h2>
            <table>
                <thead>
                    <tr>
                        <th>Agent Name</th>
                        <th>Selection Time</th>
                    </tr>
                </thead>
                <tbody>
                    {allAgents.slice(0,10).map((item, index) => (
                        <tr key={index}>
                            <td>{item.displayName}</td>
                            <td>{new Date().toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HomeScreen;
