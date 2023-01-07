import { styled } from '@mui/material';
import TextField from '@mui/material/TextField';
import { shadowStyle } from '../../../../utils/Styles';

export default styled(TextField)(({ theme }) => ({
  ...shadowStyle(theme),
  justifyContent: 'space-between',
  padding: '1.2rem 2rem',

  '&:hover': { borderColor: theme.palette.primary.main, boxShadow: `0px 10px 0px 0px ${theme.palette.primary.main}` },
}));
