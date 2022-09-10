import React from 'react';
import Login from '../auth/Login';
import Box from '@mui/material/Box';
import { useNavigate, useParams } from 'react-router-dom';
import Register from '../auth/Register';
import Logout from '../auth/Logout';
import firebase from './../firebase';

const LoginPage = (props) => {
    const { type } = useParams();
    const navigate = useNavigate();
    // const type = props.match.params.type;
    // console.log(type);

    const logout = () => {
        const logOut = () => {
            firebase.auth().signOut();
        };
    }

    if (type == 'login') {
        return (
            <Box id={props.id}>
                <h1>Login</h1>
                <Login />
            </Box>
        );
    } else if (type == 'register') {
        return (
            <Box id={props.id}>
                <h1>Register</h1>
                <Register />
            </Box>
        );
    // } else if (type == 'logout') {
    //     const logOut = () => {
    //         firebase.auth().signOut();
    //     };
    //     navigate('/');
        // return (
        //     <Box id={props.id}>
        //         {/* <h1>Login</h1> */}
        //         {/* <Logout /> */}
        //         {/* const logOut = () => {
        //             firebase.auth().signOut();
        //         } */}
        //     </Box>
        // );
    }
}    

export default LoginPage;