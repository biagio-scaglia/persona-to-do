const tasks = new Map();
const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');
const totalCount = document.getElementById('totalCount');
const doneCount = document.getElementById('doneCount');

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('clearBtn').addEventListener('click', clearAll);
document.getElementById('markAllBtn').addEventListener('click', markAll);
document.getElementById('removeCompletedBtn').addEventListener('click', removeCompleted);

function addTask() {
    const text = input.value.trim();
    if (!text) return;
    const id = Date.now().toString();
    tasks.set(id, { text, done: false });
    input.value = '';
    render();
}

function toggleDone(id) {
    const t = tasks.get(id);
    if (t) t.done = !t.done;
    render();
}

function removeTask(id) {
    tasks.delete(id);
    render();
}

function clearAll() {
    tasks.clear();
    render();
}

function markAll() {
    for (let t of tasks.values()) t.done = true;
    render();
}

function removeCompleted() {
    for (let [id, t] of tasks) {
        if (t.done) tasks.delete(id);
    }
    render();
}

function render() {
    list.innerHTML = '';
    for (let [id, t] of tasks) {
        const li = document.createElement('li');
        li.textContent = t.text;
        if (t.done) li.classList.add('done');

        const doneBtn = document.createElement('button');
        doneBtn.textContent = '☑';
        doneBtn.onclick = () => toggleDone(id);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.onclick = () => removeTask(id);

        li.appendChild(doneBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    }

    totalCount.textContent = tasks.size;
    doneCount.textContent = [...tasks.values()].filter(t => t.done).length;

    // Aggiorna la barra di progresso
    const progressBarFill = document.querySelector('.progress-bar-fill');
    if (progressBarFill) {
        const totalTasks = tasks.size;
        const completedTasks = [...tasks.values()].filter(t => t.done).length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBarFill.style.width = `${progressPercentage}%;`;
    }
}
