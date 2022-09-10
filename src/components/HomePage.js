import React, { useContext } from 'react';
import { AuthContext } from '../auth/Auth';
import Nav from './Nav';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { getThemeProps, textAlign } from '@mui/system';
import { Link } from 'react-router-dom';

const HomePage = (props) => {
    // const { currentUser } = useContext(AuthContext);

    return (
        <Box id={props.id}>
            <h1 style={{ textAlign: 'center' }}>Doable</h1>
            <Stack spacing={2} direction='row'>
                <Button variant='outlined' href='/login/register' value='register'>Register</Button>
                <Button variant='outlined' href='/login/login'>Login</Button>
            </Stack>
        </Box>
    );

}

export default HomePage;