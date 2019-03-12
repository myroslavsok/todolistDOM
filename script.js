toDoList = [
    {
        list_name: 'First list',
        list_tasks: [
            {
                checked: false,
                list_tasks_name: 'First 1'
            },
            {
                checked: false,
                list_tasks_name: 'First 2'
            },
            {
                checked: false,
                list_tasks_name: 'First 3'
            }
        ]      
    },
    {
        list_name: 'second list',
        list_tasks: [
            {
                checked: false,
                list_tasks_name: 'second 1'
            },
            {
                checked: false,
                list_tasks_name: 'second 2'
            },
            {
                checked: false,
                list_tasks_name: 'second 3'
            }
        ]         
    },
    {
        list_name: 'Third list',
        list_tasks: [
            {
                checked: false,
                list_tasks_name: 'Third 1'
            },
            {
                checked: false,
                list_tasks_name: 'Third 2'
            },
            {
                checked: false,
                list_tasks_name: 'Third 3'
            }
        ]        
    },
    {
        list_name: 'Fours list',
        list_tasks: [
            {
                checked: false,
                list_tasks_name: 'Fours 1'
            },
            {
                checked: false,
                list_tasks_name: 'Fours 2'
            },
            {
                checked: false,
                list_tasks_name: 'Fours 3'
            }
        ]         
    },
]


let toDoListTasks = document.getElementById('toDoListTasks');

function saveToLocalStorage() {
    tasksList.querySelectorAll('input').forEach(item => {
        if (item.checked) {
            let listName = item.parentNode.querySelector('p').textContent;
            localStorage.setItem(listName, toDoListTasks.innerHTML);
        }
    });
}

function renderListItem(taskName) {
    //check
    if (!addTaskField.value && taskName == undefined) return alert('Field is empty');

    let itemTaskDiv = document.createElement('div');
    itemTaskDiv.classList.add('task__item');

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

let formAddListItem = document.getElementById('formAddListItem');
formAddListItem.addEventListener('submit', e => {
    e.preventDefault();
    let inputs = tasksList.getElementsByTagName('input');
    let listName;
    for (let input of inputs) {
        if (input.checked)
            listName = input.parentNode.children[1].textContent;
            // alert(input.parentNode.children[1].textContent);
    }
    toDoList.forEach(list => {
        if (list.list_name === listName)
            list.list_tasks.push({
                checked: false,
                list_tasks_name: addTaskField.value
            });
    })
    // Pushing to obj
    console.log('toDoList', toDoList);
    renderListItem();
    saveToLocalStorage();
});

// Adding task
// let addTaskBtn = document.getElementById('addTaskBtn');
let addTaskField = document.getElementById('addTaskField');

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

// Add new list
// let addListBtn = document.getElementById('addListBtn');
let addListField = document.getElementById('addListField');
let tasksList = document.getElementById('tasksList');

function renderList(listName) {
    let listItem = document.createElement('label');
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
    toDoList.push({
        list_name: addListField.value,
        list_tasks: []
    });
    renderList(toDoList[toDoList.length - 1].list_name);
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
    let listName = target.closest('label').querySelector('p').textContent;
    toDoList.forEach(list => {
        if (list.list_name === listName) 
            list.list_tasks.forEach(task => {
                renderListItem(task.list_tasks_name);
            });
    });
    // Delete
    if (!target.closest('.list_delete__btn')) return;
    target.closest('.list_delete__btn').parentNode.remove();
    localStorage.removeItem(listName);
    toDoListTasks.innerHTML = '';
    addTaskField.setAttribute('disabled', 'disabled');
});



//test
// const serverURL = 'http://localhost:3000/';
// function create(data) {
//     let options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     }
//     return fetch(serverURL + '/posts', options)
//       .then((response) => response.json)
//   }
//   create({title: "check it out", author: "Mike"})

const listsUrl = 'http://localhost:3000/lists';
const tasksUrl = 'http://localhost:3000/tasks';



// On load
window.onload = function () {
    // Getting lists
    fetch(listsUrl)
        .then((resp) => resp.json())
        .then(lists => {
            lists.forEach(list => renderList(list.list_name))
            console.log('lists get:', lists);
        })
        .catch((err) => {
            console.error(err);
            console.log('get lists');
        });
    // toDoList.forEach(item => {
    //     renderList(item.list_name);
    // });
    // tasksList.innerHTML = localStorage.getItem('lists');
};

// Adding to localStorage
// window.addEventListener('beforeunload', e => {
//     e.preventDefault();
//     e.returnValue = 'returnValue';
//     localStorage.setItem('lists', tasksList.innerHTML);
//     saveToLocalStorage();
// });
