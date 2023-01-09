import { Box, Stack, Typography, Snackbar } from '@mui/material';
import { Dispatch, forwardRef, SetStateAction, useState, useEffect } from 'react';
import { GameState } from '../../../../utils/Types';
import RectangleButton from '../Buttons/RectangleButton';
import { watingMenuStyles } from './WaitingMenu.styles';
import { setSocket } from "../../../../utils/socketio"
import { ReactComponent as CopyIcon } from '../../Icons/copy.svg';
import useCopyToClipboard from './hooks/CopyToClipBoard'
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface PauseMenuProps {
    setGameState: Dispatch<SetStateAction<GameState>>;
    closeMenu: () => void;
    onRestartGameClick?: () => void;
    roomCode: string;
    loading: boolean;
}

export default forwardRef((props: PauseMenuProps, _) => {

    const [value, copy] = useCopyToClipboard();
    const [popupShow, setPopupShow] = useState(false);
   
    const copyClipBoardHandle = () => {
        copy(props.roomCode);  
    }

    useEffect(() => {
      if (value) {
        setPopupShow(true);
      }
    
    }, [value])
    

    return (
        <>
            <Snackbar open={popupShow} onClose={()=> setPopupShow(false)} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: "right" }} >
                <Alert severity="success" sx={{ width: '100%' }}>
                    This Game Code is copied.
                </Alert>
            </Snackbar>
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
        </>
    );
});
