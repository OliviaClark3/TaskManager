import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TopBar from './TodoPageTopBar';
import MainDisplay from './TodoPageMainDisplay';
import LeftSideBar from './TodoPageLeftSideBar';
import RightSideBar from './TodoPageRightSideBar';
import { useNavigate, useParams } from 'react-router-dom';

const TodoPage = () => {
    const { view } = useParams();

    // const [display, setDisplay] = useState();

    // let todayView = <Today todos={todos} setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} />;
    // let inboxView = <Inbox todos={todos} setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} />;

    // useEffect(() => {
    //     if (view == 'today') {
    //         setDisplay(todayView);
    //     } else if (view == 'inbox') {
    //         setDisplay(inboxView);
    //     }
    // }, [view])

    return (
        // <Box sx={{ flexGrow: 1, height: '100vh' }}>
        //     <Grid container spacing={2} display='flex' justifyContent="center" alignItems='stretch' sx={{ border:'solid 2px red' }}>
        //         <Grid item>one</Grid>
        //         <Grid item>two</Grid>
        //         <Grid item>three</Grid>
        //     </Grid>
        // </Box>

        <Box>
            <TopBar />
            <Grid container sx={{ display:'flex', minHeight: '70vh' }}>
                <Grid item xs={2} sx={{ borderRight: 'solid 1px #000', padding: '10px' }}>
                    <LeftSideBar />
                </Grid>
                <Grid item xs={7.5} sx={{ borderRight: 'solid 1px #000', padding: '10px' }}>
                    <MainDisplay view={view} />
                </Grid>
                <Grid item xs={2.5} sx={{ padding: '10px' }}>
                    <RightSideBar />
                </Grid>
            </Grid>
        </Box>

        // <Box sx={{ alignItems: 'stretch', display: 'flex', flexWrap: 'wrap' }}>
        //     <TopBar />
        //     <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
        //         <Box sx={{ backgroundColor: 'red' }}>
        //             Right
        //         </Box>
        //         <Box sx={{ backgroundColor: 'green' }}>
        //             Middle
        //         </Box>
        //         <Box sx={{ backgroundColor: 'blue' }}>
        //             Right
        //         </Box>
        //     </Box>
            
        // </Box>
        
        // <Grid container direction='row'>
        //     <Grid item xs={12}>
        //         <TopBar />
        //     </Grid>
        //     <Grid container> 
        //         <Grid xs={2} item style={{ backgroundColor: 'red'}}>
        //             <Typography>Inbox</Typography>
        //             <Typography>All Todos</Typography>
        //         </Grid>
        //         <Grid xs={8} item style={{ backgroundColor: 'green'}}>
        //             <Typography>Middle</Typography>
        //         </Grid>
        //         <Grid xs={2} item style={{ backgroundColor: 'blue'}}>
        //             <Typography>Right</Typography>
        //         </Grid>
        //     </Grid>
        // </Grid>
    );
}

export default TodoPage;