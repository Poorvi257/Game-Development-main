import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getProfileHistory } from '../services/Home';
import { Button, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Container } from '@mui/material';
import { useData } from '../DataContext';

const HomeScreen = () => {
    const navigate = useNavigate();
    const { allAgents } = useData();
    const [history, setHistory] = useState([]);
    const [isHistoryAvailable, setFlag] = useState(false);

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
        <Container>
            <Typography variant="h3" gutterBottom>Welcome to the Game</Typography>
            <Button variant="contained" color="primary" onClick={startGame}>
                Start Game
            </Button>
            <Typography variant="h4" gutterBottom>History of Selected Agents</Typography>
            {isHistoryAvailable ? (
                <Typography variant="subtitle1">There is no History, start Playing!</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table aria-label="agent history">
                        <TableHead>
                            <TableRow>
                                <TableCell>Agent Icon</TableCell>
                                <TableCell>Agent Name</TableCell>
                                <TableCell>Selection Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrichedHistory?.slice(0, 10).map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Avatar alt={item.displayName} src={item.imageUrl} />
                                    </TableCell>
                                    <TableCell>{item.displayName}</TableCell>
                                    <TableCell>{item.game_start_time.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default HomeScreen;