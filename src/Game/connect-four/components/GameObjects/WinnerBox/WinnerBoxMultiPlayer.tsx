import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { OpponentName, Player } from '../../../../../utils/Types';
import PillButton from '../../Buttons/PillButton';
import { winnerBoxRootStyles } from './WinnerBox.styles';

interface WinnerBoxProps {
  currentPlayer: Player | null;
  winnerName: string;
  onPlayAgainClick: () => void;
  tieGame: boolean;
}

export default forwardRef((props: WinnerBoxProps, ref) => {
  return (
    <Box ref={ref} className='winner-box' sx={winnerBoxRootStyles}>
      <p className='playerText'>{props.tieGame ? "": props?.winnerName}</p>
      <p className='result'>{props.tieGame ? 'Tie' : 'Wins'}</p>
      <PillButton onClick={props.onPlayAgainClick}>Play Again</PillButton>
    </Box>
  );
});
