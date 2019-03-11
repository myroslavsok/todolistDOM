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
    toDoListTasks.append(itemTaskDiv);

    addTaskField.value = '';

    //test
    console.log(toDoListTasks.innerHTML);
    localStorage.setItem('tasks', toDoListTasks.innerHTML);
});

// Checking-unchecking, deleting, edit task
toDoListTasks.addEventListener('mousedown', (event) => {
    let target = event.target;
    // Deleting
    if (target.closest('button.remove_task__item')) 
        return target.closest('button.remove_task__item').parentNode.parentNode.remove();
    // Checking-unchecking
    let taskItem = target.closest('div.task__item');
    if (!taskItem) return;
    taskItem.classList.toggle('task__done');
    taskItemInput = taskItem.getElementsByTagName('input');
    taskItemInput[0].checked = !taskItemInput[0].checked;
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
//     // console.log('test 2');
//     localStorage.setItem('test', toDoListTasks.innerHTML);
//   });