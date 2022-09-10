import Box from '@mui/material/Box';
import React, { useState } from 'react';
import firebase from './../firebase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                resetInput();
                navigate('/login/login');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const resetInput = () => {
        setEmail("");
        setPassword("");
    };

    return (
        <Box>
            <Stack spacing={2} style={{ maxWidth: '400px', margin: 'auto' }}>
                <TextField 
                    required
                    value={email}
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='email'
                    variant='standard'
                />
                <TextField  
                    required
                    value={password}
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='password'
                    variant='standard'
                />
                <Button onClick={register}>Register</Button>
            </Stack>
            {/* <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
            />
            <button onClick={register}>Register</button> */}
        </Box>
    );
};

export default Register;