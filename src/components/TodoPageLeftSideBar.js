import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from '../firebase';

const LeftSideBar = () => {
    const [tags, setTags] = useState([]);
    const [tagsOpen, setTagsOpen] = useState(false);

    const navigate = useNavigate();
    
    const handleTagsClick = () => {
        setTagsOpen(!tagsOpen);
    }

    const fetchTags = async() => {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const tagsResponse = db.collection('tags').where('uid', '==', uid);
        const tagsData = await tagsResponse.get();

        let tagItems = [];
        tagsData.docs.forEach((item) => {
            tagItems.push({data: item.data(), key: item.id});
        })

        setTags(tagItems);
    }

    useEffect(() => {
        fetchTags();
    }, [])



    return (
        <List>
            <ListItemButton onClick={() => navigate('/todos/today')}>
                <ListItemText primary='Today' />
            </ListItemButton>
            {/* <ListItemButton>
                <ListItemText primary='All Tasks' />
            </ListItemButton> */}
            <ListItemButton onClick={() => navigate('/todos/inbox')}>
                <ListItemText primary='Inbox' />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/todos/allEvents')}>
                <ListItemText primary='All Events' />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/todos/allProjects')}>
                <ListItemText primary='All Projects' />
            </ListItemButton>
            <br />
            <ListItemButton onClick={handleTagsClick}>
                <ListItemText primary='Tags' />
                {tagsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={tagsOpen}>
                <List>
                    {tags.map((tag, index) => (
                        // console.log('map tag ' + tag + ' ' + JSON.stringify(tag)),
                        <ListItemButton key={'tag_' + index} onClick={() => navigate('/todos/' + tag.data.tag)}>
                            <ListItemText primary={tag.data.tag} />
                        </ListItemButton>
                    ))}
                    {/* <ListItemButton>
                        <ListItemText primary='tag 1' />
                    </ListItemButton> */}
                </List>
            </Collapse>
        </List>
    )
}

export default LeftSideBar;