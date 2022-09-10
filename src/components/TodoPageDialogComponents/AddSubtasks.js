import { Button, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import firebase from '../../firebase';
import CloseIcon from '@mui/icons-material/Close';

const AddSubtasks = (props) => {
    // const [localSubtasks, setLocalSubtasks] = useState([])
    const [newSubtask, setNewSubtask] = useState('');
    // const [hasSubtasks, setHasSubtasks] = useState(props.hasSubtasks);

    useEffect(() => {
        console.log('hasSubs ' + props.hasSubtasks);
    })

    useEffect(() => {
        if (props.hasSubtasks) {
            console.log('hassubtasksks ' + props.hasSubtasks);
            // props.setHasSubtasks(props.hasSubtasks);
            let subtasks = [];
            props.subtasks.forEach((item) => {
                console.log('item ' + JSON.stringify(item));
                subtasks.push(item);
                // subtasks.push(item.data.task);
            })
            props.setSubtasks(subtasks);
        }
    }, [props.open])

    const handleAddSubtask = () => {
        // subtasks.push(newSubtask);
        if (newSubtask == '') {
            return;
        }
        let newSubtaskList = [...props.subtasks];
        newSubtaskList.push({data: {"task": newSubtask}, key: 0});
        setNewSubtask('');
        console.log('new subtask list ' + newSubtaskList);
        props.setSubtasks(newSubtaskList);
        // setLocalSubtasks(newSubtaskList);
        // setSubtasks([...subtasks, newSubtask]);
        // setNewSubtask('');
    }

    const handleDeleteTodo = (todo, index) => {
        console.log('todo ' + JSON.stringify(todo));
        let id = todo.key;
        console.log('ididi ' + id);
        const db = firebase.firestore();

        const deleteTodo = async(id) => {
            console.log("id " + id);
            db.collection('todos').doc(id).delete();
            const todosTagsResponse = db.collection('todosTags').where('todoId', '==', id);
            const todosTagsData = await todosTagsResponse.get();
            todosTagsData.docs.forEach((item) => {
                item.ref.delete();
            })
            props.handleRemoveDisplayTask(todo, id);
        } 

        // if (isParentTodo && todo[0].data.hasSubtasks == true) {
        //     console.log(props.todos[index][1]);
        //     props.todos[index][1].forEach((item) => {
        //         const subId = item.key;
        //         deleteTodo(subId);
        //     })

        // }

        if (id != 0) {
            deleteTodo(id);
        } else if (id == 0) {
            console.log('subtask at index ' + JSON.stringify(props.subtasks) + ' ' + index);
            props.subtasks[index].key = null;
        }
        

        let newSubtasks = []
        for (var i = 0; i < props.subtasks.length; i++) {
            if (props.subtasks[i].key == id && id != 0) {
                continue;
                // todos.splice(i, 1);
            } else if (props.subtasks[i].key == null) {
                continue;
            } else {
                newSubtasks.push(props.subtasks[i]);
            }
        }
        props.setSubtasks(newSubtasks);

    }

    if (!props.hasSubtasks) {
        // props.setHasSubtasks(false);
        return (
            <Button startIcon={<AddIcon />} onClick={() => props.setHasSubtasks(true)}>Add Subtasks</Button>
        )
    } else {
        console.log('trying to render subtasks');
        // props.setHasSubtasks(true);
        return (
            <Box>
                <List>
                    {console.log('mapping subtasks ' + props.subtasks)}
                    {props.subtasks.map((todo, index) => (
                        console.log('todo ' + JSON.stringify(todo)),
                        <ListItem key={'subtask_' + index}>
                            <ListItemText primary={todo.data.task} />
                            <IconButton onClick={() => handleDeleteTodo(todo, index)}><CloseIcon /></IconButton>
                        </ListItem>
                    ))}
                    <TextField id='newSubtask' label='Add Subtask' value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} />
                    <IconButton onClick={handleAddSubtask}><AddIcon /></IconButton>
                </List>
            </Box>
        )
    }

    
}

export default AddSubtasks;