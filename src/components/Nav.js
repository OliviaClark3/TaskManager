import React, { useState, useEffect } from 'react';
// import { AppBar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import firebase from './../firebase';

const Nav = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loginOption, setLoginOption] = useState();

    const handleLogout = () => {
        console.log('logging out')
        // const logOut = () => {
        firebase.auth().signOut();
        // };
    }

    // let loginOption = null;
    console.log(firebase.auth().currentUser);
    // if (!firebase.auth().currentUser) {
    //     loginOption = (
    //         <Link to='/login/login'>
    //             <Button color="inherit">Login</Button>
    //         </Link>
    //     );
    // } else {
    //     loginOption = (
    //         <Link to='/'>
    //             <Button onClick={handleLogout} color="inherit">Logout</Button>
    //         </Link>
    //     );
    // }

    useEffect(() => {

        firebase.auth().onAuthStateChanged(function(user) {

            if (user && !loggedIn) {
                setLoggedIn(true);
            } else if (!user && loggedIn) {
                setLoggedIn(false);
            }

            // if (!user) {
            //     // User is signed in.
            //     console.log('new signed in');
            //     setLoginOption(
            //         <Link to='/login/login'>
            //             <Button color="inherit">Login</Button>
            //         </Link>
            //     )
            // } else {
            //     // No user is signed in.
            //     console.log('new not isnged in');
            //     setLoginOption(
            //         <Link to='/'>
            //             <Button onClick={handleLogout} color="inherit">Logout</Button>
            //         </Link>
            //   )
            // }
        });



        // console.log(firebase.auth().uid);
        
    })

    useEffect(() => {
        if (!loggedIn) {
            console.log('not logged in')
            setLoginOption(
                <Link to='/login/login'>
                    <Button color="inherit">Login</Button>
                </Link>
            );
        } else {
            console.log('logged in')
            setLoginOption(
                <Link to='/'>
                    <Button onClick={handleLogout} color="inherit">Logout</Button>
                </Link>
            );
        }
    }, [loggedIn])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Link to='/'>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            DuctTape
                        </Typography>
                    </Link>
                    {loginOption}
                    {/* <Link to='/login/login'>
                        <Button color="inherit">Login</Button>
                    </Link>
                    <Link to='/'>
                        <Button onClick={handleLogout} color="inherit">Logout</Button>
                    </Link> */}
                    {/* <Link to='/login/login'>
                        <Button color="inherit">Login</Button>
                    </Link>
                    <Link to='/'>
                        <Button onClick={handleLogout} color="inherit">Logout</Button>
                    </Link> */}
                </Toolbar>
            </AppBar>
        </Box>
        // <Box sx={{ flexGrow: 1}}>
        //     <AppBar position='static'>
        //         <Toolbar>
        //             <Typography variant='h6'>
        //                 Ultimate Todo App
        //             </Typography>
        //             <Button>Login</Button>
        //         </Toolbar>
        //     </AppBar>
        // </Box>
    );
};

export default Nav;