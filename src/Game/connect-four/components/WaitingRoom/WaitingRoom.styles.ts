import { SxProps, Theme } from '@mui/material';

export const WaitingRoomContainerStyle: SxProps<Theme> = (theme) => ({
  bgcolor: '#E77D7D',
  pt: 8.75,
  pb: 7.5,
  borderWidth: 3,
  borderColor: 'transparent',
  boxShadow: 'none',
  [theme.breakpoints.up('sm')]: {
    borderColor: theme.palette.primary.dark,
    boxShadow: `0px 10px 0px 0px ${theme.palette.primary.dark}`,
    px: 5,
    pt: 8.75,
    pb: 7.5,
  },
  borderStyle: 'solid',

  '& .createdRoom': {
    backgroundColor: "#9DE77D",
    '&:hover': { backgroundColor: "#9DE77D" },
    color: theme.palette.primary.dark,
    '& .text': {
      mr: '1rem',
      [theme.breakpoints.up('sm')]: { mr: '4rem' },
    },
  },

  '& .joinRoom': {
    backgroundColor: theme.palette.secondary.main,
    '&:hover': { backgroundColor: theme.palette.secondary.main },
    color: theme.palette.primary.dark,
    '& .text': {
      mr: '1rem',
      [theme.breakpoints.up('sm')]: { mr: '4rem' },
    },
  },

  '& .back': {
    backgroundColor: "#87CEEB",
    '&:hover': { backgroundColor: "#87CEEB" },
    color: theme.palette.primary.dark,
    '& .text': {
      mr: '1rem',
      [theme.breakpoints.up('sm')]: { mr: '4rem' },
    },
  },


});
