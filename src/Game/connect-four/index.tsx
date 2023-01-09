import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import GameBoard from './components/GameBoard/GameBoard';
import GameBoardMultiPlayer from './components/GameBoardMultiPlayer/GameBoardMultiPlayer';
import CPUIcon from './Icons/CPUIcon';
import PlayerTwo from './Icons/PlayerTwo';
import MainMenu from './components/MainMenu/MainMenu';
import Rules from './components/Rules/Rules';
import WaitingRoom from './components/WaitingRoom/WaitingRoom';
import themeOptions from '../../CustomTheme';
import { GameState, OpponentName, Player } from '../../utils/Types';

const theme = createTheme(themeOptions);

function ConnectFourGame() {
  //main-menu
  const [gameState, setGameState] = useState<GameState>('main-menu');
  //offline-mode
  const [opponentName, setOpponentName] = useState<OpponentName>('Player 2');
  //online-mode
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerStatus, setPlayerStatus] = useState<Player>('main');
  const [yourName, setYourName] = useState<string>('');
  const [oppositeName, setOppositeName] = useState<string>('Watinng...');
  const [roomStatus, setRoomStatus] = useState<boolean>(false);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {gameState === 'main-menu' && <MainMenu setOpponentName={setOpponentName} setGameState={setGameState} />}
        {gameState === 'rules' && <Rules setGameState={setGameState} />}
        {gameState === 'game-board' && <GameBoard opponentIcon={opponentName === 'Player 2' ? <PlayerTwo /> : <CPUIcon />} opponentName={opponentName} setGameState={setGameState} />}
        {gameState === 'waiting-room' && <WaitingRoom yourName={yourName} setGameState={setGameState} setPlayerStatus={setPlayerStatus} setRoomCode={setRoomCode} setYourName={setYourName} setOppositeName={setOppositeName} setRoomStatus={setRoomStatus} />}
        {gameState === 'multiplayer' &&
          <GameBoardMultiPlayer
            setGameState={setGameState}
            setPlayerStatus={setPlayerStatus}
            setRoomCode={setRoomCode}
            setYourName={setYourName}
            setOppositeName={setOppositeName}
            yourName={yourName}
            oppositeName={oppositeName}
            playerStatus={playerStatus}
            roomCode={roomCode}
            roomStatus={roomStatus}
            setRoomStatus={setRoomStatus} />
        }
      </ThemeProvider>
    </>
  );
}

export default ConnectFourGame;
