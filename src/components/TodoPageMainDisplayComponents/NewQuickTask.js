import { Box, Button, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';

const NewQuickTask = (props) => {
    // const [task, setTask] = useState(null);
    // const [desciption, setDesciption] = useState('');
    const [task, setTask] = useState({todo: '', description: ''});

    const handleNew = () => {
        setTask({todo: '', description: ''})
    }

    const handleAdd = async() => {
        // console.log('add');
        let db = firebase.firestore();
        const id = db.collection('todos').doc().id;
        const uid = firebase.auth().currentUser.uid;
        let newTask = {
            task: task.todo,
            description: task.description,
            carryOverType: 'carry over',
            dueDate: '',
            dueTime: '',
            priority: 'none',
            completed: false,
            uid: uid,
            hasSubtasks: false
        }
        await db.collection('todos').doc(id).set(newTask);
        // await addDoc(db.collection('todos'), {
        //     task: task.todo,
        //     description: task.description
        // })
        setTask({todo: '', description: ''});
        // newTask.id = id;
        if (props.addTask) {
            props.addTask(newTask, id);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setTask((prev) => (
            {...prev, [name]: value}
        ));
        console.log(task.todo);
    }

    // if (task.todo == null) {
    //     return (
    //         <Button onClick={handleNew} >Add New Task</Button>
    //     )
    // }
    return (
        <Box>
            <TextField name='todo' value={task.todo} label='Quick Add Task' onChange={handleChange} />
            {/* <TextField name='description' label='Description' onChange={handleChange} /> */}
            <Button onClick={handleAdd}>Add</Button>
        </Box> 
    )
}

export default NewQuickTask;