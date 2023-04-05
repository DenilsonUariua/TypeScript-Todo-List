/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/

import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

confetti.create(document.getElementById('canvas') as HTMLCanvasElement, {
  resize: true,
  useWorker: true,
})({ particleCount: 500, spread: 300 });

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector<HTMLFormElement>('#new-task-form');
const input = document.querySelector<HTMLInputElement>('#new-task-title');

const tasks: Task[] = [];
load();
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input?.value == '' || input?.value == null) return;

  // clear local storage
  if (input.value == 'clear') {
    clear();
    return;
  }

  const newTask: Task = {
    id: uuidv4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  // add task to tasks array
  tasks.push(newTask);

  // save tasks to local storage
  addListItem(newTask);
  input.value = '';
});

// function to add a new task to the list
function addListItem(task: Task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');

  // event listener to update task status
  checkbox.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    task.completed = target.checked;
    // save tasks to local storage
    save();
    confetti.create(document.getElementById('canvas') as HTMLCanvasElement, {
      resize: true,
      useWorker: true,
    })({ particleCount: 100, spread: 200 });
  });

  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

function deleteAllListItems() {
  const list = document.querySelector('#task-list');
  if (list) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    
  }
}
// function to save tasks to local storage
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
// function to load tasks from local storage
function load() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    const parsedTasks: Task[] = JSON.parse(savedTasks);
    parsedTasks.forEach((task) => {
      tasks.push(task);
      addListItem(task);
    });
  }
}
// function to clear local storage
function clear() {
  localStorage.clear();
  deleteAllListItems();
}
