import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import EventTasks from './EventTasks';

const PARENT_POS = 0;
const CHILD_LIST_POS = 1;

const EditEventDialog = (props) => {

    const [event, setEvent] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [carryOverType, setCarryOverType] = useState('');
    const [eventTasks, setEventTasks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        props.setOpen(false);
        setIsOpen(false);
        props.setSelectedEvent(null);
    }

    // const handleAdd = async() => {
    //     props.setOpen(false);
    //     // console.log('add');
    //     let db = firebase.firestore();
    //     const id = db.collection('events').doc().id;
    //     const uid = firebase.auth().currentUser.uid;
    //     let newEvent = {
    //         event: event,
    //         description: description,
    //         dueDate: dueDate,
    //         dueTime: dueTime,
    //         priority: priority,
    //         completed: false,
    //         uid: uid
    //     }
    //     await db.collection('events').doc(id).set(newEvent);
    //     // await addDoc(db.collection('todos'), {
    //     //     task: task.todo,
    //     //     description: task.description
    //     // })

    //     for (let i = 0; i < eventTasks.length; i++) {
    //         let eventTaskId = db.collection('todos').doc().id;
    //         let newEventTask = {
    //             task: eventTasks[i].data.task,
    //             completed: false,
    //             carryOverType: carryOverType,
    //             priority: priority,
    //             daysBeforeEvent: eventTasks[i].data.daysBeforeEvent,
    //             eventId: id,
    //             templateId: 0,
    //             uid: uid
    //         }
    //         await db.collection('todos').doc(eventTaskId).set(newEventTask);
    //     }


    //     setEvent('');
    //     setDescription('');
    //     setDueDate('');
    //     setDueTime('');
    //     setPriority('');
    //     setEventTasks([]);
    //     setCarryOverType('');
    //     // newTask.id = id;
    //     if (props.addEvent) {
    //         props.addEvent(newEvent, id);
    //     }

        
    // }

    useEffect(() => {
        if(props.open == true) {
            setEventTasks([]);
            setIsOpen(true);
        }
    }, [props.open])

    useEffect(() => {
        console.log('isOpen value ' + isOpen);
        if (isOpen == true) {
            console.log('event ' + props.selectedEvent)
            setEvent(props.selectedEvent[PARENT_POS].data.event);
            setDescription(props.selectedEvent[PARENT_POS].data.description);
            setDueDate(props.selectedEvent[PARENT_POS].data.dueDate);
            setDueTime(props.selectedEvent[PARENT_POS].data.dueTime);
            setPriority(props.selectedEvent[PARENT_POS].data.priority);
            setCarryOverType(props.selectedEvent[PARENT_POS].data.carryOverType);
            setEventTasks([]);
            let eventTasksList = [];
            for (let i = 0; i < props.selectedEvent[CHILD_LIST_POS].length; i++) {
                eventTasksList.push(props.selectedEvent[CHILD_LIST_POS][i]);
            }
            setEventTasks(eventTasksList);
        }
    }, [isOpen])

    const handleUpdate = async() => {
        console.log('----------------')
        props.setOpen(false);

        const db = firebase.firestore();
        const id = props.selectedEvent[PARENT_POS].key;
        const uid = firebase.auth().currentUser.uid;
        let dueDayList = dueDate.split('-');
        let dueDayStr = dueDayList[0] + dueDayList[1] + dueDayList[2];
        let dueDay = parseInt(dueDayStr);
        let newEvent = {
            event: event,
            description: description,
            dueDate: dueDate,
            dueTime: dueTime,
            priority: priority,
            carryOverType: carryOverType,
            uid: uid,
            dueDay: dueDay
        }
        console.log('newEvent ' + JSON.stringify(newEvent) + ' ' + props.selectedEvent[PARENT_POS].key);
        await db.collection('events').doc(props.selectedEvent[PARENT_POS].key).update(newEvent);
        setEvent('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setPriority('');
        setCarryOverType('');

        for (let i = 0; i < eventTasks.length; i++) {
            const eventTaskId = db.collection('todos').doc().id;
            if (eventTasks[i].key === null) {
                // delete eventTask, has been removed - nethermind
            } else if (eventTasks[i].key === 0) {
                let newEventTask = {
                    task: eventTasks[i].data.task,
                    completed: false,
                    carryOverType: carryOverType,
                    priority: priority,
                    daysBeforeEvent: eventTasks[i].data.daysBeforeEvent,
                    eventId: id,
                    templateId: 0,
                    uid: uid
                }
                await db.collection('todos').doc(eventTaskId).set(newEventTask);
            }
        }

        setEventTasks([]);

        props.handleRemoveDisplayTask(newEvent, props.selectedEvent);
        props.handleDisplayNewTask(newEvent, props.selectedEvent);

    }

    return (
        <Dialog 
            open={props.open} 
            // {console.log(openAddDialog)}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>Edit Event</Typography> 
            </DialogTitle>
            <DialogContent>
                <TextField
                    id='eventTitle'
                    label='Event'
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                />
                <TextField
                    id='eventDescription'
                    label='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <EventTasks
                    eventTasks={eventTasks}
                    setEventTasks={setEventTasks}
                />
                {/* <input 
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
                <br /> */}
                <Select
                    id='prioritySelect'
                    label='Priority'
                    defaultValue={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <MenuItem value='none'>None</MenuItem>
                    <MenuItem value='low'>Low</MenuItem>
                    <MenuItem value='medium'>Medium</MenuItem>
                    <MenuItem value='high'>High</MenuItem>
                    <MenuItem value='urgent'>Urgent</MenuItem>
                </Select>
                <Stack direction='row' spacing='row' alignItems='center'>
                    <Typography>Carry over</Typography>
                    <Switch 
                        value={carryOverType === 'carry over' ? true : false}
                        onChange={(e) => (e.target.value ? setCarryOverType('carry over') : setCarryOverType('overdue'))} 
                    />
                    <Typography>Over due</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditEventDialog;