import { Box, Fade, Modal, Slide } from '@mui/material';
import { Dispatch, SetStateAction, useRef, useState, useEffect, useCallback } from 'react';
import PillButton from '../Buttons/PillButton';
import CopyButton from '../Buttons/CopyButton';
import ConnectFourGridBlack from '../GameObjects/BoardGrid/ConnectFourGridBlack';
import GameGridMultiPlayer from '../GameGridMultiPlayer/GameGridMultiPlayer';
import ScoreBox from '../GameObjects/ScoreBox/ScoreBox';
import PlayerStatusBox from '../GameObjects/PlayerStatusBox/PlayerStatusBox';
import WinnerBox from '../GameObjects/WinnerBox/WinnerBoxMultiPlayer';
import PlayerOne from '../../Icons/PlayerOne';
import PlayerTwo from '../../Icons/PlayerTwo';
import Logo from '../Logo/Logo';
import { bottomBarStyles, gameBoardContainerStyles } from './GameBoardMultiPlayer.styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useInitialRectData } from './hooks/useInitialRectData';
import PauseMenu from '../PauseMenu/PauseMenu';
import { GameState, Player } from '../../../../utils/Types';
import { RankingInfo, ClickAreaData } from '../../../../utils/Interfaces';
import PlayerChip from '../GameObjects/PlayerChip/PlayerChip';
import { assignChipToLowestSlotPossibleIndex, isTieGame, processForWinnersOrSwap, generateInitialRectDataArray } from './helpers';
import { COLUMNS, ROWS, WINNING_LENGTH } from '../../../../utils/constants';
import { mainColour } from '../../../../CustomTheme';
import { socket, initiateSocketConnection, createdRoom, joinRoom, PlayGame } from "../../../../utils/socketio"


interface GameBoardMultiplayerProps {
  setGameState: Dispatch<SetStateAction<GameState>>;
  setPlayerStatus: Dispatch<SetStateAction<Player>>;
  setRoomCode: Dispatch<React.SetStateAction<string>>;
  setYourName: Dispatch<React.SetStateAction<string>>;
  setOppositeName: Dispatch<React.SetStateAction<string>>;
  yourName: string;
  oppositeName: string;
  playerStatus: Player;
  roomCode: string;
}

export default function GameBoardMultiPlayer(props: GameBoardMultiplayerProps) {

  const { setStartingPlayer, currentPlayer, setCurrentPlayer, allClickAreasData, setAllClickAreasData } = useInitialRectData();

  const [playerChips, setPlayerChips] = useState<JSX.Element[]>([]);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [disableUI, setDisableUI] = useState(false);
  const [tieGame, setTieGame] = useState(false);
  const [showWinnerBox, setShowWinnerBox] = useState(false);
  const [mainPlayerScore, setMainPlayerScore] = useState<number>(0);
  const [oppositePlayerScore, setOppositePlayerScore] = useState<number>(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const lowestClickAreaRef = useRef<ClickAreaData | null>(null);
  const containerRef = useRef(null);

  function openMenu() {
    setOpenPauseMenu(true);
  }

  function closeMenu() {
    setOpenPauseMenu(false);
  }

  function onPlayAgainClick() {
    let payload = {
      "roomCode": props.roomCode,
      "clickBy": props.playerStatus,
      "allClickAreasData": generateInitialRectDataArray(COLUMNS, ROWS)
    }
    PlayGame(payload);
  }

  const onAreaClicked = (selectedClickAreaData: ClickAreaData) => {

    //block full column
    if (winner || selectedClickAreaData.fullColumn || disableUI) {
      return
    }

    let payload = {
      "roomCode": props.roomCode,
      "clickBy": props.playerStatus,
      "selectedClick": selectedClickAreaData,
      "allClickAreasData": allClickAreasData
    }
    PlayGame(payload);
  }

  const applyFullColumnToRects = (columnOfClickAreaData: ClickAreaData[], indexCounter: number) => {
    const output = [...columnOfClickAreaData];

    while (indexCounter + COLUMNS < COLUMNS * ROWS) {
      output[indexCounter + COLUMNS].fullColumn = true;
      indexCounter += COLUMNS;
    }
    return output;
  };


  const addChipInTable = (currentClickArea: ClickAreaData, allClickAreasDataFromSocket: ClickAreaData[], clickBy: Player) => {

    const newIndex = assignChipToLowestSlotPossibleIndex(currentClickArea.index, allClickAreasDataFromSocket, COLUMNS, ROWS);
    let newClickAreas = allClickAreasDataFromSocket;
    currentClickArea.occupiedBy = clickBy;
    newClickAreas[newIndex].occupiedBy = clickBy;
    lowestClickAreaRef.current = newClickAreas[newIndex];

    if (lowestClickAreaRef.current.index < COLUMNS) {
      // full column handle
      newClickAreas = applyFullColumnToRects(newClickAreas, lowestClickAreaRef.current.index - COLUMNS);
    }

    const x = lowestClickAreaRef.current.x + 44;
    const y = lowestClickAreaRef.current.y + 44;

    setPlayerChips((oldValues) => {
      return [
        ...oldValues,
        <Slide key={new Date().getTime()} timeout={500} in={true} container={containerRef.current}>
          <PlayerChip colour={mainColour[clickBy]} x={x} y={y} />
        </Slide>,
      ];
    });

    // check status game
    const isTied = isTieGame(allClickAreasDataFromSocket, COLUMNS, ROWS);
    const matches = processForWinnersOrSwap(newClickAreas[newIndex], allClickAreasDataFromSocket, COLUMNS, WINNING_LENGTH);
    if (matches.length >= WINNING_LENGTH) {
      setWinner(clickBy);
      setAllClickAreasData(matches);
      if (clickBy === "main") {
        setMainPlayerScore((prevScore) => prevScore + 1);
      } else {
        setOppositePlayerScore((prevScore) => prevScore + 1);
      }
    } else if (isTied) {
      setTieGame(true);
    } else {
      //swap player
      setAllClickAreasData(newClickAreas);
      setCurrentPlayer(clickBy === "main" ? "opponent" : "main");
      setDisableUI(clickBy === props.playerStatus);
    }

  }

  const handleStatusCallBack = useCallback((msg: any) => {
    //handle showName
    if (msg?.status === "Start") {
      if (props.playerStatus === "main") {
        props.setOppositeName(msg?.join?.username);
      } else {
        props.setOppositeName(msg?.create?.username);
      };
    }
  }, []);

  const handlePlayGameCallBack = useCallback((msg: any) => {
    if (msg?.selectedClick) {
      addChipInTable(msg?.selectedClick, msg?.allClickAreasData, msg?.clickBy);
    } else {
      //reset all table
      setAllClickAreasData(msg?.allClickAreasData);
      setWinner(null);
      setTieGame(false);
      setPlayerChips([]);
      setDisableUI(msg?.clickBy !== props.playerStatus);
      setCurrentPlayer(msg?.clickBy === "main" ? "main" : "opponent");
    }

  }, []);

  useEffect(() => {

    if (!socket) {
      initiateSocketConnection(props.yourName);
      socket.on("status", handleStatusCallBack);
      socket.on("play-game", handlePlayGameCallBack);
      if (props.playerStatus === "main") {
        createdRoom(props.roomCode);
      } else {
        joinRoom(props.roomCode);
      }
    }

  }, [])

  useEffect(() => {
    setDisableUI(props.playerStatus !== "main");
  }, [])


  const PlayerName = () => {
    if (props.playerStatus === "main") {
      if (currentPlayer === "main") {
        return props.yourName;
      } else {
        return props.oppositeName;
      }
    } else {
      if (currentPlayer === "main") {
        return props.oppositeName;
      } else {
        return props.yourName;
      }
    }
  }

  return (
    <Fade in={true}>
      <Box width='100%' height='100%' display='flex' justifyContent='center'>
        <Box sx={gameBoardContainerStyles}>
          <ScoreBox score={mainPlayerScore} Icon={<PlayerOne />} playerText={props.playerStatus === "main" ? props.yourName : props.oppositeName} />
          <div className='central-content'>
            <header className='game-board-header'>
              <PillButton onClick={openMenu}>Menu</PillButton>
              <Logo />
              <CopyButton endIcon={<ContentCopyIcon />}>{props.roomCode}</CopyButton>
            </header>
            <div className='horizontal-scores'>
              <ScoreBox score={mainPlayerScore} Icon={<PlayerOne />} iconPlacement='left' playerText={props.playerStatus === "main" ? props.yourName : props.oppositeName} />
              <ScoreBox score={oppositePlayerScore} Icon={<PlayerTwo />} iconPlacement='right' playerText={props.playerStatus === "main" ? props.oppositeName : props.yourName} reverseText />
            </div>
            <div className='board'>
              <div className='connectFour'>
                <GameGridMultiPlayer
                  setAllClickAreasData={setAllClickAreasData}
                  allClickAreasData={allClickAreasData}
                  playerChips={playerChips}
                  setPlayerChips={setPlayerChips}
                  containerRef={containerRef}
                  onAreaClicked={onAreaClicked}
                  disableUI={disableUI}
                  setDisableUI={setDisableUI}
                />
                <ConnectFourGridBlack />
              </div>
            </div>
            <div className='timer-container'>
              {(winner || tieGame) && (
                <Fade in={true}>
                  <WinnerBox tieGame={tieGame} onPlayAgainClick={onPlayAgainClick} currentPlayer={winner} winnerName={winner === props.playerStatus ? props.yourName : props.oppositeName} />
                </Fade>
              )}

              {!winner && !tieGame && (
                <Fade in={true}>
                  <PlayerStatusBox playerName={PlayerName()} playerColour={mainColour[currentPlayer]} />
                </Fade>
              )}
            </div>
          </div>
          <ScoreBox score={oppositePlayerScore} Icon={<PlayerTwo />} playerText={props.playerStatus === "main" ? props.oppositeName : props.yourName} reverseText />
        </Box>
        <Modal open={openPauseMenu} onClose={closeMenu} aria-labelledby='rules-title' aria-describedby='rules-description'>
          <PauseMenu setGameState={props.setGameState} closeMenu={closeMenu} />
        </Modal>
      </Box>
    </Fade>
  );
}
