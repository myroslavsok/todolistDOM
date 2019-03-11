let toDoListTasks = document.getElementById('toDoListTasks');

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

    toDoListTasks.append(itemTaskDiv);

    addTaskField.value = '';

    //test
    console.log(toDoListTasks.innerHTML);
    localStorage.setItem('tasks', toDoListTasks.innerHTML);
});

// Checking-unchecking, deleting, edit task (useing delegation)
toDoListTasks.addEventListener('mousedown', (event) => {
    let target = event.target;
    // Deleting
    if (target.closest('button.remove_task__item')) 
        return target.closest('button.remove_task__item').parentNode.parentNode.remove();
    // Editing name
    if (target.closest('button.edit_task__item')) {
        let taskItemContainer = target.closest('button.edit_task__item').parentNode.parentNode;
        let taskItemName = taskItemContainer.getElementsByTagName('p');
        return taskItemName[0].textContent = prompt('Rename task', taskItemName[0].textContent);
        //ESC
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

// On load
// window.onload = function() {
//     toDoListTasks.innerHTML = localStorage.getItem('tasks');
// };

// Adding to localStorage
// window.addEventListener('beforeunload', e => {
//     // Cancel the event
//     // e.preventDefault();
//     // Chrome requires returnValue to be set
//     e.returnValue = 'returnValue';
//     localStorage.setItem('tasks', toDoListTasks.innerHTML);

//     // console.log('test 2');
//   });

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
    listItem.append(listItemInput);
    listItem.append(listItemText);
    
    tasksList.append(listItem);
    addListField.value = '';
})