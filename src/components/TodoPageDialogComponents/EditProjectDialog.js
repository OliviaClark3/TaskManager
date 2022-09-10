import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import ProjectTasks from './ProjectTasks';

const PARENT_POS = 0;
const CHILD_LIST_POS = 1;

const EditProjectDialog = (props) => {

    const [project, setProject] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState('');
    const [carryOverType, setCarryOverType] = useState('');
    const [projectTasks, setProjectTasks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        props.setOpen(false);
        setIsOpen(false);
        props.setSelectedProject(null);
    }

    // const handleAdd = async() => {
    //     props.setOpen(false);
    //     // console.log('add');
    //     let db = firebase.firestore();
    //     const id = db.collection('projects').doc().id;
    //     const uid = firebase.auth().currentUser.uid;
    //     let dueDayList = dueDate.split('-');
    //     let dueDayStr = dueDayList[0] + dueDayList[1] + dueDayList[2];
    //     let dueDay = parseInt(dueDayStr);
    //     let newProject = {
    //         project: project,
    //         description: description,
    //         startDate: startDate,
    //         dueDate: dueDate,
    //         dueTime: dueTime,
    //         priority: priority,
    //         completed: false,
    //         uid: uid,
    //         carryOverType: carryOverType,
    //         dueDay: dueDay
    //     }
    //     await db.collection('projects').doc(id).set(newProject);
    //     // await addDoc(db.collection('todos'), {
    //     //     task: task.todo,
    //     //     description: task.description
    //     // })
    //     console.log('the proj tasksss ' + JSON.stringify(projectTasks));
    //     for (let i = 0; i < projectTasks.length; i++) {
    //         let projectTaskId = db.collection('todos').doc().id;
    //         let taskDueDate = '';
    //         console.log('check if true ');
    //         console.log('dueDate' in projectTasks[i].data);
    //         if ('dueDate' in projectTasks[i].data) {
    //             console.log('has dueDate');
    //             taskDueDate = projectTasks[i].data.dueDate;
    //         }
    //         let newProjectTask = {
    //             task: projectTasks[i].data.task,
    //             completed: false,
    //             carryOverType: carryOverType,
    //             priority: priority,
    //             dueDate: taskDueDate,
    //             uid: uid,
    //             projectId: id
    //         }
    //         await db.collection('todos').doc(projectTaskId).set(newProjectTask);
    //     }

    //     setProject('');
    //     setDescription('');
    //     setStartDate('');
    //     setDueDate('');
    //     setDueTime('');
    //     setPriority('');
    //     setCarryOverType('');
    //     // newTask.id = id;
    //     if (props.addProject) {
    //         props.addProject(newProject, id);
    //     }
    // }

    useEffect(() => {
        if (props.open == true) {
            setProjectTasks([]);
            setStartDate('');
            setDueDate('');
            setIsOpen(true);
        }
    }, [props.open]);

    useEffect(() => {
        console.log('set variables')
        if (isOpen == true) {
            
            console.log(JSON.stringify(props.selectedProject));
            setProject(props.selectedProject[PARENT_POS].data.project);
            setDescription(props.selectedProject[PARENT_POS].data.description);
            setStartDate(props.selectedProject[PARENT_POS].data.startDate);
            setDueDate(props.selectedProject[PARENT_POS].data.dueDate);
            setDueTime(props.selectedProject[PARENT_POS].data.dueTime);
            setPriority(props.selectedProject[PARENT_POS].data.priority);
            setCarryOverType(props.selectedProject[PARENT_POS].data.carryOverType);
            setProjectTasks([]);
            let projectTasksList = [];
            for (let i = 0; i < props.selectedProject[CHILD_LIST_POS].length; i++) {
                projectTasksList.push(props.selectedProject[CHILD_LIST_POS][i]);
            }
            setProjectTasks(projectTasksList);
        }
    }, [isOpen])

    const handleUpdate = async() => {
        props.setOpen(false);

        const db = firebase.firestore();
        const id = props.selectedProject[PARENT_POS].key;
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
        await db.collection('projects').doc(props.selectedProject[PARENT_POS].key).update(newProject);
        
        setProject('');
        setDescription('');
        setStartDate('');
        setDueDate('');
        setDueTime('');
        setPriority('');
        setCarryOverType('');

        for (let i = 0; i < projectTasks.length; i++) {
            const projectTaskId = db.collection('todos').doc().id;
            if (projectTasks[i].key === null) {
                // projecTask deleted
            } else if(projectTasks[i].key === 0) {
                let taskDueDate = '';
                if ('dueDate' in projectTasks[i].data) {
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
                if (taskDueDate != '') {
                    let dueDayList = taskDueDate.split('-');
                    let dueDayStr = dueDayList[0] + dueDayList[1] + dueDayList[2];
                    let dueDay = parseInt(dueDayStr);
                    newProjectTask.dueDay = dueDay;
                }
                await db.collection('todos').doc(projectTaskId).set(newProjectTask);
            }
        }

        setProjectTasks([]);

        props.handleRemoveDisplayTask(newProject, props.selectedProject);
        props.handleDisplayNewTask(newProject, props.selectedProject);
    }

    return (
        <Dialog 
            open={props.open} 
            // {console.log(openAddDialog)}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>Edit Project</Typography> 
            </DialogTitle>
            <DialogContent>
                <TextField
                    id='projectTitle'
                    label='Project'
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                />
                <TextField
                    id='projectDescription'
                    label='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input 
                    id='startDatePicker'
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
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
                <ProjectTasks
                    projectTasks={projectTasks} 
                    setProjectTasks={setProjectTasks}
                    dueDate={dueDate}
                    startDate={startDate}
                />
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

export default EditProjectDialog;