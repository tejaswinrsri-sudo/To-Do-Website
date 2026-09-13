// ---------- State ----------
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ---------- DOM ----------
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const emptyMsg = document.getElementById('emptyMsg');
const filterBtns = document.querySelectorAll('.filter-btn');

// ---------- Render ----------
function render() {
  // Filter tasks
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  // Clear list
  taskList.innerHTML = '';

  // Empty state
  if (filtered.length === 0) {
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
  }

  // Build each task
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} />
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="delete-btn" title="Delete">✕</button>
    `;

    // Toggle complete
    li.querySelector('input').addEventListener('change', () => {
      task.completed = !task.completed;
      save();
      render();
    });

    // Delete
    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      save();
      render();
    });

    taskList.appendChild(li);
  });

  // Update counter
  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
}

// ---------- Actions ----------
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
  });

  taskInput.value = '';
  save();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
}

// ---------- Helpers ----------
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Prevent XSS: escape HTML in user input
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Events ----------
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ---------- Init ----------
render();