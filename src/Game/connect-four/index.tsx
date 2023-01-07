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
import { GameState, OpponentName } from '../../utils/Types';

const theme = createTheme(themeOptions);

function ConnectFourGame() {
  const [gameState, setGameState] = useState<GameState>('main-menu');
  const [opponentName, setOpponentName] = useState<OpponentName>('Player 2');

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {gameState === 'main-menu' && <MainMenu setOpponentName={setOpponentName} setGameState={setGameState} />}
        {gameState === 'rules' && <Rules setGameState={setGameState} />}
        {gameState === 'game-board' && <GameBoard opponentIcon={opponentName === 'Player 2' ? <PlayerTwo /> : <CPUIcon />} opponentName={opponentName} setGameState={setGameState} />}
        {gameState === 'waiting-room' && <WaitingRoom setGameState={setGameState} />}
        {gameState === 'multiplayer' && <GameBoardMultiPlayer setGameState={setGameState} />}
      </ThemeProvider>
    </>
  );
}

export default ConnectFourGame;
