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
// the use of isHistoryVisible variable
// 1. when history btn is toggle, the isHistoryVisible changes its value either true or false
// 2. in the rendertasks function, this variable is used to determine whether to render the completed tasks or not
// (in rendertasks, it uses to render completed or uncompleted tasks, thus need sth to determine whether to show the tasks or not)
// 3. also use to update the history btn innerHTML, changing its text content



// initialize app
function init(){
  // hide task field initailly
  taskField.style.display = "none";
  checkbox.disabled = true;

  // load tasks form localStorage if available
  loadTasksFromStorage();
  renderTasks();
}

// purpose of init function
// 1. is to set ip the initial state of the application including:
// - hiding tasks field that is completed
// - disabling the checkbox is there is no input content initially
// - loading tasks from localstarage, that is being store from previous session
// - rendering tasks (see rendertask function purpose)



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
// use to add new tasks when u click on the btn



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

// on Enter Key to add tasks, make that task an active task
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
// add task purpose
// 1. add new task to the application
// 2. first it gets the task text, if empty it returns and not proceed to the next step
// 3. if not empty, then it creates a new task object called newTask (with date.now() as id)
// 4. then it add the new task to activeTasks array
// 5. save to localstorage using a function
// 6. rendertasks using a function, here it renders as activeTasks
// 7. then reset the task field for a new task to be added (using the add btn)




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
// create task element function purpose:
// 1. create a new div element called taskElement
// 2. set the class name to either one of the classname, depend on the value of isCompleted parameter
// 3. style the task element using inline style, then styles the inner element in it
// 4. create some variable to store element got from the newly styled and added taskElement div
// 5. if it is an active tasks, deletebtn display block on hover, if checkboxed check it adds to complete task function
// 6. hover on deletebtn changes colors, and click on deletebtn calls deleteTask function
// 7. make sure the task element is inserted before the done-tasks container





// -------------//
// render tasks (done or active)//
// -------------//

function renderTasks(){
  // clear container
  const existingTasks = container.querySelectorAll(".task-item");
//   task here is its own parameter, not passdown from other function
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
// purpose of clearing the container before render
// 1. lets say we add a task to the container, that means it uses the createtaskelement function, the tasks is created using the new div in the function and stores in the task-item class, then push to the activetask array
// 2. then the render tasks will take the responsibilty to whether display the task or not
// 3. if we then add another task, then the same steps is being repeated, the old task is still there, then it will cause duplication,
// 4. that is why we need to clear the container before render





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
// purpose of complete task function
// 1. first it create a variable, that variable is used to find the task id in the activetasks array
// 2. if it exists, then it creates a variable called task, that variable stores the task found in the activetasks array
// 3. then it updates teh status of the task
// 4. then push the task to completedtasks array

// splice in both of these function are important to remove tasks from its corresponding array


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
// the purpose of these two above is to ensure that the application is initilized only when the DOM is fully loaded


