import { Checkbox, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import NewQuickTask from './NewQuickTask';
import DisplayTodos from './DisplayTodos';
import { sortTodos } from './SortItems';

const Tag = (props) => {
    const [tagTodos, setTagTodos] = useState([]);

    const fetchTodos = async() => {

        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        console.log('first query ' + uid + ' ' + props.tag);
        const todosTagsResponse = db.collection('todosTags').where('uid', '==', uid).where('tag', '==', props.tag);
        const todosTagsData = await todosTagsResponse.get();
        let todoIds = [];
        todosTagsData.docs.forEach((item) => {
            // console.log('in foreac ' + item.todoId);
            todoIds.push(item.data().todoId);
        })
        console.log('second query ' + todoIds);
        const todosResponse = db.collection('todos').where('uid', '==', uid).where(firebase.firestore.FieldPath.documentId(), 'in', todoIds);
        const todosData = await todosResponse.get();
        let todoItems = [];
        todosData.docs.forEach((item) => {
            todoItems.push({data: item.data(), key: item.id});
        })
        console.log('todoItems ' + todoItems);

        todoItems = sortTodos(todoItems);

        props.setTodos(todoItems);
        setTagTodos(todoItems);

        // setTodos([]);
        // const db = firebase.firestore()
        // const uid = firebase.auth().currentUser.uid;
        // const todosResponse = db.collection('todos').where('uid', '==', uid);
        // const todosData = await todosResponse.get();
        
        // // console.log('todosdataa ' + todosData.doc.data());
        // // const todosTagsResponse = db.collection('todosTags').where('todoId', 'in', todosData.data());
        // // const todosTagsData = await todosTagsResponse.get();
        // let todoItems = [];
        // let todoItemIds = []
        
        // // console.log('todostags')
        // // console.log(todosTagsData);
        // todosData.docs.forEach(item => {
        //     // if (todosTagsData.data().includes(item.id)) {
        //     // console.log('todoid ' + item.id);
        //     todoItems.push({data: item.data(), key: item.id});
        //     todoItemIds.push(item.id);
        //     // }
        //     // console.log(item.id);
        //     // setTodos([...todos, item.data()])
        // })

        // const tagsResponse = db.collection('tags').where('uid', '==', uid);
        // const tagsData = await tagsResponse.get();
        // // let tagItems = [];
        // let selectedTagId = '';
        // tagsData.docs.forEach((item) => {
        //     // tagItems.push({data: item.data(), key: item.id});
        //     if (item.data().tag == props.tag) {
        //         selectedTagId = item.id;
        //     }
        // })
        // console.log('seelcedTagId ' + selectedTagId);

        // console.log('todoItemIds ' + todoItemIds);
        // const todosTagsResponse = db.collection('todosTags').where('todoId', 'in', todoItemIds).where('tagId', '==', 'selectedTagId');
        // const todosTagsData = await todosTagsResponse.get();
        // let todoIds = [];
        // todosTagsData.docs.forEach(item => {
        //     console.log('bottom ' + JSON.stringify(item.data()) + item.data().tagId);
        //     if (item.data().tagId == selectedTagId) {
        //         console.log('push');
        //         todoIds.push(item.data().todoId);
        //     }
            
        // })
        // console.log('todoIds' + todoIds);
        // todoItems.forEach((item, index, arr) => {
        //     // console.log('inside last foreach');
        //     // console.log(todoIds);
        //     // console.log(item);
        //     if (!todoIds.includes(item.key)) {
        //         // console.log('splice');
        //         arr.splice(index, 1);
        //     }
        // })
        // // console.log('todoItemsAfter ' + todoItems.length);

        // props.setTodos(todoItems);
        // setTagTodos(todoItems);
        // console.log(todoItems);
    }

    useEffect(() => {
        fetchTodos();
        // console.log(props.todos);
    }, [props.todoVersion])

    // const handleChecked = async(index, checked) => {
    //     // console.log(props.todos);
    //     let todo = tagTodos[index];
    //     let db = firebase.firestore();
    //     await db.collection('todos').doc(todo.key).update({completed: checked});
    //     let newTodos = [...tagTodos];
    //     newTodos[index].data.completed = checked;
    //     props.setTodos(newTodos);
    //     setTagTodos(newTodos);
    // }

    return(
        <Box>
            <h1>{props.tag}</h1>
            <DisplayTodos 
                todos={tagTodos} 
                setTodos={setTagTodos} 
                setPropsTodos={props.setTodos} 
                handleDisplayNewTask={props.handleDisplayNewTask} 
                handleRemoveDisplayTask={props.handleRemoveDisplayTask} 
            />
            {/* <List>
                {tagTodos.map((todo, index) => (
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

export default Tag;