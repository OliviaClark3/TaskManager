import { Button, Checkbox, Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import NewQuickTask from './NewQuickTask';
import CloseIcon from '@mui/icons-material/Close';
import { sortEvents } from './SortItems';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import EditEventDialog from '../TodoPageDialogComponents/EditEventDialog';

const AllEvents = (props) => {
    const [events, setEvents] = useState([]);
    // const [eventTodos, setEventTodos] = useState([]);
    const [eventTodosOpen, setEventTodosOpen] = useState([]);
    // const [isHovering, setIsHovering] = useState(false);
    const [hoverId, setHoverId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openEditEventDialog, setOpenEditEventDialog] = useState(false);

    const fetchEvents = async() => {

        // let date = new Date();
        // let dd = String(date.getDate()).padStart(2, '0');
        // let mm = String(date.getMonth() + 1).padStart(2, '0');
        // let yyyy = date.getFullYear();
        // date = yyyy + '-' + mm + '-' + dd;
        // console.log(date);
        // setTodos([]);
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const eventsResponse = db.collection('events').where('uid', '==', uid);
        const eventsData = await eventsResponse.get();
        
        // console.log('todosdataa ' + todosData.doc.data());
        // const todosTagsResponse = db.collection('todosTags').where('todoId', 'in', todosData.data());
        // const todosTagsData = await todosTagsResponse.get();
        let eventItems = [];
        let eventItemIds = [];
        // let todoItemIds = []
        
        // console.log('todostags')
        // console.log(todosTagsData);
        eventsData.docs.forEach(item => {
            // if (todosTagsData.data().includes(item.id)) {
            // console.log('todoid ' + item.id);
            eventItems.push({data: item.data(), key: item.id});
            eventItemIds.push(item.id);
            // todoItemIds.push(item.id);
            // }
            // console.log(item.id);
            // setTodos([...todos, item.data()])
        })

        let eventTodos = [];
        if (eventItemIds.length > 0) {
            console.log('event item ids '+ eventItemIds);
            const eventTodosResponse = db.collection('todos').where('uid', '==', uid).where('eventId', 'in', eventItemIds);
            const eventTodosData = await eventTodosResponse.get();
            // let eventTodos = [];
            eventTodosData.docs.forEach((item) => {
                console.log('found event todo ' + item.data())
                eventTodos.push({data: item.data(), key: item.id});
            })
        }

        eventItems = sortEvents(eventItems, eventTodos);
        console.log('the event items ' + JSON.stringify(eventItems));
        props.setTodos(eventItems);
        setEvents(eventItems);
        console.log(eventItems);

        if (eventTodosOpen.length == 0) {
            for (let i = 0; i < events.length; i++) {
                eventTodosOpen.push(false);
            }
        }
        
    }

    useEffect(() => {
        fetchEvents();
        // console.log(props.todos);
    }, [props.todoVersion])

    // const handleChecked = async(index, checked) => {
    //     let todo = props.todos[index];
    //     let db = firebase.firestore();
    //     await db.collection('todos').doc(todo.key).update({completed: checked});
    //     let newTodos = [...props.todos];
    //     newTodos[index].data.completed = checked;
    //     props.setTodos(newTodos);
    // }

    const handleDeleteEvent = async(event) => {
        console.log('todo ' + JSON.stringify(event));
        let id = event.key;
        
        const db = firebase.firestore();

        const deleteEvent = async(id, collection) => {
            // console.log('delete event ' + id + ' ' + collection);
            db.collection(collection).doc(id).delete();
            console.log('this id ' + id);
            const todosTagsResponse = db.collection('todosTags').where('todoId', '==', id);
            const todosTagsData = await todosTagsResponse.get();
            todosTagsData.docs.forEach((item) => {
                item.ref.delete();
            })
            props.handleRemoveDisplayTask(event, id);
        }

        console.log('that id '+ id);
        const eventTasksResponse = db.collection('todos').where('eventId', '==', id);
        const eventTasksData = await eventTasksResponse.get();
        eventTasksData.docs.forEach((item) => {
            deleteEvent(item.id, 'todos');
        })

        // if (isParentTodo && todo[0].data.hasSubtasks == true) {
        //     console.log(props.todos[index][1]);
        //     props.todos[index][1].forEach((item) => {
        //         const subId = item.key;
        //         deleteEvent(subId);
        //     })
        //     // for (let i = 0; i < props.todos[index][1]; i++) {

        //     // }
        // }

        deleteEvent(id, 'events');

    }

    const handleEventClick = (index) => {
        let openTodos = [...eventTodosOpen];
        openTodos[index] = !openTodos[index];
        console.log('eventTodosOpen b4 ' + eventTodosOpen);
        console.log('openTodos changed ' + openTodos);
        setEventTodosOpen(openTodos);
        console.log('eventTodosOpen after ' + eventTodosOpen);
    }

    // const handleMouseOver = (id) => {
    //     // setIsHovering(true);
    //     setHoverId(id);
    // }

    // const handleMouseOut = () => {
    //     // setIsHovering(false);
    //     setHoverId(null);
    // }

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setOpenEditEventDialog(true);
    }

    return(
        <Box>
            {/* {console.log('EVNTN ' + selectedEvent)} */}
            <EditEventDialog
                open={openEditEventDialog}
                setOpen={setOpenEditEventDialog}
                handleDisplayNewTask={props.handleDisplayNewTask} 
                handleRemoveDisplayTask={props.handleRemoveDisplayTask}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
            />
            <h1>All Events</h1>
            <List>
                {/* {console.log('events ' + JSON.stringify(events))} */}
                {events.map((event, index) => (
                    <>
                        <ListItemButton key={'event_' + index} onClick={() => handleEventClick(index)} onMouseOver={() => setHoverId(event[0].key)} onMouseOut={() => setHoverId(null)}>
                            
                            {/* {console.log('singular event ' + JSON.stringify(event))} */}
                            {/* <Checkbox checked={todo.data.completed} onChange={(e) => handleChecked(index, e.target.checked)} />  */}
                            <ListItemText primary={event[0].data.event} secondary={event[0].data.description} />
                            {hoverId == event[0].key && (
                                <Button onClick={() => handleEditEvent(event)}>Edit</Button>
                            )}
                            <IconButton onClick={() => handleDeleteEvent(event[0])}><CloseIcon /></IconButton>
                            {eventTodosOpen[index] ? <ExpandLess /> : <ExpandMore />}
                            {/* <Typography>{todo.data.task}</Typography> */}
                        </ListItemButton>
                        <Collapse in={eventTodosOpen[index]}>
                            <List>
                                {event[1].map((todo, todoIndex) => (
                                    <ListItem>
                                        {/* {console.log('event and todos ' + JSON.stringify(event[1]) + ' + ' + JSON.stringify(todo.data.task))} */}
                                        <ListItemText primary={todo.data.task} secondary={todo.data.daysBeforeEvent + ' days before event'} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </>
                ))}
            </List>
            {/* <NewQuickTask addTask={props.handleDisplayNewTask} /> */}
        </Box>
    )
}

export default AllEvents;