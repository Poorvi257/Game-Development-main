import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getProfileHistory } from '../services/Home';
import { Button, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Container } from '@mui/material';
import { useData } from '../DataContext';

const HomeScreen = () => {
    const navigate = useNavigate();
    const { allAgents } = useData();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token not found');
                    setLoading(false);
                    return;
                }

                const decodedToken = jwtDecode(token); // Assuming jwtDecode is correctly imported
                const userId = decodedToken.id;
                if (!userId) {
                    setError('User ID not found in token');
                    setLoading(false);
                    return;
                }

                const res = await getProfileHistory(userId, token);
                if (res && res.length > 0) {
                    setHistory(res);
                } else {
                    setError('No history available');
                }
            } catch (error) {
                console.error("Error fetching history:", error);
                setError('Error fetching history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const enrichedHistory = useMemo(() => history.map(historyEntry => {
        const agentDetails = allAgents.find(agent => agent.id === historyEntry.agent_id);
        return {
            ...historyEntry,
            displayName: agentDetails?.displayName,
            imageUrl: agentDetails?.image_url,
            isEnabled: true
        };
    }), [history, allAgents]);

    const startGame = () => {
        navigate('/selection-screen', { state: { history: enrichedHistory } });
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>{error}</Typography>;

    return (
        <Container>
            <Typography variant="h3" gutterBottom>Welcome to the Game</Typography>
            <Button variant="contained" color="primary" onClick={startGame}>
                Start Game
            </Button>
            <Typography variant="h4" gutterBottom>History of Selected Agents</Typography>
            {enrichedHistory.length > 0 ? (
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
                            {enrichedHistory.slice(0, 10).map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Avatar alt={item.displayName} src={item.imageUrl} />
                                    </TableCell>
                                    <TableCell>{item.displayName}</TableCell>
                                    <TableCell>{new Date(item.game_start_time).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="subtitle1">There is no history, start playing!</Typography>
            )}
        </Container>
    );
};

export default HomeScreen;
