import { Button, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import NewQuickTask from './NewQuickTask';
import firebase from '../../firebase';
import CloseIcon from '@mui/icons-material/Close';
import { prodErrorMap } from 'firebase/auth';
import EditTaskDialog from '../TodoPageDialogComponents/EditTaskDialog';

const PARENT_POS = 0;
const CHILD_LIST_POS = 1;

const IMCOMPLETE_ITEMS_POS = 0;
const COMPLETE_ITEMS_POS = 1;

const DisplayTodos = (props) => {

    const [isHovering, setIsHovering] = useState(false);
    const [hoverId, setHoverId] = useState(null);
    const [openEditTaskDialog, setOpenEditTaskDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);


    const handleChecked = async(index, checked) => {
        console.log(index + ' ' + JSON.stringify(props.todos[index][0]));
        let todo = props.todos[index][0];
        let db = firebase.firestore();
        await db.collection('todos').doc(todo.key).update({completed: checked});
        let newTodos = [...props.todos];
        newTodos[index][0].data.completed = checked;
        props.setPropsTodos(newTodos);
        props.setTodos(newTodos);
    }

    const handleSubChecked = async(todoIndex, subIndex, checked) => {
        console.log('indexs ' + todoIndex + ' ' + subIndex + ' ' + JSON.stringify(props.todos[todoIndex][1][subIndex]));
        let todo = props.todos[todoIndex][1][subIndex];
        let db = firebase.firestore();
        await db.collection('todos').doc(todo.key).update({completed: checked});
        let newTodos = [...props.todos];
        newTodos[todoIndex][1][subIndex].data.completed = checked;
        props.setPropsTodos(newTodos);
        props.setTodos(newTodos);
    }

    const handleDeleteTodo = (todo, isParentTodo, index) => {
        console.log('todo ' + JSON.stringify(todo));
        let parentId = null;
        if (isParentTodo) {
            parentId = todo[0].key;
        } else {
            parentId = todo.key;
        }
        
        const db = firebase.firestore();

        const deleteTodo = async(id) => {
            db.collection('todos').doc(id).delete();
            const todosTagsResponse = db.collection('todosTags').where('todoId', '==', id);
            const todosTagsData = await todosTagsResponse.get();
            todosTagsData.docs.forEach((item) => {
                item.ref.delete();
            })
            props.handleRemoveDisplayTask(todo, id);
        }

        if (isParentTodo && todo[0].data.hasSubtasks == true) {
            console.log(props.todos[index][1]);
            props.todos[index][1].forEach((item) => {
                const subId = item.key;
                deleteTodo(subId);
            })
            // for (let i = 0; i < props.todos[index][1]; i++) {

            // }
        }

        deleteTodo(parentId);

        

        // for (var i = 0; i < props.todos.length; i++) {
        //     if (props.todos[i] == {data: todo.data, key: todo.key}) {
        //         props.todos.splice(i, 1);
        //     }
        // }
        // props.handleDisplayNewTask(props.todos, id);
    }

    // const handleDeleteSub = async(todo) => {
    //     const id = todo.key;
    //     const db = firebase.firestore();
    //     db.collection('todos').doc(id).delete();
    //     const todosTagsResponse = db.collection('todosTags').where('todoId', '==', id);
    //     const todosTagsData = await todosTagsResponse.get();
    //     todosTagsData.docs.forEach((item) => {
    //         item.ref.delete();
    //     })
    //     props.handleRemoveDisplayTask(todo, id);
    //     // for (var i = 0; i < props.todos.length; i++) {
    //     //     if (props.todos[i] == {data: todo.data, key: todo.key}) {
    //     //         props.todos.splice(i, 1);
    //     //     }
    //     // }
    //     // props.handleDisplayNewTask(props.todos, id);
    // }

    const handleMouseOver = (id) => {
        console.log(id);
        setIsHovering(true);
        setHoverId(id);
    }

    const handleMouseOut = () => {
        setIsHovering(false);
        setHoverId(null);
    }

    const handleEditTask = (todo) => {
        console.log('setting selectedTask ' + todo);
        setSelectedTask(todo);
        setOpenEditTaskDialog(true);
    }

    return (
        <Box>
            <EditTaskDialog 
                open={openEditTaskDialog} 
                setOpen={setOpenEditTaskDialog} 
                handleDisplayNewTask={props.handleDisplayNewTask} 
                handleRemoveDisplayTask={props.handleRemoveDisplayTask}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                // id={hoverIndex > -1 ? props.todos[hoverIndex][0].key : null} 
            />
            <List>
                {console.log('props.todoos ' + JSON.stringify(props.todos))}
                {props.todos.map((todoList, todoListIndex) => {
                    console.log('todoListIndex ' + todoListIndex);
                    if (todoListIndex == 0) {
                        todoList.map((todo, index) => (
                            <>
                                {console.log('mapping ' + JSON.stringify(todo) + ' ' + todo[0].data.task)}
                                <ListItem key={'imcomplete_todo_' + todoListIndex + index} className='taskItem' onMouseOver={() => handleMouseOver(todo[0].key)} onMouseOut={handleMouseOut}>
                                    
                                    {console.log('parent tasksks ' + JSON.stringify(todo))}
                                    <Checkbox checked={todo[0].data.completed} onChange={(e) => handleChecked(index, e.target.checked)} /> 
                                    <ListItemText primary={todo[0].data.task} secondary={todo[0].data.description} />
                                    <IconButton onClick={() => handleDeleteTodo(todo, true, index)}><CloseIcon /></IconButton>
                                    
                                    {isHovering && hoverId == todo[0].key && (
                                        <Button onClick={() => handleEditTask(todo)}>Edit</Button>
                                    )}
                                    
                                </ListItem>
                                <List>
                                    {/* {console.log(todo[1])} */}
                                    {todo[1].map((sub, subIndex) => (
                                        // console.log('displaytoodso supmap ' + JSON.stringify(sub) + ' ' + subIndex + ' ' + sub.data.completed + ' task ' + sub.data.task),
                                        <ListItem key={'sub_' + index + '_' + subIndex}>
                                            <Checkbox checked={sub.data.completed} onChange={(e) => handleSubChecked(index, subIndex, e.target.checked)} /> 
                                            <ListItemText primary={sub.data.task} />
                                            <IconButton onClick={() => handleDeleteTodo(sub, false)}><CloseIcon /></IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        ))
                    }
                })}
            </List>
            <Typography>Tasks Completed Today</Typography>
            <List>
                {/* {props.todos.map((todoList, todoListIndex) => (
                    todoList[1].map((todo, index) => (
                        <ListItemButton key={'complete_todo_' + index} className='taskItem' onMouseOver={() => handleMouseOver(todo[0].key)} onMouseOut={handleMouseOut}>
                            <ListItemText primary={todo[0].data.task} secondary={todo[0].data.description} />
                        </ListItemButton>
                    ))
                ))} */}
            </List>
            <NewQuickTask addTask={props.handleDisplayNewTask} />
        </Box>
    )
}

export default DisplayTodos;