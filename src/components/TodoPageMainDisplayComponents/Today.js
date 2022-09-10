import { Checkbox, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import NewQuickTask from './NewQuickTask';
import DisplayTodos from './DisplayTodos';
import { sortTodos } from './SortItems';

const Today = (props) => {
    const [todayTodos, setTodayTodos] = useState([]);

    const fetchTodos = async() => {

        let date = new Date();
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0');
        let yyyy = date.getFullYear();
        date = yyyy + '-' + mm + '-' + dd;
        console.log(date);
        // setTodos([]);
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const todosResponse = db.collection('todos').where('uid', '==', uid).where('dueDate', '==', date);
        const todosData = await todosResponse.get();
        
        // console.log('todosdataa ' + todosData.doc.data());
        // const todosTagsResponse = db.collection('todosTags').where('todoId', 'in', todosData.data());
        // const todosTagsData = await todosTagsResponse.get();
        let todoItems = [];
        // let todoItemIds = []
        
        // console.log('todostags')
        // console.log(todosTagsData);
        todosData.docs.forEach(item => {
            // if (todosTagsData.data().includes(item.id)) {
            // console.log('todoid ' + item.id);
            todoItems.push({data: item.data(), key: item.id});
            // todoItemIds.push(item.id);
            // }
            // console.log(item.id);
            // setTodos([...todos, item.data()])
        })

        // const todosTagsResponse = db.collection('todosTags').where('todoId', 'in', todoItemIds);
        // const todosTagsData = await todosTagsResponse.get();
        // let todosTagsIds = []
        // todosTagsData.docs.forEach(item => {
        //     // console.log('bottom ' + JSON.stringify(item.data()) + item.data().todoId);
        //     todosTagsIds.push(item.data().todoId);
        // })
        // console.log('todoItemsBefore ' + todoItems.length);
        // todoItems.forEach((item, index, arr) => {
        //     // console.log('inside last foreach');
        //     // console.log(todosTagsIds);
        //     // console.log(item);
        //     if (todosTagsIds.includes(item.key)) {
        //         // console.log('splice');
        //         arr.splice(index, 1);
        //     }
        // })
        // console.log('todoItemsAfter ' + todoItems.length);

        todoItems = sortTodos(todoItems);

        props.setTodos(todoItems);
        setTodayTodos(todoItems);
        console.log(todoItems);
    }

    useEffect(() => {
        fetchTodos();
        // console.log(props.todos);
    }, [props.todoVersion])

    // const handleChecked = async(index, checked) => {
    //     let todo = todayTodos[index];
    //     let db = firebase.firestore();
    //     await db.collection('todos').doc(todo.key).update({completed: checked});
    //     let newTodos = [...todayTodos];
    //     newTodos[index].data.completed = checked;
    //     props.setTodos(newTodos);
    //     setTodayTodos(newTodos);
    // }

    return(
        <Box>
            <h1>Today</h1>
            <DisplayTodos 
                todos={todayTodos} 
                setTodos={setTodayTodos} 
                setPropsTodos={props.setTodos} 
                handleDisplayNewTask={props.handleDisplayNewTask} 
                handleRemoveDisplayTask={props.handleRemoveDisplayTask} 
            />
            {/* <List>
                {todayTodos.map((todo, index) => (
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

export default Today;