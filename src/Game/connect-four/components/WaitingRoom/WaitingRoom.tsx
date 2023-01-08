import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Logo from '../Logo/Logo';
import RectangleButton from '../Buttons/RectangleButton';
import JoinRoomMenu from '../JoinRoomMenu/JoinRoomMenu';
import { Fade, GlobalStyles, Modal } from '@mui/material';
import { WaitingRoomContainerStyle } from './WaitingRoom.styles';
import { useState, Dispatch, SetStateAction } from 'react';
import { GameState, Player } from '../../../../utils/Types';
import { ReactComponent as DoorIcon } from '../../Icons/door-icon.svg';
import { ReactComponent as HomeIcon } from '../../Icons/home-icon.svg';
import { ReactComponent as PersonIcon } from '../../Icons/person-in-icon.svg';

interface WaitingRoomProps {
    setGameState: Dispatch<SetStateAction<GameState>>;
    setPlayerStatus: Dispatch<SetStateAction<Player>>;
    setRoomCode: Dispatch<React.SetStateAction<string>>;
    setYourName: Dispatch<React.SetStateAction<string>>;
    setOppositeName: Dispatch<React.SetStateAction<string>>;
}

export default function WaitingRoom(props: WaitingRoomProps) {

    const [openJoinRoomMenu, setOpenJoinRoomMenu] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [state, setState] = useState<string>("");

    const menuGlobalStyles = (
        <GlobalStyles
            styles={(theme) => ({
                body: {
                    backgroundColor: "#E77D7D",
                    [theme.breakpoints.up('sm')]: {
                        backgroundColor: theme.palette.primary.main,
                    },
                },
            })}
        />
    );

    const onBackClicked = () => {
        props.setGameState('main-menu');
    }

    const onCreatedRoomClicked = () => {
        setOpenJoinRoomMenu(true);
        setTitle("CREATE ROOM");
        setState("create");
    }

    const onJoinRoomClicked = () => {
        setOpenJoinRoomMenu(true);
        setTitle("JOIN ROOM");
        setState("join");
    }

    const closeJoinRoomMenu = () => {
        setOpenJoinRoomMenu(false);
    }


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
                    <Stack component='main' spacing={2.5} style={{ minWidth: "320px" }}>
                        <RectangleButton className='createdRoom' onClick={onCreatedRoomClicked} variant='contained' endIcon={<HomeIcon />}>
                            <Box component='span'>
                                Create Room
                            </Box>
                        </RectangleButton>
                        <RectangleButton className='joinRoom' onClick={onJoinRoomClicked} variant='contained' endIcon={<PersonIcon />} >
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
                    <Modal open={openJoinRoomMenu} onClose={closeJoinRoomMenu} aria-labelledby='rules-title' aria-describedby='rules-description'>
                        <JoinRoomMenu setGameState={props.setGameState} title={title} state={state} setRoomCode={props.setRoomCode} setPlayerStatus={props.setPlayerStatus} setYourName={props.setYourName} setOppositeName={props.setOppositeName}  />
                    </Modal>
                </Box>
            </Fade>
        </>
    )
}
