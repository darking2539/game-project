import { Box, Stack, Typography, TextField } from '@mui/material';
import { Dispatch, forwardRef, SetStateAction } from 'react';
import { GameState } from '../../../../utils/Types';
import RectangleButton from '../Buttons/RectangleButton';
import RectangleTextField from '../TextField/RectangleTextField';
import { joinRoomMenuStyles } from './JoinRoomMenu.styles';

interface JoinRoomMenuProps {
  state: string;
  title: string;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

export default forwardRef((props: JoinRoomMenuProps, _) => {
  
  
  const joinCreateAction = () => {
    props.setGameState("multiplayer")
  }

  return (
    <Box sx={joinRoomMenuStyles}>
      <Typography variant='h2'>{props.title}</Typography>
      <Stack spacing={3}>
        <RectangleTextField className='restart-game-btn' variant="standard" placeholder='Enter Your Name'
          sx={{ input: { textAlign: "center" } }}
          InputProps={{
            disableUnderline: true,
          }}  >
        </RectangleTextField>

        {props.state === "join" && <RectangleTextField className='restart-game-btn' variant="standard" placeholder='Enter Room Code'
          sx={{ input: { textAlign: "center" } }}
          InputProps={{
            disableUnderline: true,
          }} >
        </RectangleTextField>
        }
        <RectangleButton className='quit-game-btn' variant='contained' onClick={joinCreateAction} >
          <Box component='span'>{props.state}</Box>
        </RectangleButton>
      </Stack>
    </Box>
  );
});
