import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import AddSubtasks from './AddSubtasks';

const PARENT_POS = 0;
const CHILD_LIST_POS = 1;

const EditTaskDialog = (props) => {

    const [isOpen, setIsOpen] = useState(false);
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [showDateDependantSettings, setShowDateDependantSettings] = useState(false);
    const [carryOverType, setCarryOverType] = useState('');
    const [hasSubtasks, setHasSubtasks] = useState(false);
    const [subtasks, setSubtasks] = useState([]);

    const handleClose = () => {
        props.setOpen(false);
        setIsOpen(false);
        props.setSelectedTask(null);
        // setSubtasks([]);
    }

    // const fetchData = async() => {
    //     const db = firebase.firestore();
    //     const uid = firebase.auth().currentUser.uid;
    //     const taskResponse = db.collection('todos').where('uid', '==', uid).where(firebase.firestore.FieldPath.documentId(), '==', props.selectedTask);
    //     const taskData = await taskResponse.get();
        
    //     let taskItem = taskData.docs[0].data();
    //     console.log(taskItem);

    //     setTask(taskItem.task);
    //     setDescription(taskItem.description);
    //     setDueDate(taskItem.dueDate);
    //     // if (dueDate != '') {
    //     setDueTime(taskItem.dueTime);
    //     // }
        
    //     setPriority(taskItem.priority);
    //     setCarryOverType(taskItem.carryOverType);
    //     setHasSubtasks(taskItem.hasSubtasks);

    //     console.log('is subtasks? ' + taskItem.hasSubtasks);
    //     let subtaskItems = [];
    //     if (taskItem.hasSubtasks == true) {
    //         console.log('parent id ' + props.selectedTask);
    //         const subtasksResponse = db.collection('todos').where('uid', '==', uid).where('parentTaskId', '==', props.selectedTask);
    //         const subtasksData = await subtasksResponse.get();

    //         subtasksData.docs.forEach((item) => {
    //             console.log('found subtask');
    //             subtaskItems.push({data: item.data(), key: item.id});
    //         })
    //     }

    //     setSubtasks(subtaskItems);
    //     console.log('subtaskers ' + subtaskItems);
        

    // }

    useEffect(() => {
        if (props.open === true) {
            setIsOpen(true);
        }
        console.log('subtasks show ' + JSON.stringify(subtasks));
    })

    useEffect(() => {
        // if (props.selectedTask) {
        //     fetchData();
        // }
        // if (props.open == false) {
        //     setSubtasks([]);
        // }
        if (isOpen === true) {
            console.log('selected task ' + props.selectedTask);
            setTask(props.selectedTask[PARENT_POS].data.task);
            setDescription(props.selectedTask[PARENT_POS].data.description);
            setDueDate(props.selectedTask[PARENT_POS].data.dueDate);
            setDueTime(props.selectedTask[PARENT_POS].data.dueTime);
            setPriority(props.selectedTask[PARENT_POS].data.priority);
            setCarryOverType(props.selectedTask[PARENT_POS].data.carryOverType);
            setHasSubtasks(props.selectedTask[PARENT_POS].data.hasSubtasks);
            setSubtasks([]);
            let subtasksList = [];
            console.log('child list ' + JSON.stringify(props.selectedTask[CHILD_LIST_POS][0]));
            for (let i = 0; i < props.selectedTask[CHILD_LIST_POS].length; i++) {
                subtasksList.push(props.selectedTask[CHILD_LIST_POS][i]);
            }
            console.log('set the subtasks ' + JSON.stringify(subtasksList));
            setSubtasks(subtasksList);
        } 
        
        
    }, [isOpen])

    const handleUpdate = async() => {
        console.log('lool');
        props.setOpen(false);

        const db = firebase.firestore();
        // const id = db.collection('todos').doc().id;
        const uid = firebase.auth().currentUser.uid;
        let dueDayList = dueDate.split('-');
        let dueDayStr = dueDayList[0] + dueDayList[1] + dueDayList[2];
        let dueDay = parseInt(dueDayStr);
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
        console.log('test ' + JSON.stringify(props.selectedTask));
        await db.collection('todos').doc(props.selectedTask[PARENT_POS].key).update(newTask);
        console.log('check');
        setTask('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setPriority('');
        setCarryOverType('');
        setHasSubtasks(false);
        
        console.log('check subs ' + JSON.stringify(subtasks) + ' ' + JSON.stringify(props.selectedTask))
        for (let i = 0; i < subtasks.length; i++) {
            const subId = db.collection('todos').doc().id;
            if (subtasks[i].key == null) {
                // subtask delete need to remove - nethermind
            } else if (subtasks[i].key === 0) {
                let newSubtask = {
                    task: subtasks[i].data.task,
                    description: '',
                    parentTaskId: props.selectedTask[PARENT_POS].key,
                    completed: false,
                    uid: uid,
                    dueDate: dueDate
                }
                await db.collection('todos').doc(subId).set(newSubtask);
            }
            
        }

        setSubtasks([]);

        props.handleRemoveDisplayTask(newTask, props.selectedTask);
        props.handleDisplayNewTask(newTask, props.selectedTask)
        
    }

    useEffect(() => {
        if (dueDate === '') {
            setShowDateDependantSettings(false);
        } else {
            setShowDateDependantSettings(true);
        }
    }, [dueDate])

    const dateDependateSettings = (
        <Stack direction='row' spacing='row' alignItems='center'>
            <Typography>Carry over</Typography>
            <Switch 
                value={carryOverType === 'carry over' ? true : false}
                onChange={(e) => (e.target.value ? setCarryOverType('carry over') : setCarryOverType('overdue'))} 
            />
            <Typography>Over due</Typography>
        </Stack>
    )

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>Edit Task</Typography>
            </DialogTitle>
            <DialogContent>
                <TextField
                    id='todoTitle'
                    label='Task'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <TextField
                    id='todoDescription'
                    label='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <AddSubtasks 
                    subtasks={subtasks} 
                    setSubtasks={setSubtasks} 
                    hasSubtasks={hasSubtasks} 
                    setHasSubtasks={setHasSubtasks} 
                    open={props.open}
                    handleRemoveDisplayTask={props.handleRemoveDisplayTask}
                />
                {/* {subtaskDisplay} */}
                <br />
                <input 
                    id='dueDatePicker'
                    type='date'
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <br />
                <input
                    id='dueTimePicker'
                    type='time'
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                />
                <br />
                <Select
                    id='prioritySelect'
                    label='Priority'
                    // defaultValue='none'
                    value={priority}
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
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>

        </Dialog>
    )
}

export default EditTaskDialog;