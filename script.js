// On load
window.onload = function () {
    uploadLists().
        then(lists => {
            lists.forEach(list => renderList(list.name, list.id))
        })
        .catch(err => err);
};

let toDoListTasks = document.getElementById('toDoListTasks');

// Add new task
function renderListItem(taskName, taskId, taskIsChecked) {
    //check
    if (!addTaskField.value && taskName == undefined) return alert('Field is empty');

    let itemTaskDiv = document.createElement('div');
    itemTaskDiv.classList.add('task__item');
    itemTaskDiv.setAttribute('taskid', taskId);

    let itemTaskLabel = document.createElement('label');
    let itemTaskInput = document.createElement('input');
    itemTaskInput.setAttribute('type', 'checkbox');
    let itemTaskText = document.createElement('p');

    if (taskIsChecked) {
        itemTaskDiv.classList.add('task__done');
        itemTaskInput.setAttribute('checked', 'checked');
    }

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
    addNewTask(listId, taskName)
        .then(newTask => renderListItem(newTask.name, newTask.id))
        .catch(err => err);
});

// Checking-unchecking, deleting, edit task (useing delegation)
toDoListTasks.addEventListener('mousedown', (event) => {
    let target = event.target;
    // Deleting
    if (target.closest('button.remove_task__item')) {
        let taskElem = target.closest('button.remove_task__item').parentNode.parentNode;
        let deleteTaskElemId = taskElem.getAttribute('taskid');
        deleteTask(deleteTaskElemId);
        return taskElem.remove();
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
        return editTask(editTaskElemId, taskElemText);
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
    let taskItemId = taskItem.getAttribute('taskid');
    let isTaskChecked = taskItemInput[0].getAttribute('checked') ? true : false;
    
    return checkTask(taskItemId, isTaskChecked);
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
    addNewList(addListField)
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
    selectList()
        .then(tasks => {
            tasks.forEach(task => {
                if (task.listId == selectedListId)
                    renderListItem(task.name, task.id, task.checked);
            });
        })
        .catch(err => err);
    // Delete
    if (!target.closest('.list_delete__btn')) return;
    let deletedList = target.closest('.list_delete__btn').parentNode;
    let deletedListId = deletedList.getAttribute('listid');
    console.log('delete', deletedListId);
    // Deleting list
    deleteList(deletedListId)
        .then(() => toDoListTasks.innerHTML = '')
        .catch(err => err);
    deletedList.remove();
});
