import { Checkbox, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import NewQuickTask from './NewQuickTask';
import DisplayTodos from './DisplayTodos';
import { sortTodos } from './SortItems';

const Inbox = (props) => {
    const [inboxTodos, setInboxTodos] = useState([]);

    const fetchTodos = async() => {
        // setTodos([]);
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const todosResponse = db.collection('todos').where('uid', '==', uid);
        const todosData = await todosResponse.get();
        
        // console.log('todosdataa ' + todosData.doc.data());
        // const todosTagsResponse = db.collection('todosTags').where('todoId', 'in', todosData.data());
        // const todosTagsData = await todosTagsResponse.get();
        let todoItems = [];
        let todoItemIds = []
        
        // console.log('todostags')
        // console.log(todosTagsData);
        todosData.docs.forEach(item => {
            // if (todosTagsData.data().includes(item.id)) {
            // console.log('todoid ' + item.id);
            todoItems.push({data: item.data(), key: item.id});
            todoItemIds.push(item.id);
            // }
            // console.log(item.id);
            // setTodos([...todos, item.data()])
        })

        const todosTagsResponse = db.collection('todosTags').where('uid', '==', uid);
        const todosTagsData = await todosTagsResponse.get();
        let todosTagsIds = []
        todosTagsData.docs.forEach(item => {
            // console.log('bottom ' + JSON.stringify(item.data()) + item.data().todoId);
            todosTagsIds.push(item.data().todoId);
        })
        // console.log('todoItemsBefore ' + todoItems.length);
        todoItems.forEach((item, index, arr) => {
            // console.log('inside last foreach');
            // console.log(todosTagsIds);
            // console.log(item);
            if (todosTagsIds.includes(item.key)) {
                // console.log('splice');
                arr.splice(index, 1);
            }
        })
        // console.log('todoItemsAfter ' + todoItems.length);
        console.log('before sort ' + JSON.stringify(todoItems));
        todoItems = sortTodos(todoItems);
        console.log('after sort ' + JSON.stringify(todoItems));

        props.setTodos(todoItems);
        setInboxTodos(todoItems);
        console.log(todoItems);
    }

    useEffect(() => {
        fetchTodos();
        // console.log('props todos ' + props.todos);
    }, [props.todoVersion])

    // const handleChecked = async(index, checked) => {
    //     // console.log(props.todos);
    //     let todo = inboxTodos[index];
    //     let db = firebase.firestore();
    //     await db.collection('todos').doc(todo.key).update({completed: checked});
    //     let newTodos = [...inboxTodos];
    //     newTodos[index].data.completed = checked;
    //     props.setTodos(newTodos);
    //     setInboxTodos(newTodos);
    // }

    return(
        <Box>
            <h1>Inbox</h1>
            <DisplayTodos 
                todos={inboxTodos} 
                setTodos={setInboxTodos} 
                setPropsTodos={props.setTodos} 
                handleDisplayNewTask={props.handleDisplayNewTask} 
                handleRemoveDisplayTask={props.handleRemoveDisplayTask} 
            />
            {/* <List>
                {inboxTodos.map((todo, index) => (
                    <ListItem key={'todo_' + index}> */}
                        
                        {/* {console.log(todo.data)} */}
                        {/* <Checkbox checked={todo.data.completed} onChange={(e) => handleChecked(index, e.target.checked)} /> 
                        <ListItemText primary={todo.data.task} secondary={todo.data.description} /> */}
                        {/* <Typography>{todo.data.task}</Typography> */}
                    {/* </ListItem>
                ))}
            </List>
            <NewQuickTask addTask={props.handleDisplayNewTask} /> */}
        </Box>
    )
}

export default Inbox;