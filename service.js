const listsUrl = 'http://localhost:3000/lists';
const tasksUrl = 'http://localhost:3000/tasks';

// Getting lists
function uploadLists() {
    return new Promise((resolve, reject) => {
        fetch(listsUrl)
            .then(resp => resp.json())
            .then(lists => resolve(lists))
            .catch((err) => console.error(err));
    });
}

// Adding tasks to appropriate list
function addNewTask(listId, taskName) {
    return new Promise((resolve, reject) => {
        fetch(tasksUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                listId: parseInt(listId),
                name: taskName,
                checked: false
            })
        })
            .then(resp => resp.json())
            .then(newTask => resolve(newTask))
            .catch(e => e);
    })
}

// Deleting task
function deleteTask(deleteTaskElemId) {
    fetch(tasksUrl + `/${deleteTaskElemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTaskElemId })
    })
        .then(res => res.json())
        .catch(e => console.log(e));
}

// Editing task 
function editTask(editTaskElemId, taskElemText) {
    fetch(tasksUrl + `/${editTaskElemId}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: taskElemText.textContent
        })
    })
        .then(res => res.json())
        .catch(err => console.error(err));
}

// Checking-unchecking task
function checkTask(taskItemId, isTaskChecked) {
    fetch(tasksUrl + `/${taskItemId}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            checked: isTaskChecked
        })
    })
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.error(err));
}

// Adding new list
function addNewList(addListField) {
    return new Promise((resolve, reject) => {
        fetch(listsUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: addListField.value
            })
        })
            .then(resp => resp.json())
            .then(newList => resolve(newList))
            .catch(e => e);
    })
}

// Select list
function selectList() {
    return new Promise((resolve, reject) => {
        fetch(tasksUrl)
            .then(resp => resp.json())
            .then(tasks => resolve(tasks))
            .catch(err => err);
    })
}

// Delete list
function deleteList(deletedListId) {
    return new Promise((resolve, reject) => {
        fetch(listsUrl + `/${deletedListId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deletedListId })
        })
            .then(res => res.json())
            .then(res => resolve())
            .catch(e => console.log(e));
    })
}