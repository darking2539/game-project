import { Box, Fade, Slide } from '@mui/material';
import { useRef, useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import { mainColour } from '../../../../CustomTheme';
import { OpponentName, Player } from '../../../../utils/Types';
import MarkerIcon from '../../Icons/MarkerIcon';
import PlayerChip from '../GameObjects/PlayerChip/PlayerChip';
import ConnectFourGridWhite from '../GameObjects/BoardGrid/ConnectFourGridWhite';
import { mainGridStyles } from './GameGridMultiPlayer.styles';
import { RankingInfo, ClickAreaData } from '../../../../utils/Interfaces';

interface ConnectFourGridProps {
  allClickAreasData: ClickAreaData[];
  playerChips: JSX.Element[];
  setPlayerChips: Dispatch<SetStateAction<JSX.Element[]>>;
  setAllClickAreasData: Dispatch<SetStateAction<ClickAreaData[]>>;
  containerRef: React.MutableRefObject<null>;
  onAreaClicked: (selectedClickAreaData: ClickAreaData) => void;
  setDisableUI: Dispatch<SetStateAction<boolean>>;
  disableUI: boolean;
}

export default function GameGrid(props: ConnectFourGridProps) {
  const { allClickAreasData, playerChips, setPlayerChips, setAllClickAreasData, containerRef, onAreaClicked, disableUI } = props;

  return (
    <>
      <svg className='white-grid' width='100%' height='100%' viewBox='0 0 632 584' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <rect id='clickArea' width='100%' height='100%' fill='none' rx='40' ry='40' stroke='black' />
          <clipPath id='clip'>
            <use xlinkHref='#clickArea' />
          </clipPath>
        </defs>
        <use xlinkHref='#clickArea' />
        <g clipPath='url(#clip)'>

          {playerChips}
          <ConnectFourGridWhite />
          {allClickAreasData.map((data) => {
            return (
              <g key={data.index}>
                {data.winningArea && (
                  <Fade in={true}>
                    <Box component='circle' cx={data.x + 44} cy={data.y + 46} r='14' stroke='white' strokeWidth='6' fill='transparent'></Box>
                  </Fade>
                )}
                <Box
                  component='rect'
                  sx={{
                    '@media (hover: hover) and (pointer: fine)': {
                      cursor: data.fullColumn || disableUI ? 'block' : 'pointer',
                    },
                  }}
                  onClick={() => onAreaClicked(data)}
                  width='88px'
                  height='88px'
                  x={data.x}
                  y={data.y}
                  opacity='0'
                />
              </g>
            );
          })}
        </g>
      </svg>
    </>
  );
}
