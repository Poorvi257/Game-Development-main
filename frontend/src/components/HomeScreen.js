import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { valorantDataState } from '../recoil/Homescreen_recoil'; // Assuming you have this atom

const HomeScreen = () => {
    const [history, setHistory] = useState([]);
    const [data, setData] = useRecoilState(valorantDataState);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('https://valorant-api.com/v1/agents');
            const jsonData = await result.json();
            setData(jsonData.data);
        };

        fetchData();
    }, [setData]);


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
                    {data.slice(0,10).map((item, index) => (
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
