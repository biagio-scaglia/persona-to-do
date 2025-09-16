interface Task {
	id: string;
	text: string;
	done: boolean;
	createdAt: Date;
}

interface StoredTask {
	id: string;
	text: string;
	done: boolean;
	createdAt: string;
}

let tasks: Task[] = [];
const input = document.getElementById('taskInput') as HTMLInputElement;
const list = document.getElementById('taskList') as HTMLUListElement;
const totalCount = document.getElementById('totalCount') as HTMLElement;
const doneCount = document.getElementById('doneCount') as HTMLElement;

const STORAGE_KEY = 'persona_todos_array';

function loadTasks(): void {
	const storedTasks = localStorage.getItem(STORAGE_KEY);
	if (storedTasks) {
		const parsedTasks = JSON.parse(storedTasks) as StoredTask[];
		// Converti createdAt in oggetto Date per ogni task
		tasks = parsedTasks.map((taskData: StoredTask): Task => ({
			...taskData,
			createdAt: new Date(taskData.createdAt)
		}));
	}
}

function saveTasks(): void {
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify(
			tasks.map((t): StoredTask => ({
				id: t.id,
				text: t.text,
				done: t.done,
				createdAt: t.createdAt.toISOString()
			}))
		)
	);
}

document.getElementById('addBtn')!.addEventListener('click', addTask);
document.getElementById('clearBtn')!.addEventListener('click', clearAll);
document.getElementById('markAllBtn')!.addEventListener('click', markAll);
document.getElementById('removeCompletedBtn')!.addEventListener('click', removeCompleted);

function addTask(): void {
	const text = input.value.trim();
	if (!text) return;
	const id = Date.now().toString();
	tasks.push({ id, text, done: false, createdAt: new Date() });
	input.value = '';
	saveTasks();
	render();
}

function toggleDone(id: string): void {
	const taskIndex = tasks.findIndex(t => t.id === id);
	if (taskIndex !== -1) {
		tasks[taskIndex].done = !tasks[taskIndex].done;
		saveTasks();
		render();
	}
}

function removeTask(id: string): void {
	tasks = tasks.filter(t => t.id !== id);
	saveTasks();
	render();
}

function clearAll(): void {
	tasks = [];
	saveTasks();
	render();
}

function markAll(): void {
	tasks.forEach(t => (t.done = true));
	saveTasks();
	render();
}

function removeCompleted(): void {
	tasks = tasks.filter(t => !t.done);
	saveTasks();
	render();
}

function render(): void {
	const currentDoneCount = tasks.filter(t => t.done).length;

	const sortOrder = document.getElementById('sortOrder') as HTMLSelectElement;
	const filterStatus = document.getElementById('filterStatus') as HTMLSelectElement;
	const searchInput = document.getElementById('searchInput') as HTMLInputElement;

	let displayedTasks: Task[] = [...tasks];

	if (filterStatus.value === 'completed') {
		displayedTasks = displayedTasks.filter(t => t.done);
	} else if (filterStatus.value === 'pending') {
		displayedTasks = displayedTasks.filter(t => !t.done);
	}

	const searchTerm = searchInput.value.toLowerCase();
	if (searchTerm) {
		displayedTasks = displayedTasks.filter(t => t.text.toLowerCase().includes(searchTerm));
	}

	if (sortOrder.value === 'date-asc') {
		displayedTasks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	} else if (sortOrder.value === 'date-desc') {
		displayedTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	} else if (sortOrder.value === 'status') {
		displayedTasks.sort((a, b) => Number(a.done) - Number(b.done));
	}

	list.innerHTML = '';
	for (const t of displayedTasks) {
		const li = document.createElement('li');
		li.textContent = t.text;
		if (t.done) li.classList.add('done');
		li.tabIndex = 0;
		li.classList.add('fade-in-item');

		const doneBtn = document.createElement('button');
		doneBtn.textContent = '☑';
		doneBtn.setAttribute('aria-label', `Mark "${t.text}" as done`);
		doneBtn.onclick = () => toggleDone(t.id);

		const delBtn = document.createElement('button');
		delBtn.textContent = 'X';
		delBtn.setAttribute('aria-label', `Remove "${t.text}"`);
		delBtn.onclick = () => removeTask(t.id);

		li.appendChild(doneBtn);
		li.appendChild(delBtn);
		list.appendChild(li);
	}

	totalCount.textContent = String(tasks.length);
	doneCount.textContent = String(currentDoneCount);

	const progressBarFill = document.querySelector('.progress-bar-fill') as HTMLElement | null;
	if (progressBarFill) {
		const totalTasks = tasks.length;
		const completedTasks = currentDoneCount;
		const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
		progressBarFill.style.width = `${progressPercentage}%`;
	}
}

interface PlaceholderTodo {
	id: number;
	title: string;
	completed: boolean;
}

async function fetchInitialTasks(): Promise<void> {
	try {
		const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = (await response.json()) as PlaceholderTodo[];
		data.forEach(item => {
			// Evita duplicati se i task sono già stati caricati da localStorage
			if (!tasks.some(t => t.id === item.id.toString())) {
				const id = item.id.toString();
				tasks.push({ id, text: item.title, done: item.completed, createdAt: new Date() });
			}
		});
		saveTasks();
		render();
	} catch (error) {
		console.error('Errore nel recupero dei task iniziali:', error);
	}
}

function addFakeTask(): void {
	const id = (Date.now() + 1).toString();
	tasks.push({ id, text: 'Compito di esempio (fake post)', done: false, createdAt: new Date() });
	saveTasks();
	render();
}

loadTasks();
fetchInitialTasks();
addFakeTask();

render();


