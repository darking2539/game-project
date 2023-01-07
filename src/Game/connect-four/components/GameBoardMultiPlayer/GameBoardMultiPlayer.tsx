import { Box, Fade, Modal } from '@mui/material';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import PillButton from '../Buttons/PillButton';
import CopyButton from '../Buttons/CopyButton';
import ConnectFourGridBlack from '../GameObjects/BoardGrid/ConnectFourGridBlack';
import GameGridMultiPlayer from '../GameGridMultiPlayer/GameGridMultiPlayer';
import ScoreBox from '../GameObjects/ScoreBox/ScoreBox';
import TimerBox from '../GameObjects/TimerBox/TimerBox';
import WinnerBox from '../GameObjects/WinnerBox/WinnerBox';
import PlayerOne from '../../Icons/PlayerOne';
import PlayerTwo from '../../Icons/PlayerTwo';
import Logo from '../Logo/Logo';
import { bottomBarStyles, gameBoardContainerStyles } from './GameBoardMultiPlayer.styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useInitialRectData } from './hooks/useInitialRectData';
import PauseMenu from '../PauseMenu/PauseMenu';
import { GameState, OpponentName } from '../../../../utils/Types';


interface GameBoardMultiplayerProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
}

export default function GameBoardMultiPlayer(props: GameBoardMultiplayerProps) {

  const { setStartingPlayer, currentPlayer, setCurrentPlayer, allClickAreasData, setAllClickAreasData } = useInitialRectData();

  const [playerChips, setPlayerChips] = useState<JSX.Element[]>([]);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);

  function openMenu() {
    setOpenPauseMenu(true);
  }

  function closeMenu() {
    setOpenPauseMenu(false);
  }

  return (
    <Fade in={true}>
      <Box width='100%' height='100%' display='flex' justifyContent='center'>
        <Box sx={gameBoardContainerStyles}>
          <ScoreBox score={0} Icon={<PlayerOne />} playerText='Player 1' />
          <div className='central-content'>
            <header className='game-board-header'>
              <PillButton onClick={openMenu}>Menu</PillButton>
              <Logo />
              <CopyButton endIcon={<ContentCopyIcon />}>ABCDEF</CopyButton>
            </header>
            <div className='horizontal-scores'>
              <ScoreBox score={0} Icon={<PlayerOne />} iconPlacement='left' playerText='Player 1' />
              <ScoreBox score={0} Icon={<PlayerTwo />} iconPlacement='right' playerText='Waiting...' reverseText />
            </div>
            <div className='board'>
              <div className='connectFour'>
                <GameGridMultiPlayer
                  setAllClickAreasData={setAllClickAreasData}
                  allClickAreasData={allClickAreasData}
                  playerChips={playerChips}
                  setPlayerChips={setPlayerChips}
                />
                <ConnectFourGridBlack />
              </div>
            </div>
          </div>
          <ScoreBox score={0} Icon={<PlayerTwo />} playerText='Waiting...' reverseText />
        </Box>
        <Modal open={openPauseMenu} onClose={closeMenu} aria-labelledby='rules-title' aria-describedby='rules-description'>
          <PauseMenu  setGameState={props.setGameState} closeMenu={closeMenu} />
        </Modal>
      </Box>
    </Fade>
  );
}
