import { Button, ButtonGroup, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemText, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import AddIcon from '@mui/icons-material/Add';
import AddSubtasks from './AddSubtasks';
import { ClassNames } from '@emotion/react';
// import { DatePicker } from '@material-ui/pickers';

const NewTaskDialog = (props) => {

    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [showDateDependantSettings, setShowDateDependantSettings] = useState(false);
    const [carryOverType, setCarryOverType] = useState('');
    const [hasSubtasks, setHasSubtasks] = useState(false);
    // const [subtaskDisplay, setSubtaskDisplay] = useState(<Button startIcon={<AddIcon />}>Add Subtasks</Button>);
    const [subtasks, setSubtasks] = useState([]);

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleAdd = async() => {
        props.setOpen(false);
        console.log('subtasks length ' + subtasks.length);
        if (subtasks.length > 0) {
            setHasSubtasks(true);
        }
        // console.log('add');
        let db = firebase.firestore();
        const id = db.collection('todos').doc().id;
        const uid = firebase.auth().currentUser.uid;
        let dueDayList = dueDate.split('-');
        let dueDayStr = dueDayList[0] + dueDayList[1] + dueDayList[2];
        let dueDay = parseInt(dueDayStr);
        console.log('dueDay ' + dueDay);
        let newTask = {
            task: task,
            description: description,
            carryOverType: carryOverType,
            dueDate: dueDate,
            dueTime: dueTime,
            priority: priority,
            completed: false,
            uid: uid,
            hasSubtasks: hasSubtasks,
            dueDay: dueDay
        }
        // if (hasSubtasks) {
        //     newTask.hasSubtasks = true
        // }
        console.log('hasSubtasks value ' + hasSubtasks);
        await db.collection('todos').doc(id).set(newTask);
        // await addDoc(db.collection('todos'), {
        //     task: task.todo,
        //     description: task.description
        // })
        // const subId;
        
        for (let i = 0; i < subtasks.length; i++) {
            const subId = db.collection('todos').doc().id;
            let newSubtask = {
                task: subtasks[i].data.task,
                description: '',
                parentTaskId: id,
                completed: false,
                uid: uid,
                // dueDate: dueDate,
                // dueDay: dueDay
            }
            await db.collection('todos').doc(subId).set(newSubtask);
        }

        setTask('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setPriority('');
        setCarryOverType('');
        setHasSubtasks(false);
        setSubtasks([]);
        // newTask.id = id;
        if (props.addTask) {
            props.addTask(newTask, id);
        }
        // props.handleDisplayNewTask(newTask, id);
    }

    useEffect(() => {
        if (props.open == false) {
            setSubtasks([]);
            setHasSubtasks(false);
        }
    }, [props.open])

    useEffect(() => {
        if (dueDate == '') {
            setShowDateDependantSettings(false);
        } else {
            setShowDateDependantSettings(true);
        }
    }, [dueDate])

    const dateDependateSettings = (
        <Stack direction='row' spacing='row' alignItems='center'>
            <Typography>Carry over</Typography>
            <Switch onChange={(e) => (e.target.value ? setCarryOverType('carry over') : setCarryOverType('overdue'))} />
            <Typography>Over due</Typography>
        </Stack>
    )

    // const fetchSubtasks = () => {
    //     const db = firebase.firestore();
    //     const uid = firebase.auth().currentUser.uid;
    //     const subtasksResponse = db.collection('todos').where('uid', '==', uid).where
    // }

    // const handleClickAway = () => {
    //     console.log('handleclickaway');
    //     setSubtasks([]);
    //     // setNewSubtask('');
    //     setHasSubtasks(false);
    //     // props.setOpen(false);
    //     console.log('1hassubtasks ' + hasSubtasks)
    // }

    // useEffect(() => {
    //     setHasSubtasks(false);
    //     // setSubtasks([]);
    // }, [])

    // useEffect(() => {
    //     console.log('hassubtasks ' + hasSubtasks)
    //     if (hasSubtasks == false) {
    //         setSubtaskDisplay(<Button startIcon={<AddIcon />} onClick={() => setHasSubtasks(true)}>Add Subtasks</Button>)
    //     } else {
    //         // fetchSubtasks();
    //         // setSubtaskDisplay(<AddSubtasks setSubtasks={setSubtasks} />) 
    //         setSubtaskDisplay(
    //             <ClickAwayListener onClickAway={() => setHasSubtasks(false)}>
    //                 <AddSubtasks setSubtasks={setSubtasks} />
    //             </ClickAwayListener>
    //         );
    //     }
    // }, [hasSubtasks, subtasks])

    

    return (
        // <ClickAwayListener onClickAway={handleClickAway}>
            <Dialog 
                open={props.open} 
                // {console.log(openAddDialog)}
                onClose={handleClose}
            >
                <DialogTitle>
                    <Typography>New Task</Typography> 
                </DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        id='todoTitle'
                        label='Task'
                        onChange={(e) => setTask(e.target.value)}
                    />
                    <TextField
                        id='todoDescription'
                        label='Description'
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <AddSubtasks 
                        subtasks={subtasks}
                        setSubtasks={setSubtasks} 
                        hasSubtasks={hasSubtasks}
                        setHasSubtasks={setHasSubtasks} 
                        handleRemoveDisplayTask={props.handleRemoveDisplayTask}
                    />
                    {/* {subtaskDisplay} */}
                    <br />
                    <input 
                        id='dueDatePicker'
                        type='date'
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <br />
                    <input
                        id='dueTimePicker'
                        type='time'
                        onChange={(e) => setDueTime(e.target.value)}
                    />
                    <br />
                    <Select
                        id='prioritySelect'
                        label='Priority'
                        defaultValue='none'
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <MenuItem value='none'>None</MenuItem>
                        <MenuItem value='low'>Low</MenuItem>
                        <MenuItem value='medium'>Medium</MenuItem>
                        <MenuItem value='high'>High</MenuItem>
                        <MenuItem value='urgent'>Urgent</MenuItem>
                    </Select>
                    {showDateDependantSettings ? dateDependateSettings : ''}
                    {/* <ButtonGroup>
                        <Button>Low</Button>
                        <Button>Medium</Button>
                        <Button>High</Button>
                        <Button>Urgent</Button>
                    </ButtonGroup> */}
                    
                    {/* <FormControlLabel 
                        control={<Switch defaultChecked />}
                    /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAdd}>Add</Button>
                </DialogActions>
            </Dialog>
        // </ClickAwayListener>
    )
}

export default NewTaskDialog;