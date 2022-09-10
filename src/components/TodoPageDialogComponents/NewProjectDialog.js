import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import ProjectTasks from './ProjectTasks';

const NewProjectDialog = (props) => {

    const [project, setProject] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [carryOverType, setCarryOverType] = useState('');
    const [projectTasks, setProjectTasks] = useState([]);

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleAdd = async() => {
        props.setOpen(false);
        // console.log('add');
        let db = firebase.firestore();
        const id = db.collection('projects').doc().id;
        const uid = firebase.auth().currentUser.uid;
        let dueDayList = dueDate.split('-');
        let dueDayStr = dueDayList[0] + dueDayList[1] + dueDayList[2];
        let dueDay = parseInt(dueDayStr);
        let newProject = {
            project: project,
            description: description,
            startDate: startDate,
            dueDate: dueDate,
            dueTime: dueTime,
            priority: priority,
            completed: false,
            uid: uid,
            carryOverType: carryOverType,
            dueDay: dueDay
        }
        await db.collection('projects').doc(id).set(newProject);
        // await addDoc(db.collection('todos'), {
        //     task: task.todo,
        //     description: task.description
        // })
        console.log('the proj tasksss ' + JSON.stringify(projectTasks));
        for (let i = 0; i < projectTasks.length; i++) {
            let projectTaskId = db.collection('todos').doc().id;
            let taskDueDate = '';
            console.log('check if true ');
            console.log('dueDate' in projectTasks[i].data);
            if ('dueDate' in projectTasks[i].data) {
                console.log('has dueDate');
                taskDueDate = projectTasks[i].data.dueDate;
            }
            let newProjectTask = {
                task: projectTasks[i].data.task,
                completed: false,
                carryOverType: carryOverType,
                priority: priority,
                dueDate: taskDueDate,
                uid: uid,
                projectId: id
            }
            await db.collection('todos').doc(projectTaskId).set(newProjectTask);
        }

        setProject('');
        setDescription('');
        setStartDate('');
        setDueDate('');
        setDueTime('');
        setPriority('');
        setCarryOverType('');
        // newTask.id = id;
        if (props.addProject) {
            props.addProject(newProject, id);
        }
    }

    useEffect(() => {
        if (props.open == false) {
            setProjectTasks([]);
            setStartDate('');
            setDueDate('');
        }
    }, [props.open]);

    return (
        <Dialog 
            open={props.open} 
            // {console.log(openAddDialog)}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>New Project</Typography> 
            </DialogTitle>
            <DialogContent>
                <TextField
                    id='projectTitle'
                    label='Project'
                    onChange={(e) => setProject(e.target.value)}
                />
                <TextField
                    id='projectDescription'
                    label='Description'
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input 
                    id='startDatePicker'
                    type='date'
                    onChange={(e) => setStartDate(e.target.value)}
                />
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
                <ProjectTasks
                    projectTasks={projectTasks} 
                    setProjectTasks={setProjectTasks}
                    dueDate={dueDate}
                    startDate={startDate}
                />
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

export default NewProjectDialog;