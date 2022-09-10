import { Button, Checkbox, Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import NewQuickTask from './NewQuickTask';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { sortProjects } from './SortItems';
import CloseIcon from '@mui/icons-material/Close';
import EditProjectDialog from '../TodoPageDialogComponents/EditProjectDialog';

const PARENT_POS = 0;
const CHILD_LIST_POS = 1;

const AllProjects = (props) => {
    const [projects, setProjects] = useState([]);
    const [projectTodosOpen, setProjectTodosOpen] = useState([]);
    const [hoverId, setHoverId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [openEditProjectDialog, setOpenEditProjectDialog] = useState(false);

    const fetchProjects = async() => {

        // let date = new Date();
        // let dd = String(date.getDate()).padStart(2, '0');
        // let mm = String(date.getMonth() + 1).padStart(2, '0');
        // let yyyy = date.getFullYear();
        // date = yyyy + '-' + mm + '-' + dd;
        // console.log(date);
        // setTodos([]);
        const db = firebase.firestore()
        const uid = firebase.auth().currentUser.uid;
        const projectsResponse = db.collection('projects').where('uid', '==', uid);
        const projectsData = await projectsResponse.get();
        
        // console.log('todosdataa ' + todosData.doc.data());
        // const todosTagsResponse = db.collection('todosTags').where('todoId', 'in', todosData.data());
        // const todosTagsData = await todosTagsResponse.get();
        let projectItems = [];
        let projectItemIds = []
        
        // console.log('todostags')
        // console.log(todosTagsData);
        projectsData.docs.forEach(item => {
            // if (todosTagsData.data().includes(item.id)) {
            // console.log('todoid ' + item.id);
            projectItems.push({data: item.data(), key: item.id});
            projectItemIds.push(item.id);
            // }
            // console.log(item.id);
            // setTodos([...todos, item.data()])
        })

        let projectTodos = [];
        if (projectItemIds.length > 0) {
            const projectTodosResponse = db.collection('todos').where('uid', '==', uid).where('projectId', 'in', projectItemIds);
            const projectTodosData = await projectTodosResponse.get();

            projectTodosData.docs.forEach((item) => {
                projectTodos.push({data: item.data(), key: item.id});
            })
        }

        projectItems = sortProjects(projectItems, projectTodos);

        props.setTodos(projectItems);
        setProjects(projectItems);
        console.log('proj items!! ' + JSON.stringify(projectItems));

        if (projectTodosOpen.length == 0) {
            for (let i = 0; i < projects.length; i++) {
                projectTodosOpen.push(false);
            }
        }
    }

    useEffect(() => {
        fetchProjects();
        // console.log(props.todos);
    }, [props.todoVersion])

    const handleChecked = async(index, checked) => {
        let todo = projects[index];
        let db = firebase.firestore();
        await db.collection('projects').doc(todo.key).update({completed: checked});
        let newTodos = [...projects];
        newTodos[index].data.completed = checked;
        props.setTodos(newTodos);
        setProjects(newTodos);
    }

    const handleProjectClick = (index) => {
        let openTodos = [...projectTodosOpen];
        openTodos[index] = !openTodos[index];
        setProjectTodosOpen(openTodos);
    }

    const handleDeleteProject = async(project) => {
        console.log('todo ' + JSON.stringify(project));
        let id = project.key;
        
        const db = firebase.firestore();

        const deleteProject = async(id, collection) => {
            db.collection(collection).doc(id).delete();
            console.log('this id ' + id);
            const todosTagsResponse = db.collection('todosTags').where('todoId', '==', id);
            const todosTagsData = await todosTagsResponse.get();
            todosTagsData.docs.forEach((item) => {
                item.ref.delete();
            })
            props.handleRemoveDisplayTask(project, id);
        }

        console.log('that id '+ id);
        const projectTasksResponse = db.collection('todos').where('projectId', '==', id);
        const projectTasksData = await projectTasksResponse.get();
        projectTasksData.docs.forEach((item) => {
            deleteProject(item.id, 'todos');
        })

        deleteProject(id, 'projects');

    }

    const handleEditProject = (project) => {
        console.log('handleEditProjhect')
        console.log(JSON.stringify(project));
        setSelectedProject(project);
        setOpenEditProjectDialog(true);
    }

    return(
        <Box>
            <EditProjectDialog
                open={openEditProjectDialog}
                setOpen={setOpenEditProjectDialog}
                handleDisplayNewTask={props.handleDisplayNewTask} 
                handleRemoveDisplayTask={props.handleRemoveDisplayTask}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
            />
            <h1>All Projects</h1>
            <List>
                {projects.map((project, index) => (
                    <>
                        <ListItemButton key={'project_' + index} onClick={() => handleProjectClick(index)} onMouseOver={() => setHoverId(project[0].key)} onMouseOut={() => setHoverId(null)}>
                            
                            {/* {console.log('proj data ' + project.data)} */}
                            <Checkbox checked={project[PARENT_POS].data.completed} onChange={(e) => handleChecked(index, e.target.checked)} /> 
                            <ListItemText primary={project[PARENT_POS].data.project} secondary={project[PARENT_POS].data.description} />
                            {/* <Typography>{todo.data.task}</Typography> */}
                            {hoverId == project[0].key && (
                                <Button onClick={() => handleEditProject(project)}>Edit</Button>
                            )}
                            <IconButton onClick={() => handleDeleteProject(project[PARENT_POS])}><CloseIcon /></IconButton>
                            {projectTodosOpen[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={projectTodosOpen[index]}>
                            <List>
                                {/* {console.log('lengtht ' + project[CHILD_LIST_POS].length)} */}
                                {project[CHILD_LIST_POS].length == 0 ?
                                    <Button>Add Task to Project</Button> : 
                                    project[CHILD_LIST_POS].map((todo, todoIndex) => (
                                        <ListItem>
                                            <ListItemText primary={todo.data.task} secondary={todo.data.dueDate} />
                                        </ListItem>
                                    ))    
                                }
                            </List>
                        </Collapse>
                    </>
                ))}
            </List>
            {/* <NewQuickTask addTask={props.handleDisplayNewTask} /> */}
        </Box>
    )
}

export default AllProjects;