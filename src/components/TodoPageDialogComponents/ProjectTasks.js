import { Button, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import firebase from '../../firebase';
import CloseIcon from '@mui/icons-material/Close';

const ProjectTasks = (props) => {

    const [newProjectTask, setNewProjectTask] = useState('');
    const [newProjectTaskDueDate, setNewProjectTaskDueDate] = useState('');

    // useEffect(() => {
    //     if (props.hasSubtasks) {
    //         console.log('hassubtasksks ' + props.hasSubtasks);
    //         // props.setHasSubtasks(props.hasSubtasks);
    //         let subtasks = [];
    //         props.projectTasks.forEach((item) => {
    //             console.log('item ' + JSON.stringify(item));
    //             subtasks.push(item);
    //             // subtasks.push(item.data.task);
    //         })
    //         props.setProjectTasks(subtasks);
    //     }
    // }, [props.open])

    const calculateDates = (newProjectTaskList) => {
        console.log('CALCULASTE DATSS');
        let numTasks = newProjectTaskList.length;
        let startDateObj = new Date(props.startDate);
        let dueDateObj = new Date(props.dueDate);
        console.log('start and end dates str ' + props.startDate + ' ' + props.dueDate);
        console.log('start and end dates ' + startDateObj + ' ' + dueDateObj);
        let dateDiff = Math.round((dueDateObj - startDateObj)/(1000*60*60*24)) + 1;
        console.log('the date difference ' + dateDiff);
        let daysBetweenTasks = dateDiff / numTasks;
        console.log('days between tasks ' + daysBetweenTasks);
        // console.log('testing getDate() ' + startDateObj.getDate());

        let daysToAdd = daysBetweenTasks;
        for (let i = 0; i < numTasks; i++) {
            let newDate = new Date(props.startDate);
            newDate.setDate(newDate.getUTCDate() + Math.round(daysToAdd) - 1);
            let newDateStr = newDate.getFullYear() + '-' +('0'+(newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (newDate.getDate())).slice(-2);
            console.log('new date ' + newDate + ' ' + newDateStr);
            newProjectTaskList[i].data.dueDate = newDateStr;
            daysToAdd += daysBetweenTasks;
        }
        console.log('newProjectTaskList ' + JSON.stringify(newProjectTaskList));
        return newProjectTaskList;
    }

    const handleAddProjectTask = () => {
        // subtasks.push(newProjectTask);
        if (newProjectTask == '') {
            return;
        }

        let newProjectTaskList = [...props.projectTasks];
        newProjectTaskList.push({data: {"task": newProjectTask}, key: 0});
        setNewProjectTask('');
        // setNewProjectTaskDays('');
        console.log('new projectTask list ' + JSON.stringify(newProjectTaskList));
        
        if (props.dueDate != '' && props.startDate != '') {
            newProjectTaskList = calculateDates(newProjectTaskList);
        }
        console.log('newProject list ' + JSON.stringify(newProjectTaskList));
        props.setProjectTasks(newProjectTaskList);
        // setLocalSubtasks(newProjectTaskList);
        // setSubtasks([...subtasks, newProjectTask]);
        // setNewProjectTask('');
    }

    const handleDeleteTodo = (project, index) => {
        console.log('project ' + JSON.stringify(project));
        let id = project.key;
        console.log('ididi ' + id);
        const db = firebase.firestore();

        const deleteTodo = async(id) => {
            console.log("id " + id);
            db.collection('projects').doc(id).delete();
            const projectsTagsResponse = db.collection('projectsTags').where('projectId', '==', id);
            const projectsTagsData = await projectsTagsResponse.get();
            projectsTagsData.docs.forEach((item) => {
                item.ref.delete();
            })
            // props.handleRemoveDisplayTask(project, id);
        } 

        // if (isParentTodo && project[0].data.hasSubtasks == true) {
        //     console.log(props.projects[index][1]);
        //     props.projects[index][1].forEach((item) => {
        //         const subId = item.key;
        //         deleteTodo(subId);
        //     })

        // }

        if (id != 0) {
            deleteTodo(id);
        } else if (id == 0) {
            console.log('subtask at index ' + JSON.stringify(props.projectTasks) + ' ' + index);
            props.projectTasks[index].key = null;
        }
        

        let newProjectTasks = []
        for (var i = 0; i < props.projectTasks.length; i++) {
            if (props.projectTasks[i].key == id && id != 0) {
                continue;
                // projects.splice(i, 1);
            } else if (props.projectTasks[i].key == null) {
                continue;
            } else {
                newProjectTasks.push(props.projectTasks[i]);
            }
        }
        props.setProjectTasks(newProjectTasks);

    }

    return (
        <Box>
            <Typography>Add a start and end date to auto generate task due dates</Typography>
            <List>
                {/* {console.log('mapping project tasks ' + props.projectTasks)} */}
                {props.projectTasks.map((todo, index) => (
                    // console.log('project ' + JSON.stringify(todo)),
                    <ListItem key={'projectTask_' + index}>
                        <ListItemText primary={todo.data.task} />
                        <input type='date' defaultValue={todo.data.dueDate} />
                        <IconButton onClick={() => handleDeleteTodo(todo, index)}><CloseIcon /></IconButton>
                    </ListItem>
                ))}
                <TextField id='newProjectTask' label='Add Project Task' value={newProjectTask} onChange={(e) => setNewProjectTask(e.target.value)} />
                {/* <Typography>Due date</Typography>
                <input type='date' /> */}
                <IconButton onClick={handleAddProjectTask}><AddIcon /></IconButton>

            </List>
        </Box>
    )


    
}

export default ProjectTasks;