import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import themeOptions from './CustomTheme';
import { BrowserRouter as Router } from 'react-router-dom';
import WebRoutes from './routes';

const theme = createTheme(themeOptions);

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <WebRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
