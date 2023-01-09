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
import { gameBoardContainerStyles } from './GameBoardMultiPlayer.styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useInitialRectData } from './hooks/useInitialRectData';
import PauseMenu from '../PauseMenu/PauseMenu';
import WaitingMenu from '../WaitingMenu/WaitingMenu';
import { GameState, Player } from '../../../../utils/Types';
import { ClickAreaData } from '../../../../utils/Interfaces';
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
  roomStatus: boolean;
  setRoomStatus: Dispatch<SetStateAction<boolean>>;
}

export default function GameBoardMultiPlayer(props: GameBoardMultiplayerProps) {

  const { setOppositeName, setRoomStatus, playerStatus, yourName, oppositeName, roomStatus, roomCode } = props

  const { currentPlayer, setCurrentPlayer, allClickAreasData, setAllClickAreasData } = useInitialRectData();

  const [playerChips, setPlayerChips] = useState<JSX.Element[]>([]);
  const [openPauseMenu, setOpenPauseMenu] = useState(false);
  const [openLoadingMenu, setOpenLoadingMenu] = useState(true);
  const [loadOppnent, setLoadOppnent] = useState(true);
  const [disableUI, setDisableUI] = useState(false);
  const [tieGame, setTieGame] = useState(false);
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
      "clickBy": playerStatus,
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
      "clickBy": playerStatus,
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
      setDisableUI(clickBy === playerStatus);
    }

    setPlayerChips((oldValues) => {
      return [
        ...oldValues,
        <Slide key={new Date().getTime()} timeout={500} in={true} container={containerRef.current}>
          <PlayerChip colour={mainColour[clickBy]} x={x} y={y} />
        </Slide>,
      ];
    });
  };

  const handleStatusCallBack = useCallback((props: any) => {
    //handle showName
    console.log("status:", props);
    if (props?.status === "Start") {
      if (playerStatus === "main") {
        setOppositeName(props?.join?.username);
        setOpenLoadingMenu(false);
      } else {
        setOppositeName(props?.create?.username);
        setOpenLoadingMenu(false);
      };
    } else if (props?.status === "Waiting") {
      setLoadOppnent(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlayGameCallBack = useCallback((props: any) => {
    console.log("play-game:", props);
    if (props?.selectedClick) {
      addChipInTable(props?.selectedClick, props?.allClickAreasData, props?.clickBy);
    } else {
      //reset all table
      setAllClickAreasData(props?.allClickAreasData);
      setWinner(null);
      setTieGame(false);
      setPlayerChips([]);
      setDisableUI(props?.clickBy !== playerStatus);
      setCurrentPlayer(props?.clickBy === "main" ? "main" : "opponent");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {

    function InitSocketIo() {
      if (!socket) {
        initiateSocketConnection(yourName);
        socket.on("status", handleStatusCallBack);
        socket.on("play-game", handlePlayGameCallBack);
      };

      if (!socket || roomStatus) {
        if (playerStatus === "main") {
          createdRoom(roomCode);
          setAllClickAreasData(generateInitialRectDataArray(COLUMNS, ROWS));
          setOppositeName("Wating...");
          setRoomStatus(false);
        } else {
          joinRoom(roomCode);
          setAllClickAreasData(generateInitialRectDataArray(COLUMNS, ROWS));
          setOppositeName("Wating...");
          setRoomStatus(false);
        }
      };
    };

    function InitGeneralData() {
      setDisableUI(playerStatus !== "main");
      setLoadOppnent(true);
    };
  
    InitSocketIo();
    InitGeneralData();

  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const PlayerName = () => {
    if (playerStatus === "main") {
      if (currentPlayer === "main") {
        return yourName;
      } else {
        return oppositeName;
      }
    } else {
      if (currentPlayer === "main") {
        return oppositeName;
      } else {
        return yourName;
      }
    }
  }

  return (
    <Fade in={true}>
      <Box width='100%' height='100%' display='flex' justifyContent='center'>
        <Box sx={gameBoardContainerStyles}>
          <ScoreBox score={mainPlayerScore} Icon={<PlayerOne />} playerText={playerStatus === "main" ? yourName : oppositeName} />
          <div className='central-content'>
            <header className='game-board-header'>
              <PillButton onClick={openMenu}>Menu</PillButton>
              <Logo />
              <CopyButton endIcon={<ContentCopyIcon />}>{props.roomCode}</CopyButton>
            </header>
            <div className='horizontal-scores'>
              <ScoreBox score={mainPlayerScore} Icon={<PlayerOne />} iconPlacement='left' playerText={playerStatus === "main" ? yourName : oppositeName} />
              <ScoreBox score={oppositePlayerScore} Icon={<PlayerTwo />} iconPlacement='right' playerText={playerStatus === "main" ? oppositeName : yourName} reverseText />
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
                  <WinnerBox tieGame={tieGame} onPlayAgainClick={onPlayAgainClick} currentPlayer={winner} winnerName={winner === playerStatus ? yourName : oppositeName} />
                </Fade>
              )}

              {!winner && !tieGame && !openLoadingMenu && (
                <Fade in={true}>
                  <PlayerStatusBox playerName={PlayerName()} playerColour={mainColour[currentPlayer]} />
                </Fade>
              )}
            </div>
          </div>
          <ScoreBox score={oppositePlayerScore} Icon={<PlayerTwo />} playerText={playerStatus === "main" ? oppositeName : yourName} reverseText />
        </Box>
        <Modal open={openPauseMenu} onClose={closeMenu} aria-labelledby='rules-title' aria-describedby='rules-description'>
          <PauseMenu hideRestart={true} setGameState={props.setGameState} closeMenu={closeMenu} />
        </Modal>
        <Modal open={openLoadingMenu} onClose={closeMenu} aria-labelledby='rules-title' aria-describedby='rules-description'>
          <WaitingMenu loading={loadOppnent} roomCode={props.roomCode} setGameState={props.setGameState} closeMenu={closeMenu} />
        </Modal>
      </Box>
    </Fade>
  );
}
