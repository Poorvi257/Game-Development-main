// StyledComponents.js
import { Button, TextField, TableCell } from '@mui/material';
import { styled } from '@mui/system';

export const CustomButton = styled(Button)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: '10px',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
});

export const CustomTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: 'black',
    backgroundColor: 'white',
    border: '2px solid',
    borderColor: 'white',
    borderRadius: '4px',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  marginBottom: '20px',
});

export const AgentImage = styled('img')({
  position: 'absolute',
  height: '70%',
  '&:first-of-type': {
    transform: 'rotate(-5deg)',
    left: 0,
    bottom: "20vh",
  },
  '&:nth-of-type(2)': {
    transform: 'rotate(5deg)',
    right: 0,
    bottom: "20vh",
  },
});

export const StyledTableCells = styled(TableCell)({
  backgroundColor: '#e6e0d5',
  color: "black",
  borderBottom: '2px solid #d4d1cc',
  fontFamily: "monospace"
});

export const StyledButton = styled(Button)({
  background: 'linear-gradient(135deg, rgb(255, 51, 66) 0%, rgb(255, 48, 64) 0.01%, rgb(255, 125, 102) 100%)',
  color: 'black',
  fontFamily: "Arial,sans-serif",
  fontWeight: 600
});