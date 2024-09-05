const result = document.getElementById("result")
const user_modal = document.getElementById("user-modal")
const close = document.getElementById("close")
const save = document.getElementById("save")
let todos =  JSON.parse(localStorage.getItem("todos")) || [
    {status: "open", tasks: []},
    {status: "pending", tasks: []},
    {status: "inproge", tasks: []},
    {status: "complete", tasks: []},
]   
let form = {}
document.addEventListener("DOMContentLoaded", function(){
    save.addEventListener("click", addTask)
    displayTodos()
})

close.addEventListener("click", function(){
    toggleModal("none")
})
window.addEventListener("click", function(event){
    if (event.target === user_modal) {
        toggleModal("none")
    }
})

function displayTodos(){
    result.innerHTML = ""
    todos.forEach((item, statusIndex) =>{
        let col = document.createElement('div')
        col.classList.add("col-md-3")
        let task_list = item.tasks.map((task, taskIndex) => {
            return `
            <li>
                ${task} 
                <button class="btn btn-sm btn-warning" onclick="editTask(${statusIndex}, ${taskIndex})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${statusIndex}, ${taskIndex})">Delete</button>
            </li>`
        }).join("")
        col.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3 class="text-center">${item.status.toUpperCase()}</h3>
                </div>
           
            <div class="card-body">
                <ol>${task_list}</ol>
            </div>
            <div class="card-footer">
                <div class="d-flex justify-content-center">
                    <button onclick="openModal()" class="btn btn-success">Add task</button>
                </div>
            </div>
             </div>
        `
        result.appendChild(col)
    })
}

function openModal(){
    toggleModal("block")
    form = {}
    document.querySelector('input[name="task"]').value = ""
    document.querySelector('select[name="status"]').value = ""
    document.querySelector('input[name="editIndex"]').value = ""
}


function toggleModal(status){
    user_modal.style.display = status
}

function handleChange(event){
    const {name, value} = event.target
    form = {...form, [name]:value}
}

function addTask(){
    const {task, status, editIndex} = form
    if (editIndex) {
        todos.forEach((item, index) => {
            if (index == editIndex.split("-")[0] && item.status === status) {
                item.tasks[editIndex.split("-")[1]] = task
            }
        })
    } else {
        todos.forEach(item =>{
            if (item.status === status) {
                item.tasks.push(task)
            }
        })
    }
    saveStorage()
    displayTodos()
    toggleModal("none")
}

function editTask(statusIndex, taskIndex){
    const taskToEdit = todos[statusIndex].tasks[taskIndex]
    openModal()
    form = {task: taskToEdit, status: todos[statusIndex].status, editIndex: `${statusIndex}-${taskIndex}`}
    document.querySelector('input[name="task"]').value = taskToEdit
    document.querySelector('select[name="status"]').value = todos[statusIndex].status
    document.querySelector('input[name="editIndex"]').value = `${statusIndex}-${taskIndex}`
}

function deleteTask(statusIndex, taskIndex){
    todos[statusIndex].tasks.splice(taskIndex, 1)
    saveStorage()
    displayTodos()
}

function saveStorage(){
    localStorage.setItem("todos",JSON.stringify(todos))
}