// add button to add more tasks
// history to show done tasks
// delete icon to delete tasks
// checkbxox to mark tasks as done
// enter key to add tasks
// local storage to save tasks
// done tasks is hidden, and when shown is shown in low opacity


// add more comments for each function


const add_btn = document.getElementById("add-btn");
const taskField = document.querySelector(".task-field");
const inputField = taskField.querySelector("input[type='text']");
const container = document.querySelector(".container");
const deleteIcon = taskField.querySelector("i");
const checkbox = taskField.querySelector("input[type='checkbox']");
const hiddenText = document.querySelector(".hidden-text");
const history = document.getElementById("history-btn");
const doneTasksContainer = document.querySelector(".done-tasks");


// task storage arrays
let activeTasks = [];
let completedTasks = [];
let isHistoryVisible = false;

// initialize app
function init(){
  // hide task field initailly
  taskField.style.display = "none";
  checkbox.disabled = true;

  // load tasks form localStorage if available
  loadTasksFromStorage();
  renderTasks();
}


// -------------//
// add button //
// -------------//

add_btn.addEventListener("click", () => {
  showTaskField();
});

function showTaskField(){
  taskField.style.display = "flex";
  inputField.focus();
  inputField.value = "";
  checkbox.check = false;
  checkbox.disabled = true;
  hiddenText.style
}

// -------------//
// Input Events //
// -------------//

inputField.addEventListener("input", () => {
  if (inputField.value.trim() !== "") {
    checkbox.disabled = false;
  }else{
    checkbox.disabled = true;
  }
});

// on Enter Key to add tasks
inputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
})


// -------------//
// checkbox //
// -------------//

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
   addTask(); 
  }
});



// -------------//
// add task //
// -------------//

function addTask(){
  const taskText = inputField.value.trim();

  if (taskText === ""){
    return;
  }


  // create new task object
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  // add new task to active tasks array
  activeTasks.push(newTask);

  // save to localstorage
  saveTasksToStorage();

  // render tasks
  renderTasks();

  // reset form
  resetTaskField();
}

function resetTaskField(){
  inputField.value = "";
  checkbox.checked = false;
  checkbox.disabled = true;
  taskField.style.display = "none";
  hiddenText.style.display = activeTasks.length === 0 ? "block" : "none";
}


// -------------//
// create tasks element (done or active) //
// -------------//


function createTaskElement(task, isCompleted) {
    // create task element with dynamic classname according to the isCompleted parameter (use boolean logic)
    const taskElement = document.createElement('div');
    taskElement.className = isCompleted ? 'task-item done-task' : 'task-item';
    
    // Apply task-field styling like the original
    // to do this, use inline styles
    taskElement.style.cssText = `
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: ${isCompleted ? 'rgba(255, 255, 255, 0.7)' : '#fff'};
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        width: 70%;
        ${isCompleted ? 'opacity: 0.6;' : ''}
    `;
    
    taskElement.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''} ${isCompleted ? 'disabled' : ''} style="
            order: -1;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            cursor: ${isCompleted ? 'default' : 'pointer'};
        ">
        <input type="text" value="${task.text}" readonly style="
            flex: 1;
            border: none;
            outline: none;
            font-size: 16px;
            margin-right: 10px;
            background: transparent;
            ${isCompleted ? 'text-decoration: line-through;' : ''}
        ">
        <i class="fa-solid fa-trash" style="
            cursor: pointer;
            ${isCompleted ? 'display: block;' : 'display: none;'}
        "></i>
    `;
    
    // Add event listeners
    const taskCheckbox = taskElement.querySelector('input[type="checkbox"]');
    const deleteBtn = taskElement.querySelector('.fa-trash');
    
    // Show delete icon on hover for active tasks
    if (!isCompleted) {
        taskElement.addEventListener('mouseenter', () => {
            deleteBtn.style.display = 'block';
        });
        
        taskElement.addEventListener('mouseleave', () => {
            deleteBtn.style.display = 'none';
        });
        
        taskCheckbox.addEventListener('change', () => {
            if (taskCheckbox.checked) {
                completeTask(task.id);
            }
        });
    }
       // Delete button hover effect
    deleteBtn.addEventListener('mouseenter', () => {
        deleteBtn.style.color = 'red';
    });
    
    deleteBtn.addEventListener('mouseleave', () => {
        deleteBtn.style.color = '';
    });
    
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id, isCompleted);
    });
    
    // Insert before done-tasks container
    container.insertBefore(taskElement, doneTasksContainer);
}


// -------------//
// render tasks (done or active)//
// -------------//

function renderTasks(){
  // clear container
  const existingTasks = container.querySelectorAll(".task-item");
  existingTasks.forEach((task) => {
    task.remove();
  });

  // Show/hide hidden text
    hiddenText.style.display = (activeTasks.length === 0 && !isHistoryVisible) ? "block" : "none";
    
    // Render active tasks
    activeTasks.forEach(task => {
        createTaskElement(task, false);
    });
    
    // Render completed tasks if history is visible
    if (isHistoryVisible) {
        completedTasks.forEach(task => {
            createTaskElement(task, true);
        });
    }
}


// -------------//
// Task Actions use task id //
// -------------//

function completeTask(taskId) {
    const taskIndex = activeTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const task = activeTasks.splice(taskIndex, 1)[0];
        task.completed = true;
        task.completedAt = new Date().toISOString();
        completedTasks.push(task);
        
        saveTasksToStorage();
        renderTasks();
    }
}

function deleteTask(taskId, isCompleted) {
    if (isCompleted) {
        const taskIndex = completedTasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            completedTasks.splice(taskIndex, 1);
        }
    } else {
        const taskIndex = activeTasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            activeTasks.splice(taskIndex, 1);
        }
    }
    
    saveTasksToStorage();
    renderTasks();
}

// -------------//
// History      //
// -------------//

history.addEventListener("click", () => {
    isHistoryVisible = !isHistoryVisible;
    
    if (isHistoryVisible) {
        history.textContent = "Hide History";
        history.style.opacity = "0.7";
    } else {
        history.textContent = "History";
        history.style.opacity = "1";
    }
    
    renderTasks();
});

// -------------//
// Local Storage//
// -------------//

function saveTasksToStorage() {
    try {
        localStorage.setItem('todoActiveTasks', JSON.stringify(activeTasks));
        localStorage.setItem('todoCompletedTasks', JSON.stringify(completedTasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
}

function loadTasksFromStorage() {
    try {
        const savedActiveTasks = localStorage.getItem('todoActiveTasks');
        const savedCompletedTasks = localStorage.getItem('todoCompletedTasks');
        
        if (savedActiveTasks) {
            activeTasks = JSON.parse(savedActiveTasks);
        }
        
        if (savedCompletedTasks) {
            completedTasks = JSON.parse(savedCompletedTasks);
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        activeTasks = [];
        completedTasks = [];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// If DOM is already loaded, initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


