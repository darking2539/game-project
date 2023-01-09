import { Box, Stack, Typography, Popover } from '@mui/material';
import { Dispatch, forwardRef, SetStateAction } from 'react';
import { GameState } from '../../../../utils/Types';
import RectangleButton from '../Buttons/RectangleButton';
import { watingMenuStyles } from './WaitingMenu.styles';
import { setSocket } from "../../../../utils/socketio"
import { ReactComponent as CopyIcon } from '../../Icons/copy.svg';
import useCopyToClipboard from './hooks/CopyToClipBoard'

interface PauseMenuProps {
    setGameState: Dispatch<SetStateAction<GameState>>;
    closeMenu: () => void;
    onRestartGameClick?: () => void;
    roomCode: string;
    loading: boolean;
}

export default forwardRef((props: PauseMenuProps, _) => {

    const [value, copy] = useCopyToClipboard();
    const copyClipBoardHandle = () => {
        copy(props.roomCode);
    }
    return (
        <Box sx={watingMenuStyles}>
            <Typography variant='h2'>Wating...</Typography>
            <Stack spacing={3}>
                <RectangleButton onClick={copyClipBoardHandle} className='continue-game-btn' variant='contained' endIcon={props.loading ? <div /> : <CopyIcon />}>
                    <Box component='span'>{props.loading ? "Connecting..." : props.roomCode}</Box>
                </RectangleButton>
                <RectangleButton className='quit-game-btn' variant='contained' onClick={() => { props.setGameState('main-menu'); setSocket(undefined) }}>
                    <Box component='span'>Exit</Box>
                </RectangleButton>
            </Stack>
        </Box>
    );
});
