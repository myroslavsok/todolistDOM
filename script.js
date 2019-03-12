let toDoListTasks = document.getElementById('toDoListTasks');

// Add new task
function renderListItem(taskName, taskId) {
    //check
    if (!addTaskField.value && taskName == undefined) return alert('Field is empty');

    let itemTaskDiv = document.createElement('div');
    itemTaskDiv.classList.add('task__item');
    itemTaskDiv.setAttribute('taskid', taskId);

    let itemTaskLabel = document.createElement('label');
    let itemTaskInput = document.createElement('input');
    itemTaskInput.setAttribute('type', 'checkbox');
    let itemTaskText = document.createElement('p');

    itemTaskText.textContent = (taskName == undefined) ? addTaskField.value : taskName;
    itemTaskLabel.append(itemTaskInput);
    itemTaskLabel.append(itemTaskText);
    itemTaskDiv.append(itemTaskLabel);

    let itemControlPanel = document.createElement('div');
    itemControlPanel.classList.add('item__control__panel');
    let itemEditBtn = document.createElement('button');
    itemEditBtn.classList.add('edit_task__item');
    itemEditBtn.textContent = 'Edit';
    let itemRemoveBtn = document.createElement('button');
    itemRemoveBtn.classList.add('remove_task__item');
    itemRemoveBtn.textContent = 'Remove';
    itemControlPanel.append(itemEditBtn);
    itemControlPanel.append(itemRemoveBtn);
    itemTaskDiv.append(itemControlPanel);

    toDoListTasks.prepend(itemTaskDiv);

    addTaskField.value = '';
}

let addTaskField = document.getElementById('addTaskField');
let formAddListItem = document.getElementById('formAddListItem');
formAddListItem.addEventListener('submit', e => {
    e.preventDefault();
    let inputs = tasksList.getElementsByTagName('input');
    let listId;
    for (let input of inputs)
        if (input.checked)
            listId = input.parentNode.getAttribute('listid');
    let taskName = addTaskField.value;
    fetch(tasksUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            task_list_id: listId,
            task_name: taskName,
            task_checked: false
        })
    })
        .then(resp => resp.json())
        .then(newTask => renderListItem(newTask.name, newTask.id))
        .catch(e => e);
});

// Checking-unchecking, deleting, edit task (useing delegation)
toDoListTasks.addEventListener('mousedown', (event) => {
    let target = event.target;
    // Deleting
    if (target.closest('button.remove_task__item')) {
        let taskElem = target.closest('button.remove_task__item').parentNode.parentNode;
        let deleteTaskElemId = taskElem.getAttribute('taskid');
        fetch(tasksUrl + `/${deleteTaskElemId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deleteTaskElemId })
        })
            .then(res => res.json())
            .catch(e => console.log(e));
        taskElem.remove();
    }
    // Editing name
    if (target.closest('button.edit_task__item')) {
        let taskElem = target.closest('button.edit_task__item').parentNode.parentNode;
        let taskElemText = taskElem.firstChild.lastChild;
        
        // Rendering new text (Editing)
        let defaultText = taskElemText.textContent;
        taskElemText.textContent = prompt('Rename task', taskElemText.textContent);
        if (!taskElemText.textContent)
            taskElemText.taskElemText = defaultText;
        
        // HTTP Edit reques
        let editTaskElemId = taskElem.getAttribute('taskid');
        fetch(tasksUrl + `/${editTaskElemId}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task_name: taskElemText.textContent
            })
        })
            .then(res => res.json())
            .then(res => res)
            .catch(err => console.error(err))
    }
    // Checking-unchecking
    let taskItem = target.closest('div.task__item');
    if (!taskItem) return;
    taskItem.classList.toggle('task__done');
    taskItemInput = taskItem.getElementsByTagName('input');
    if (taskItemInput[0].checked) {
        taskItemInput[0].removeAttribute("checked");
    } else {
        taskItemInput[0].setAttribute("checked", "checked");
    }
});

// Add new list
let addListField = document.getElementById('addListField');
let tasksList = document.getElementById('tasksList');

function renderList(listName, listId) {
    let listItem = document.createElement('label');
    listItem.setAttribute('listid', listId);
    let listItemInput = document.createElement('input');
    listItemInput.type = 'radio';
    listItemInput.name = 'todolist';
    let listItemText = document.createElement('p');
    listItemText.textContent = (listName == undefined) ? addListField.value : listName;
    let btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('list_delete__btn');
    listItem.append(listItemInput);
    listItem.append(listItemText);
    listItem.append(btnDelete);
    tasksList.prepend(listItem);
    addListField.value = '';
}

let formAddList = document.getElementById('formAddList');
formAddList.addEventListener('submit', e => {
    e.preventDefault();
    fetch(listsUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            list_name: addListField.value
        })
    })
        .then(resp => resp.json())
        .then(newList => renderList(newList.name, newList.id))
        .catch(e => e);
});


// Selected and Delete list
tasksList.addEventListener('mousedown', e => {
    let target = e.target;
    // Select
    if (!target.closest('label')) return;
    addTaskField.removeAttribute('disabled');
    // Checking selected element
    let inputs = tasksList.querySelectorAll('input');
    for (let input of inputs)
        input.removeAttribute('checked')
    target.closest('label').firstChild.setAttribute('checked', 'checked');
    // Display list's tasks
    toDoListTasks.innerHTML = '';
    let selectedListId = target.closest('label').getAttribute('listid');
    fetch(tasksUrl)
        .then(resp => resp.json())
        .then(tasks => {
            console.log(tasks);
            tasks.forEach(task => {
                if (task.task_list_id == selectedListId)
                    renderListItem(task.task_name, task.id);
            });
        })
        .catch(err => err);
    // Delete
    if (!target.closest('.list_delete__btn')) return;
    let deletedList = target.closest('.list_delete__btn').parentNode;
    let deletedListId = deletedList.getAttribute('listid');
    console.log('delete', deletedListId);
    fetch(listsUrl + `/${deletedListId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletedListId })
    })
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(e => console.log(e));
    deletedList.remove();
    // toDoListTasks.innerHTML = '';
    // addTaskField.setAttribute('disabled', 'disabled');
});



const listsUrl = 'http://localhost:3000/lists';
const tasksUrl = 'http://localhost:3000/tasks';

// On load
window.onload = function () {
    // Getting lists
    fetch(listsUrl)
        .then(resp => resp.json())
        .then(lists => {
            lists.forEach(list => renderList(list.list_name, list.id))
            console.log('lists get:', lists);
        })
        .catch((err) => {
            console.error(err);
            console.log('get lists');
        });
};

// Adding to localStorage
// window.addEventListener('beforeunload', e => {
//     e.preventDefault();
//     e.returnValue = 'returnValue';
//     localStorage.setItem('lists', tasksList.innerHTML);
//     saveToLocalStorage();
// });
