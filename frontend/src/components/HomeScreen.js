import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getProfileHistory } from '../services/Home';
import {
    Button,
    TableCell,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Container,
    Box,
  } from '@mui/material';
  import { useData } from '../DataContext';
import { StyledButton, StyledTableCells } from './StyledComponents';

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

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                if (!userId) {
                    setError('User ID not found in token');
                    setLoading(false);
                    return;
                }

                const res = await getProfileHistory(userId, token);
                setHistory(res);
            } catch (error) {
                console.error("Error fetching history:", error);
                setError('Error fetching history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const enrichedHistory = useMemo(() => {
        if (history.length > 0) {
          return history.map(historyEntry => {
            const agentDetails = allAgents.find(agent => agent.id === historyEntry.agent_id);
            return {
              ...historyEntry,
              displayName: agentDetails?.displayName,
              imageUrl: agentDetails?.image_url,
              isEnabled: true
            };
          });
        }
        return [];
      }, [history, allAgents]); 
    

    const startGame = () => {
        navigate('/selection-screen', { state: { history: enrichedHistory } });
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>{error}</Typography>;

    return (
    <Container style={{paddingBottom: "3vh"}}>
      <Box style={{backgroundColor: '#0f1923', padding: '15px', marginBottom: '15px',  marginTop: '2vh' }}>
        <Typography gutterBottom style={{ color: 'white', fontSize: "2.5rem", }}>
          Welcome to the Game
        </Typography>
        <StyledButton variant="contained" onClick={startGame}>
          Start Game
        </StyledButton>
      </Box>
      <Typography gutterBottom style={{ fontSize: "1.6rem", color: 'black', fontFamily: "monospace", marginBottom: "2vh" }}>
        History of Selected Agents
      </Typography>
            {history.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCells>Sequence</StyledTableCells>
                                <StyledTableCells>Agent</StyledTableCells>
                                <StyledTableCells>Agent Name</StyledTableCells>
                                <StyledTableCells>Selection Time</StyledTableCells>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrichedHistory?.slice(0, 10).map((item, index) => (
                                <TableRow key={index}>
                                    <StyledTableCells>{index+1}</StyledTableCells>
                                    <StyledTableCells>
                                        <Avatar alt={item.displayName} src={item.imageUrl} />
                                    </StyledTableCells>
                                    <StyledTableCells>{item.displayName}</StyledTableCells>
                                    <StyledTableCells>{new Date(item.game_start_time).toLocaleString()}</StyledTableCells>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography gutterBottom style={{ fontSize: "1.6rem", color: 'black', fontFamily: "monospace", marginBottom: "2vh" }}>
                    There is no history, start playing!
                </Typography>
            )}
        </Container>
    );
};

export default HomeScreen;
