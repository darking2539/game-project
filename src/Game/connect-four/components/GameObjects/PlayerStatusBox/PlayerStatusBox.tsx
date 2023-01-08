
import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { mainColour } from '../../../../../CustomTheme';
import { mainTransition } from '../../../../../utils/Styles';
import { OpponentName } from '../../../../../utils/Types';
import TimerIcon from '../../../Icons/TimerIcon';
import { timerBoxRootStyles } from './PlayerStatusBox.styles';

interface PlayerStatusBoxProps {
  playerColour?: string;
  playerName?: string;
  opponentName?: OpponentName;
  timerSeconds?: number;
}

export default forwardRef((props: PlayerStatusBoxProps, ref) => {

  return (
    <Box ref={ref} style={{ color: props.playerColour }} sx={timerBoxRootStyles}>
      <div className='info' style={{ color: props.playerColour === mainColour.main ? mainColour.light : mainColour.dark, transition: `all ${mainTransition}` }}>
        <p className='playerText'>Turn</p>
        <p className='timer'>{props.playerName}</p>
      </div>
      <TimerIcon />
    </Box>
  );
});
