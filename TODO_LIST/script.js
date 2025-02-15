const wrapper = document.querySelector(".wrapper");
const backBtn = document.querySelector(".back-btn");
const menuBtn = document.querySelector(".menu-btn");

const toggleScreen = () => {
    wrapper.classList.toggle("show-category");
};

menuBtn.addEventListener("click",toggleScreen);
backBtn.addEventListener("click",toggleScreen);

const addTaskBtn = document.querySelector(".add-task-btn");
const addTaskForm = document.querySelector(".add-task");
const blackBackdrop = document.querySelector(".black-backdrop");

const toggleAddTaskForm = () => {
    addTaskForm.classList.toggle("active");
    blackBackdrop.classList.toggle("active");
    addTaskBtn.classList.toggle("active");
};

addTaskBtn.addEventListener("click",toggleAddTaskForm);
blackBackdrop.addEventListener("click",toggleAddTaskForm);

// Adding categories and tasks
let categories = [
    {
        title: "Personal",
        img: "category-personal.jpg",
    },
    {
        title: "Work",
        img: "category-work.png",
    },
    {
        title: "Coding",
        img: "category-coding.png",
    },
    {
        title: "Health",
        img: "category-health.jpg",
    },
];

let tasks = [
    {
        id : 1,
        task : "Cleaning the kitchen",
        category : "Personal",
        priority : "medium",
        completed : false,
    },
    {
        id : 2,
        task : "Go to the market",
        category : "Personal",
        priority : "medium",
        completed : false,
    },
];

let selectedCategory = categories[0];

const categoriesContainer = document.querySelector(".categories");
const categoryTitle = document.querySelector(".category-title");
const totalcategoryTasks = document.querySelector(".category-tasks");
const categoryImg = document.querySelector("#category-img");
const totalTasks = document.querySelector(".totalTasks");

const calculateTotal = () => {
    const categoryTasks = tasks.filter(
        (task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase()
    );
    totalcategoryTasks.innerHTML = `${categoryTasks.length} Tasks`;
    totalTasks.innerHTML = tasks.length;
};


const renderCategories = () => {
    categoriesContainer.innerHTML = "";
    categories.forEach((category) => {
        // getting all the tasks of current category
        const categoryTasks = tasks.filter(
            (task) => task.category.toLowerCase() === category.title.toLowerCase()
        );

        // creating a div render the category
        const div = document.createElement("div");
        div.classList.add("category");
        div.addEventListener("click",() => {
            wrapper.classList.add("show-category");
            selectedCategory = category;
            categoryTitle.innerHTML = category.title;
            categoryImg.src = `Images/${category.img}`;
            calculateTotal();
            //render tasks when category changes
            renderTasks();
        });
        div.innerHTML = `
            <div class="left">
                <img src="Images/${category.img}" alt="${category.title}">
                <div class="content">
                    <h1>${category.title}</h1>
                    <p>${categoryTasks.length}</p>
                </div>
            </div>
            <div class="options">
                <div class="toggle-btn">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
            </div>
        `;

        categoriesContainer.appendChild(div);
    });
};

const tasksContainer = document.querySelector(".tasks");

const renderTasks = () => {
    tasksContainer.innerHTML = "";
    const categoryTasks = tasks.filter(
        (task) => task.category.toLowerCase() === selectedCategory.title.toLowerCase()
    );

    // if no task for selected category
    if(categoryTasks.length === 0){
        tasksContainer.innerHTML = `
        <p class="no-task">No tasks for this category</p>
        `;
    }else{
        // if there are tasks then render them
        categoryTasks.forEach((task) => {
            const div = document.createElement("div");
            div.classList.add("task-wrapper");
            const label = document.createElement("label");
            label.classList.add("task");
            label.setAttribute("for",task.id);
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = task.id;
            checkbox.checked = task.completed;

            // add completion functionality on click checkbox
            checkbox.addEventListener("change", () => {
                const index = tasks.findIndex((t) => t.id === task.id);
                //change true to false or vice-versa
                tasks[index].completed = !tasks[index].completed;
                //save in local
                saveLocal();
            });

            div.innerHTML = `
            <div class="delete">
                            <i class="fa-solid fa-trash"></i>
                        </div>
            `;

            label.innerHTML = `
            <span class="checkmark">
                                <i class="fa-solid fa-check"></i>
                            </span>
                            <p>${task.task}</p>
            `;

            label.prepend(checkbox);
            div.prepend(label);
            tasksContainer.appendChild(div);

            //delete functionality
            const deleteBtn = div.querySelector(".delete");
            deleteBtn.addEventListener("click",()=>{
                const index = tasks.findIndex((t) => t.id === task.id);

                //remove the clicked task
                tasks.splice(index,1);
                saveLocal();
                renderTasks();
            });
        });

        renderCategories();
        calculateTotal();
    }
};

// save and get tasks from local storage
const saveLocal = () => {
    localStorage.setItem("tasks",JSON.stringify(tasks));
};

const getLocal = () => {
    const localTasks = JSON.parse(localStorage.getItem("tasks"));

    // if tasks found
    if(localTasks){
        tasks = localTasks;
    }
};



//render all the categories in select
const categorySelect = document.querySelector("#category-select");
const cancelBtn = document.querySelector(".cancel-btn");
const addBtn = document.querySelector(".add-btn");

const taskInput = document.querySelector("#task-input");

cancelBtn.addEventListener("click",toggleAddTaskForm);

// adding functionality to add new tasks
addBtn.addEventListener("click", () => {
    const task = taskInput.value;
    const category = categorySelect.value;

    if((task === "")){
        alert("Please enter a task");
    }else{
        newTask = {
            id : tasks.length+1,
            task,
            category,
            completed : false,
        };
        tasks.push(newTask);
        taskInput.value = "";
        saveLocal();
        toggleAddTaskForm();
        renderTasks();
    }
});

categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.title.toLowerCase();
    option.textContent = category.title;
    categorySelect.appendChild(option);
});

getLocal();
calculateTotal();
renderTasks();
