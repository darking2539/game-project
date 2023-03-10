import { styled } from '@mui/material';
import Button from '@mui/material/Button';

export default styled(Button)(({ theme }) => ({
  borderRadius: '2rem',
  fontSize: '1.6rem',
  color: theme.palette.secondary.light,
  backgroundColor: "green",
  '&:hover': {
    backgroundColor: "green",
  },
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': {
      backgroundColor: "#81E954",
    },
  },
}));
