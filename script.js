document.addEventListener('DOMContentLoaded', () => {
    const callingCardModal = document.getElementById('callingCardModal');
    const closeButton = document.querySelector('.calling-card-modal .close-button');
    const introVideoContainer = document.getElementById('introVideoContainer');
    const introVideo = document.getElementById('introVideo'); // Riferimento all'elemento <video>
    const body = document.body;
    const skipIntroButton = document.getElementById('skipIntroButton');

    // Funzione per mostrare il contenuto principale del sito
    const showMainContent = () => {
        body.classList.remove('hide-main-content');
        if (callingCardModal) {
            callingCardModal.style.display = 'none';
        }
        // Ferma il video quando il contenuto principale viene mostrato
        if (introVideo) {
            introVideo.pause();
        }
    };

    // Funzione per mostrare il modale della Calling Card
    const showCallingCard = () => {
        if (introVideoContainer) {
            introVideoContainer.style.display = 'none';
            // Ferma il video quando il modale viene mostrato
            if (introVideo) {
                introVideo.pause();
            }
        }
        if (callingCardModal) {
            callingCardModal.style.display = 'flex';
        }
    };

    // Inizializza il sito: mostra il video, nascondi modale e contenuto principale
    if (introVideoContainer) {
        body.classList.add('hide-main-content'); // Nascondi il contenuto principale
        introVideoContainer.style.display = 'flex'; // Mostra il contenitore del video
        if (callingCardModal) {
            callingCardModal.style.display = 'none';
        }
        // Avvia la riproduzione del video (l'autoplay è già gestito dall'attributo)
        // introVideo.play().catch(error => { ... }); // Rimosso, autoplay gestito da attributo
    }

    // Gestione chiusura modale Calling Card
    const handleModalClose = () => {
        if (callingCardModal) {
            callingCardModal.style.display = 'none';
            showMainContent(); // Mostra il contenuto principale dopo la chiusura del modale
        }
    };

    if (closeButton) {
        closeButton.addEventListener('click', handleModalClose);
    }

    window.addEventListener('click', (event) => {
        if (event.target == callingCardModal) {
            handleModalClose();
        }
    });

    // Gestione skip video con il pulsante
    if (skipIntroButton) {
        skipIntroButton.addEventListener('click', showCallingCard);
    }

    // Gestione fine video: mostra la Calling Card
    if (introVideo) {
        introVideo.addEventListener('ended', showCallingCard);
    }

    // Gestione skip modale con Enter (mantiene questa funzionalità)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (introVideoContainer && introVideoContainer.style.display === 'flex') {
                showCallingCard(); // Skippa il video con Enter
            } else if (callingCardModal && callingCardModal.style.display === 'flex') {
                handleModalClose(); // Chiude il modale con Enter
            }
        }
    });

    // Funzionalità All-Out Attack (esistente)
    const allOutAttackBtn = document.getElementById('allOutAttackBtn');
    const allOutAttackOverlay = document.getElementById('allOutAttackOverlay');

    if (allOutAttackBtn && allOutAttackOverlay) {
        allOutAttackBtn.addEventListener('click', () => {
            allOutAttackOverlay.style.display = 'block';
            allOutAttackOverlay.classList.add('active');
            
            allOutAttackOverlay.addEventListener('animationend', () => {
                allOutAttackOverlay.classList.remove('active');
                allOutAttackOverlay.style.display = 'none';
            }, { once: true });
        });
    }
});

// Funzionalità per la gestione dei personaggi
const characterNameInput = document.getElementById('characterNameInput');
const characterImageInput = document.getElementById('characterImageInput');
const addCharacterBtn = document.getElementById('addCharacterBtn');
const charactersGrid = document.querySelector('.characters-grid');

// Carica i personaggi da localStorage o usa quelli predefiniti
let characters = new Map(JSON.parse(localStorage.getItem('phantomTasksCharacters') || '[]'));

if (characters.size === 0) {
    // Aggiungi personaggi predefiniti solo se non ce ne sono in localStorage
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

function addDefaultCharacter(id, name, imageUrl, description) {
    if (!characters.has(id)) {
        characters.set(id, { name, imageUrl, description });
        saveCharacters();
    }
}

function saveCharacters() {
    localStorage.setItem('phantomTasksCharacters', JSON.stringify(Array.from(characters.entries())));
}

function renderCharacters() {
    charactersGrid.innerHTML = ''; // Pulisce la griglia corrente
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

        // Aggiungi listener per il pulsante di rimozione
        const removeBtn = card.querySelector('.remove-character-btn');
        removeBtn.addEventListener('click', () => removeCharacter(id));

        charactersGrid.appendChild(card);
    });
}

function addCharacter() {
    const name = characterNameInput.value.trim();
    let imageUrl = characterImageInput.value.trim();
    const description = ""; // Puoi espandere per aggiungere anche la descrizione

    if (!name) {
        alert('Il nome del personaggio non può essere vuoto!');
        return;
    }

    if (!imageUrl) {
        imageUrl = 'https://via.placeholder.com/150x200.png?text=No+Image'; // Placeholder se l'URL è vuoto
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-'); // Genera un ID semplice
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

function removeCharacter(id) {
    if (confirm('Sei sicuro di voler rimuovere questo personaggio?')) {
        characters.delete(id);
        saveCharacters();
        renderCharacters();
    }
}

addCharacterBtn.addEventListener('click', addCharacter);

// Inizializza il rendering dei personaggi al caricamento
renderCharacters();
