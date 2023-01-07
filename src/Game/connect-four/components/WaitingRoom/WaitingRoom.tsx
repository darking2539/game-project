import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Logo from '../Logo/Logo';
import RectangleButton from '../Buttons/RectangleButton';
import { Fade, GlobalStyles } from '@mui/material';
import { WaitingRoomContainerStyle } from './WaitingRoom.styles';
import { Dispatch, SetStateAction } from 'react';
import { GameState } from '../../../../utils/Types';
import { ReactComponent as DoorIcon } from '../../Icons/door-icon.svg';
import { ReactComponent as HomeIcon } from '../../Icons/home-icon.svg';
import { ReactComponent as PersonIcon } from '../../Icons/person-in-icon.svg';

interface WaitingRoomProps {
    setGameState: Dispatch<SetStateAction<GameState>>;
}

export default function WaitingRoom(props: WaitingRoomProps) {

    function onBackClicked() {
        props.setGameState('main-menu');
    }

    const menuGlobalStyles = (
        <GlobalStyles
            styles={(theme) => ({
                body: {
                    backgroundColor: theme.palette.primary.light,
                    [theme.breakpoints.up('sm')]: {
                        backgroundColor: theme.palette.primary.main,
                    },
                },
            })}
        />
    );

    return (
        <>
            {menuGlobalStyles}
            <Fade in={true}>
                <Box maxWidth={480} display='flex' flexDirection='column' alignItems='center' sx={WaitingRoomContainerStyle} borderRadius={10}>
                    <Box component='header' mb={3}>
                        <h1>
                            <Logo />
                        </h1>
                    </Box>
                    <Stack component='main' spacing={2.5} style={{minWidth: "320px"}}>
                        <RectangleButton className='createdRoom' variant='contained' endIcon={<HomeIcon />}>
                            <Box component='span'>
                                Create Room
                            </Box>
                        </RectangleButton>
                        <RectangleButton className='joinRoom' variant='contained' endIcon={<PersonIcon />} >
                            <Box component='span'>
                                Join Room
                            </Box>
                        </RectangleButton>
                        <RectangleButton className='back' onClick={onBackClicked} variant='contained' endIcon={<DoorIcon />}>
                            <Box component='span'>
                                Back
                            </Box>
                        </RectangleButton>
                    </Stack>
                </Box>
            </Fade>
        </>
    )
}
