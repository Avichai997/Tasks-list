const TASK_NAME_MAX_LENGTH = 30;
let dragElement = null;
const toggleBtn = document.querySelector("#toggle");
const addTodoInputEl = document.querySelector("#add-todo");
const ulElement = document.querySelector("ul");

// Functions:

// Mark TODO as complete
toggleTaskStatus = (event) => {
  const li = event.target.closest("li");
  if (li) li.classList.toggle("completed");
};

// Delete Task
onTaskDelete = (event) => {
  const span = event.target.closest("span");
  if (span) {
    const li = span.parentNode;
    li.style.opacity = 0;
    li.addEventListener("transitionend", () => {
      li.remove();
    });
  }
  event.stopPropagation();
};
onDragStartHandler = (event) => {
  // set css and save the html element data
  event.target.style.opacity = 0.4;
  dragElement = event.target;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", event.target.innerHTML);
};

onDragEnterHandler = (event) => {
  const li = event.target.closest("li");
  if (li) {
    li.classList.add("over");
  }
};
onDragLeaveHandler = (event) => {
  const li = event.target.closest("li");
  if (li) {
    li.classList.remove("over");
  }
};
onDragOverHandler = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  return false;
};
onDragDropHandler = (event) => {
  event.stopPropagation();
  const li = event.target.closest("li");
  if (li && dragElement !== li) {
    dragElement.innerHTML = li.innerHTML;
    li.innerHTML = event.dataTransfer.getData("text/html");
  }
  return false;
};
onDragEndHandler = (event) => {
  document.querySelectorAll("ul li").forEach((li) => {
    li.classList.remove("over");
    li.style.opacity = 1;
  });
};

// Mark TODO as complete
ulElement.addEventListener("click", toggleTaskStatus);
// delete TODO span
ulElement.addEventListener("click", onTaskDelete);

function initEventListeners(ulElement) {
  // drag and drop effects
  ulElement.addEventListener("dragstart", onDragStartHandler);
  ulElement.addEventListener("dragenter", onDragEnterHandler);
  ulElement.addEventListener("dragleave", onDragLeaveHandler);
  ulElement.addEventListener("dragover", onDragOverHandler);
  // drag and drop handle
  ulElement.addEventListener("drop", onDragDropHandler);
  ulElement.addEventListener("dragend", onDragEndHandler);
}

initEventListeners(ulElement);

// add TODO button
addTodoInputEl.addEventListener("keypress", (event) => {
  if (event.key !== "Enter") return;
  // key is Enter so add a new li
  if (addTodoInputEl.value.length > TASK_NAME_MAX_LENGTH)
    return alert("Task name must be shorter then 30 chars!");

  // save Task
  const createNewTask = (taskName) =>
    `<li draggable="true">
      <span><i class='fa fa-trash' aria-hidden='true'></i>
      </span>${taskName}
    </li>`;

  const newTaskItem = createNewTask(addTodoInputEl.value);
  ulElement.insertAdjacentHTML("beforeend", newTaskItem);
  addTodoInputEl.value = "";
  toggleBtn.click(); // to close after add new todo
});

// toggle button animation

// In this example, we first define the toggleBtn and content elements using document.getElementById.
// We then add an event listener to the toggleBtn that checks the current display property of the content element.
// If it's currently hidden (display: none), we show it with a fade-in animation using the fadeIn function.
// If it's currently visible, we hide it with a fade - out animation using the fadeOut function.

// The fadeIn and fadeOut functions use the requestAnimationFrame method to create a smooth animation effect.
// The animate function is called repeatedly until the animation is complete,
// using the performance.now() method to calculate the elapsed time and the timeFraction variable to calculate the current opacity value.

toggleBtn.addEventListener("click", function () {
  toggleBtn.classList.toggle("fa-plus-square");
  toggleBtn.classList.toggle("fa-minus-square");

  if (addTodoInputEl.style.display === "none") {
    // Show the addTodoInputEl with animation
    addTodoInputEl.style.display = "block";
    addTodoInputEl.style.opacity = 0;
    fadeIn(addTodoInputEl, 400);
  } else {
    // Hide the addTodoInputEl with animation
    fadeOut(addTodoInputEl, 400, function () {
      addTodoInputEl.style.display = "none";
    });
  }
});

function fadeIn(element, duration) {
  element.style.opacity = 0;
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    element.style.opacity = timeFraction;
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

function fadeOut(element, duration, callback) {
  element.style.opacity = 1;
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    element.style.opacity = 1 - timeFraction;
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    } else {
      callback();
    }
  });
}
