import { Button, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import firebase from '../../firebase';
import CloseIcon from '@mui/icons-material/Close';

const EventTasks = (props) => {

    const [newEventTask, setNewEventTask] = useState('');
    const [newEventTaskDays, setNewEventTaskDays] = useState('');

    // useEffect(() => {
    //     if (props.hasSubtasks) {
    //         console.log('hassubtasksks ' + props.hasSubtasks);
    //         // props.setHasSubtasks(props.hasSubtasks);
    //         let subtasks = [];
    //         props.eventTasks.forEach((item) => {
    //             console.log('item ' + JSON.stringify(item));
    //             subtasks.push(item);
    //             // subtasks.push(item.data.task);
    //         })
    //         props.setEventTasks(subtasks);
    //     }
    // }, [props.open])

    const handleAddEventTask = () => {
        // subtasks.push(newEventTask);
        if (newEventTask == '') {
            return;
        }
        let newEventTaskList = [...props.eventTasks];
        newEventTaskList.push({data: {"task": newEventTask, 'daysBeforeEvent': newEventTaskDays}, key: 0});
        setNewEventTask('');
        setNewEventTaskDays('');
        console.log('new eventTask list ' + newEventTaskList);
        props.setEventTasks(newEventTaskList);
        // setLocalSubtasks(newEventTaskList);
        // setSubtasks([...subtasks, newEventTask]);
        // setNewEventTask('');
    }

    const handleDeleteTodo = (event, index) => {
        console.log('event ' + JSON.stringify(event));
        let id = event.key;
        console.log('ididi ' + id);
        const db = firebase.firestore();

        const deleteTodo = async(id) => {
            console.log("id " + id);
            db.collection('events').doc(id).delete();
            const eventsTagsResponse = db.collection('eventsTags').where('eventId', '==', id);
            const eventsTagsData = await eventsTagsResponse.get();
            eventsTagsData.docs.forEach((item) => {
                item.ref.delete();
            })
            // props.handleRemoveDisplayTask(event, id);
        } 

        // if (isParentTodo && event[0].data.hasSubtasks == true) {
        //     console.log(props.events[index][1]);
        //     props.events[index][1].forEach((item) => {
        //         const subId = item.key;
        //         deleteTodo(subId);
        //     })

        // }

        if (id != 0) {
            deleteTodo(id);
        } else if (id == 0) {
            console.log('subtask at index ' + JSON.stringify(props.eventTasks) + ' ' + index);
            props.eventTasks[index].key = null;
        }
        

        let newEventTasks = []
        for (var i = 0; i < props.eventTasks.length; i++) {
            if (props.eventTasks[i].key == id && id != 0) {
                continue;
                // events.splice(i, 1);
            } else if (props.eventTasks[i].key == null) {
                continue;
            } else {
                newEventTasks.push(props.eventTasks[i]);
            }
        }
        props.setEventTasks(newEventTasks);

    }

    return (
        <Box>
            <List>
                {console.log('mapping event tasks ' + props.eventTasks)}
                {props.eventTasks.map((todo, index) => (
                    console.log('event ' + JSON.stringify(todo)),
                    <ListItem key={'eventTask_' + index}>
                        <ListItemText primary={todo.data.task} secondary={todo.data.daysBeforeEvent + ' days before event'} />
                        <IconButton onClick={() => handleDeleteTodo(todo, index)}><CloseIcon /></IconButton>
                    </ListItem>
                ))}
                <TextField id='newEventTask' label='Add Event Task' value={newEventTask} onChange={(e) => setNewEventTask(e.target.value)} />
                <TextField id='daysBeforeEventDue' label='Days' type='number' value={newEventTaskDays} onChange={(e) => setNewEventTaskDays(e.target.value)} />
                <IconButton onClick={handleAddEventTask}><AddIcon /></IconButton>

            </List>
        </Box>
    )


    
}

export default EventTasks;