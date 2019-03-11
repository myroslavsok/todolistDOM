let toDoListTasks = document.getElementById('toDoListTasks');

function saveToLocalStorage() {
    tasksList.querySelectorAll('input').forEach(item => {
        if (item.checked) {
            let listName = item.parentNode.querySelector('p').textContent;
            localStorage.setItem(listName, toDoListTasks.innerHTML);
        }
    });
} 

// Adding task
let addTaskBtn = document.getElementById('addTaskBtn');
let addTaskField = document.getElementById('addTaskField');

addTaskBtn.addEventListener('click', () => {
    if (!addTaskField.value) return alert('Field is empty');

    let itemTaskDiv = document.createElement('div');
    itemTaskDiv.classList.add('task__item');

    let itemTaskLabel = document.createElement('label');
    let itemTaskInput = document.createElement('input');
    itemTaskInput.setAttribute('type', 'checkbox');
    let itemTaskText = document.createElement('p');
    itemTaskText.textContent = addTaskField.value;
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

    saveToLocalStorage();
});

// Checking-unchecking, deleting, edit task (useing delegation)
toDoListTasks.addEventListener('mousedown', (event) => {
    let target = event.target;
    // Deleting
    if (target.closest('button.remove_task__item')) {
        target.closest('button.remove_task__item').parentNode.parentNode.remove();
        return saveToLocalStorage();
    }
    // Editing name
    if (target.closest('button.edit_task__item')) {
        let taskItemContainer = target.closest('button.edit_task__item').parentNode.parentNode;
        let taskItemName = taskItemContainer.getElementsByTagName('p');
        let defaultText = taskItemName[0].textContent;
        taskItemName[0].textContent = prompt('Rename task', taskItemName[0].textContent);
        if (!taskItemName[0].textContent)
            taskItemName[0].textContent = defaultText;
        return saveToLocalStorage();
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
    saveToLocalStorage();
});

// On load
window.onload = function () {
    tasksList.innerHTML = localStorage.getItem('lists');
};

// Adding to localStorage
window.addEventListener('beforeunload', e => {
    e.preventDefault();
    e.returnValue = 'returnValue';
    localStorage.setItem('lists', tasksList.innerHTML);

    saveToLocalStorage();
});

// Add new list
let addListBtn = document.getElementById('addListBtn');
let addListField = document.getElementById('addListField');
let tasksList = document.getElementById('tasksList');

addListBtn.addEventListener('click', () => {
    let listItem = document.createElement('label');
    let listItemInput = document.createElement('input');
    listItemInput.type = 'radio';
    listItemInput.name = 'todolist';
    let listItemText = document.createElement('p');
    listItemText.textContent = addListField.value;
    let btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('list_delete__btn');
    listItem.append(listItemInput);
    listItem.append(listItemText);
    listItem.append(btnDelete);

    tasksList.prepend(listItem);
    addListField.value = '';
});


// Selected and Delete list
tasksList.addEventListener('mousedown', e => {
    let target = e.target;
    // Select
    if (!target.closest('label')) return;
    addTaskField.removeAttribute('disabled');
    toDoListTasks.innerHTML = '';
    let listName = target.closest('label').querySelector('p').textContent;
    for (let key in localStorage)
        if (key === listName)
            toDoListTasks.innerHTML = localStorage.getItem(listName);
    // Delete
    if (!target.closest('.list_delete__btn')) return;
    target.closest('.list_delete__btn').parentNode.remove();
    localStorage.removeItem(listName);
    toDoListTasks.innerHTML = '';
    addTaskField.setAttribute('disabled', 'disabled');
    // alert('1');
});