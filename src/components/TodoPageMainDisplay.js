import firebase from '../firebase';
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { badgeClasses, Checkbox, Fab, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import ListIcon from '@mui/icons-material/List';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import NewQuickTask from './TodoPageMainDisplayComponents/NewQuickTask';
import NewTaskDialog from './TodoPageDialogComponents/NewTaskDialog';
import NewEventDialog from './TodoPageDialogComponents/NewEventDialog';
import NewProjectDialog from './TodoPageDialogComponents/NewProjectDialog';
import Inbox from './TodoPageMainDisplayComponents/Inbox';
import Today from './TodoPageMainDisplayComponents/Today';
import AllEvents from './TodoPageMainDisplayComponents/AllEvents';
import AllProjects from './TodoPageMainDisplayComponents/AllProjects';
import Tag from './TodoPageMainDisplayComponents/Tag';

const MainDisplay = (props) => {
    

    const [todos, setTodos] = useState([]);
    const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
    const [openAddEventDialog, setOpenAddEventDialog] = useState(false);
    const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);
    const [display, setDisplay] = useState();
    const [tags, setTags] = useState([]);
    const [todoVersion, setTodoVersion] = useState(new Date());

    const handleDisplayNewTask = (newTask, id) => {
        console.log(newTask + id);
        setTodos((prev) => (
            [...prev, {data: newTask, key: id}]
        ))
        setTodoVersion(new Date());
    }

    const handleRemoveDisplayTask = (task, id) => {
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].key == id) {
                todos.splice(i, 1);
            }
        }
        setTodoVersion(new Date());
    }

    // let inboxView = <Inbox todos={todos} setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} />;
    // let todayView = <Today setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} />;
    // let allEventsView = <AllEvents setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} />;
    // let allProjectsView = <AllProjects setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} />;
    // let tagView = <Tag setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} tag={props.view} />

    const fetchTags = async() => {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const tagsResponse = db.collection('tags').where('uid', '==', uid);
        const tagsData = await tagsResponse.get();

        let tagItems = [];
        tagsData.docs.forEach((item) => {
            tagItems.push(item.data().tag);
        })
        setTags(tagItems);
        console.log('tagItems ' + tagItems);
    }

    useEffect(() => {
        fetchTags();
    }, [])

    // useEffect(() => {
    //     if (props.view == 'today') {
    //         setDisplay(todayView);
    //     } else if (props.view == 'inbox') {
    //         setDisplay(inboxView);
    //     } else if (props.view == 'allEvents') {
    //         setDisplay(allEventsView);
    //     } else if (props.view == 'allProjects') {
    //         setDisplay(allProjectsView);
    //     } else if (tags.includes(props.view)) {
    //         setDisplay(tagView);
    //     }
    // }, [props.view])

    const handleAddTask = () => {
        setOpenAddTaskDialog(true);
        // handleDisplayNewTask(newTask, id);
        // console.log('nothing');
        // console.log(openAddDialog);
    }


    const handleAddEvent = () => {
        setOpenAddEventDialog(true);
    }

    const handleAddProject = () => {
        setOpenAddProjectDialog(true);
    }

    

    return (
        <Box sx={{ position: 'relative' }}>
            <NewTaskDialog open={openAddTaskDialog} setOpen={setOpenAddTaskDialog} addTask={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} />
            <NewEventDialog open={openAddEventDialog} setOpen={setOpenAddEventDialog} addEvent={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} />
            <NewProjectDialog open={openAddProjectDialog} setOpen={setOpenAddProjectDialog} addProject={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} />
            <SpeedDial icon={<SpeedDialIcon />} ariaLabel='addTodo' direction='down' sx={{ position: 'absolute', right: '0' }}>
                <SpeedDialAction key='Todo' tooltipTitle='Todo' icon={<ListIcon />} tooltipOpen onClick={handleAddTask} />
                <SpeedDialAction key='Event' tooltipTitle='Event' icon={<EventIcon />} tooltipOpen onClick={handleAddEvent} />
                <SpeedDialAction key='Project' tooltipTitle='Project' icon={<AccountTreeIcon />} tooltipOpen onClick={handleAddProject} />
            </SpeedDial>
            {/* <Fab sx={{ position: 'absolute', right: '0' }}>
                <AddIcon />
            </Fab> */}
            {props.view == 'today' ? (
                <Today setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} todoVersion={todoVersion} />
            ) : props.view == 'inbox' ? (
                <Inbox setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} todoVersion={todoVersion} />
            ) : props.view == 'allEvents' ? (
                <AllEvents setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} todoVersion={todoVersion} />
            ) : props.view == 'allProjects' ? (
                <AllProjects setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} todoVersion={todoVersion} />
            ) : tags.includes(props.view) ? (
                <Tag setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} handleRemoveDisplayTask={handleRemoveDisplayTask} tag={props.view} todoVersion={todoVersion} />
            ) : <Typography>Page not found :P</Typography>}
            
            {/* {display} */}
            {/* <Inbox todos={todos} setTodos={setTodos} handleDisplayNewTask={handleDisplayNewTask} /> */}
            
        </Box>
    )
}

export default MainDisplay;

