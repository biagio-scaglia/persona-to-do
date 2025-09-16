type Nullable<T> = T | null;

interface Character {
	name: string;
	imageUrl: string;
	description: string;
}

document.addEventListener('DOMContentLoaded', () => {
	const allOutAttackBtn = document.getElementById('allOutAttackBtn') as Nullable<HTMLButtonElement>;
	const allOutAttackOverlay = document.getElementById('allOutAttackOverlay') as Nullable<HTMLDivElement>;

	if (allOutAttackBtn && allOutAttackOverlay) {
		allOutAttackBtn.addEventListener('click', () => {
			allOutAttackOverlay.style.display = 'block';
			allOutAttackOverlay.classList.add('active');

			allOutAttackOverlay.addEventListener(
				'animationend',
				() => {
					allOutAttackOverlay.classList.remove('active');
					allOutAttackOverlay.style.display = 'none';
				},
				{ once: true }
			);
		});
	}
});

const characterNameInput = document.getElementById('characterNameInput') as HTMLInputElement;
const characterImageInput = document.getElementById('characterImageInput') as HTMLInputElement;
const addCharacterBtn = document.getElementById('addCharacterBtn') as HTMLButtonElement;
const charactersGrid = document.querySelector('.characters-grid') as HTMLDivElement;

let characters: Map<string, Character> = new Map(
	JSON.parse(localStorage.getItem('phantomTasksCharacters') || '[]')
);

if (characters.size === 0) {
	addDefaultCharacter('joker', 'Joker', 'img/joker.webp', 'Leader of the Phantom Thieves.');
	addDefaultCharacter('ryuji', 'Ryuji Sakamoto (Skull)', 'img/ryuji.webp', 'The rebellious ex-track star.');
	addDefaultCharacter('morgana', 'Morgana (Mona)', 'img/morgana.webp', 'The mysterious feline companion.');
	addDefaultCharacter('ann', 'Ann Takamaki (Panther)', 'img/ann.png', 'The charming and passionate model.');
	addDefaultCharacter('yusuke', 'Yusuke Kitagawa (Fox)', 'img/yusuke.webp', 'The artistic and eccentric prodigy.');
	addDefaultCharacter('makoto', 'Makoto Niijima (Queen)', 'img/makoto.webp', 'The disciplined student council president.');
	addDefaultCharacter('futaba', 'Futaba Sakura (Oracle)', 'img/futaba.webp', 'The brilliant but reclusive hacker.');
	addDefaultCharacter('haru', 'Haru Okumura (Noir)', 'img/haru.webp', 'The kind-hearted heiress.');
	addDefaultCharacter('akechi', 'Goro Akechi (Crow)', 'img/akechi.webp', 'The charismatic detective prince.');
}

function addDefaultCharacter(id: string, name: string, imageUrl: string, description: string): void {
	if (!characters.has(id)) {
		characters.set(id, { name, imageUrl, description });
		saveCharacters();
	}
}

function saveCharacters(): void {
	localStorage.setItem('phantomTasksCharacters', JSON.stringify(Array.from(characters.entries())));
}

function renderCharacters(): void {
	charactersGrid.innerHTML = '';
	characters.forEach((char, id) => {
		const card = document.createElement('div');
		card.classList.add('character-card');
		card.dataset.id = id;

		card.innerHTML = `
			<img src="${char.imageUrl}" alt="${char.name}" onerror="this.src='https://via.placeholder.com/150x200.png?text=No+Image';">
			<h3>${char.name}</h3>
			<p>${char.description}</p>
			<button class="remove-character-btn">X</button>
		`;

		const removeBtn = card.querySelector('.remove-character-btn') as HTMLButtonElement | null;
		if (removeBtn) {
			removeBtn.addEventListener('click', () => removeCharacter(id));
		}

		charactersGrid.appendChild(card);
	});
}

function addCharacter(): void {
	const name = characterNameInput.value.trim();
	let imageUrl = characterImageInput.value.trim();
	const description = '';

	if (!name) {
		alert('Il nome del personaggio non può essere vuoto!');
		return;
	}

	if (!imageUrl) {
		imageUrl = 'https://via.placeholder.com/150x200.png?text=No+Image';
	}

	const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
	if (characters.has(id)) {
		alert('Un personaggio con questo nome esiste già!');
		return;
	}

	characters.set(id, { name, imageUrl, description });
	saveCharacters();
	renderCharacters();
	characterNameInput.value = '';
	characterImageInput.value = '';
}

function removeCharacter(id: string): void {
	if (confirm('Sei sicuro di voler rimuovere questo personaggio?')) {
		characters.delete(id);
		saveCharacters();
		renderCharacters();
	}
}

addCharacterBtn.addEventListener('click', addCharacter);

renderCharacters();

interface PostPayload {
	title: string;
	body: string;
	userId: number;
}

async function postData(): Promise<void> {
	try {
		const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: 'Persona 5',
				body: 'persona 5 è un gioco di ruolo',
				userId: 1
			} satisfies PostPayload)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log('Success:', data);
		const postResponse = document.getElementById('post-response') as HTMLElement | null;
		if (postResponse) {
			postResponse.innerHTML = `
				<h3>Infiltrato! Dati acquisiti dal Metaverso:</h3>
				<pre>${JSON.stringify(data, null, 2)}</pre>
				<p>Missione compiuta! Il messaggio è stato inviato e la volontà è stata cambiata.</p>
			`;
		}
	} catch (error) {
		console.error('Errore nella trasmissione! Contatta i Phantom Thieves:', error);
	}
}

postData();


