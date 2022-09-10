import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import EventTasks from './EventTasks';

const NewEventDialog = (props) => {

    const [event, setEvent] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [eventTasks, setEventTasks] = useState([]);
    const [carryOverType, setCarryOverType] = useState('');
    // const [completed, setCompleted] = useState(false);

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleAdd = async() => {
        props.setOpen(false);
        // console.log('add');
        let db = firebase.firestore();
        const id = db.collection('events').doc().id;
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
            completed: false,
            uid: uid,
            carryOverType: carryOverType,
            dueDay: dueDay
        }
        await db.collection('events').doc(id).set(newEvent);
        // await addDoc(db.collection('todos'), {
        //     task: task.todo,
        //     description: task.description
        // })

        for (let i = 0; i < eventTasks.length; i++) {
            let eventTaskId = db.collection('todos').doc().id;
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


        setEvent('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setPriority('');
        setEventTasks([]);
        setCarryOverType('');
        // newTask.id = id;
        if (props.addEvent) {
            props.addEvent(newEvent, id);
        }

        
    }

    useEffect(() => {
        if (props.open == false) {
            setEventTasks([]);
        }
    }, [props.open])

    return (
        <Dialog 
            open={props.open} 
            // {console.log(openAddDialog)}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>New Event</Typography> 
            </DialogTitle>
            <DialogContent>
                <TextField
                    id='eventTitle'
                    label='Event'
                    onChange={(e) => setEvent(e.target.value)}
                />
                <TextField
                    id='eventDescription'
                    label='Description'
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
                    defaultValue='none'
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
                    <Switch onChange={(e) => (e.target.value ? setCarryOverType('carry over') : setCarryOverType('overdue'))} />
                    <Typography>Over due</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAdd}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewEventDialog;