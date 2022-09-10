import Box from '@mui/material/Box';
import React, { useState } from 'react';
import firebase from './../firebase';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import ReactDOMServer from 'react-dom/server';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                resetInput();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const login = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((data) => {
                resetInput();
                // console.log('logged in')
                navigate('/todos/inbox');
                // return redirect('/todos');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const logOut = () => {
        firebase.auth().signOut();
    };

    const resetInput = () => {
        setEmail("");
        setPassword("");
    };

    return (
        <Box component='form'>
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
                <Button onClick={login}>Login</Button>
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
            /> */}
            {/* <button onClick={login}>Login</button> */}
        </Box>
    );
};

export default Login;