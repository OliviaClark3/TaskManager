import { AuthProvider } from '../auth/Auth';
import Login from '../auth/Login';
import Welcome from './Welcome';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import Nav from './Nav';
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TodoPage from './TodoPage';

function App() {
  return (
    <Router>
      <CssBaseline>
        <Nav />
        <Routes>
          <Route path='/' element={<HomePage id='content' />} />
          <Route path='/Login/:type' element={<LoginPage id='content' />} />
          <Route path='/todos/:view' element={<TodoPage id='content' />} /> 
        </Routes>
        {/* <HomePage id="content" /> */}
        {/* <AuthProvider>
          <Welcome />
          <Login />
        </AuthProvider> */}
      </CssBaseline>
    </Router>
  );
}

export default App;
