import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TopBar = () => {

    const [weekdays, setWeekdays] = useState([]);

    useEffect(() => {
        let date = new Date();
        let day = date.getDay()
        console.log(day);
        // let currentDay = weekdays[day];
        let newWeekdays = [WEEKDAYS[day++]];
        while (newWeekdays.length < 7) {
            if (day >= WEEKDAYS.length) {
                day = 0;
            }
            newWeekdays.push(WEEKDAYS[day++]);
            // let d = weekdays[6];
            // setWeekdays(weekdays.pop());
            // setWeekdays((prev) => [d, ...prev]);
            // console.log(weekdays[0]);
        }
        setWeekdays(newWeekdays);
        console.log(newWeekdays);
    }, []);

    return (
        <Box sx={{ width: '100vw' }}>
            <Stack 
                direction='row'
                divider={<Divider orientation='vertical' flexItem />}
                style={{ minHeight: '120px' }}
            >
                {weekdays.map((day) => (
                    <Container key={'day_' + day}>{day}</Container>
                ))}
            </Stack>
            <hr />
        </Box>
        
    );
}

export default TopBar;