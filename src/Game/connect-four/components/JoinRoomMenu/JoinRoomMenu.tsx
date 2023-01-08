import { Box, Stack, Typography, TextField } from '@mui/material';
import { Dispatch, forwardRef, SetStateAction, useState } from 'react';
import { GameState, Player } from '../../../../utils/Types';
import RectangleButton from '../Buttons/RectangleButton';
import RectangleTextField from '../TextField/RectangleTextField';
import { joinRoomMenuStyles } from './JoinRoomMenu.styles';

interface JoinRoomMenuProps {
  state: string;
  title: string;
  setGameState: Dispatch<SetStateAction<GameState>>;
  setPlayerStatus: Dispatch<SetStateAction<Player>>;
  setRoomCode: Dispatch<React.SetStateAction<string>>;
  setYourName: Dispatch<React.SetStateAction<string>>;
  setOppositeName: Dispatch<React.SetStateAction<string>>;
  setRoomStatus: Dispatch<React.SetStateAction<boolean>>;
  yourName: string;
}

export default forwardRef((props: JoinRoomMenuProps, _) => {

  const [roomCodeState, setRoomCodeState] = useState<string>('');

  function MakeId(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const joinCreateAction = () => {
    if (props.state == "create") {
      props.setPlayerStatus("main");
      var roomCode: string = MakeId(5);
      props.setRoomCode(roomCode);
      props.setGameState("multiplayer");
      props.setRoomStatus(true);
    } else {
      props.setPlayerStatus("opponent");
      props.setRoomCode(roomCodeState);
      props.setGameState("multiplayer");
      props.setRoomStatus(true);
    }
  }

  return (
    <Box sx={joinRoomMenuStyles}>
      <Typography variant='h2'>{props.title}</Typography>
      <Stack spacing={3}>
        <RectangleTextField className='restart-game-btn' variant="standard" placeholder='Enter Your Name'
          value={props.yourName}
          onChange={(e: any) => props.setYourName(e.target.value)}
          sx={{ input: { textAlign: "center" } }}
          InputProps={{
            disableUnderline: true,
          }}  >
        </RectangleTextField>

        {props.state === "join" && <RectangleTextField className='restart-game-btn' variant="standard" placeholder='Enter Room Code'
          value={roomCodeState}
          onChange={(e: any) => setRoomCodeState(e.target.value)}
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
