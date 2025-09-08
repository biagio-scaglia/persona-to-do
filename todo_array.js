const tasks = []; 
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
    tasks.push({ text, done: false });
    input.value = '';
    render();
}

function toggleDone(i) {
    tasks[i].done = !tasks[i].done;
    render();
}

function removeTask(i) {
    tasks.splice(i, 1);
    render();
}

function clearAll() {
    tasks.length = 0;
    render();
}

function markAll() {
    tasks.forEach(t => t.done = true);
    render();
}

function removeCompleted() {
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (tasks[i].done) tasks.splice(i, 1);
    }
    render();
}

function render() {
    list.innerHTML = '';
    tasks.forEach((t, i) => {
        const li = document.createElement('li');
        li.textContent = t.text;
        if (t.done) li.classList.add('done');

        const doneBtn = document.createElement('button');
        doneBtn.textContent = '☑';
        doneBtn.onclick = () => toggleDone(i);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.onclick = () => removeTask(i);

        li.appendChild(doneBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    });

    totalCount.textContent = tasks.length;
    doneCount.textContent = tasks.filter(t => t.done).length;
}
