import React from 'react';

const IMCOMPLETE_ITEMS_POS = 0;
const COMPLETE_ITEMS_POS = 1;

export const sortTodos = (todoItems) => {

    let sortedTodos = [[], []];

    const getSubtasks = (id) => {
        let subTodos = [];
        for (let i = 0; i < todoItems.length; i++) {
            if (todoItems[i].data.parentTaskId == id) {
                subTodos.push(todoItems[i]);
                // sortedTodos[sortedTodos.length - 1].push(todoItems[i]);
            }
        }
        return subTodos;
    }

    // let n = 0;
    for (let i = 0; i < todoItems.length; i++) {
        if ('parentTaskId' in todoItems[i].data && todoItems[i].data.parentTaskId != '') {
            continue;
        }
        // sortedTodos.push([todoItems[i]]);
        // n++;
        // if (todoItems[i].data.hasSubtasks) {
        let subtasks = getSubtasks(todoItems[i].key);
        // }
        if (todoItems[i].data.completed == true) {
            sortedTodos[COMPLETE_ITEMS_POS].push([todoItems[i], subtasks]);
        } else if (todoItems[i].data.completed == false) {
            sortedTodos[IMCOMPLETE_ITEMS_POS].push([todoItems[i], subtasks]);
        }
        
    }
    console.log('in func ' + JSON.stringify(sortedTodos))
    return sortedTodos;
    
}

export const sortEvents = (eventItems, eventTodos) => {
    let sortedEvents = [];

    const getEventTasks = (eventId) => {
        let eventTasks = [];
        for (let i = 0; i < eventTodos.length; i++) {
            if (eventTodos[i].data.eventId == eventId) {
                eventTasks.push(eventTodos[i]);
            }
        }
        return eventTasks;
    }

    for (let i = 0; i < eventItems.length; i++) {
        let eventTasks = getEventTasks(eventItems[i].key);
        sortedEvents.push([eventItems[i], eventTasks]);
    }

    return sortedEvents;

}

export const sortProjects = (projectItems, projectTodos) => {
    let sortedProjects = [];
    console.log('projectItems ' + JSON.stringify(projectItems));
    console.log('projectTodos ' + JSON.stringify(projectTodos));

    const getProjectTasks = (projectId) => {
        let projectTasks = [];
        for (let i = 0; i < projectTodos.length; i++) {
            if (projectTodos[i].data.projectId == projectId) {
                projectTasks.push(projectTodos[i]);
            }
        }
        return projectTasks;
    }

    for (let i = 0; i < projectItems.length; i++) {
        let projectTasks = getProjectTasks(projectItems[i].key);
        sortedProjects.push([projectItems[i], projectTasks]);
    }
    console.log('sorted proejcts ' + JSON.stringify(sortedProjects));
    return sortedProjects;
}

// export {sortTodos, sortEvents};