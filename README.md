## Phantom Tasks (Persona 5 Style To‑Do)

Un'app To‑Do ispirata allo stile di Persona 5. Gestisci le tue attività con UI animata, progress bar, filtro/ordinamento, e un roster di personaggi.

Repo: `https://github.com/biagio-scaglia/persona-to-do`

### Caratteristiche principali
- **Aggiunta/gestione task**: aggiungi, completa, elimina, svuota tutti, rimuovi completati
- **Filtri e ordinamento**: per stato, ricerca testuale, data, stato
- **Persistenza**: `localStorage`
- **Progress bar**: percentuale di completamento
- **Intro e chiamata “Calling Card”**: video iniziale, overlay animato “All‑Out Attack!”
- **Roster personaggi**: gestione con `localStorage`
- **Due implementazioni To‑Do**: basate su `Array` o `Map`, selezionabili

### Struttura
- `index.html`: UI e inclusione script
- `style.css`: stile Persona 5
- `main.ts` → `main.js`: bootstrap che carica l’implementazione To‑Do scelta e poi `script.js`
- `todo_array.ts` → `todo_array.js`: implementazione To‑Do con `Array`
- `todo_map.ts` → `todo_map.js`: implementazione To‑Do con `Map`
- `script.ts` → `script.js`: logiche UI extra (intro, overlay, roster, post demo)

### Requisiti
- Node.js 18+ (per compilare TypeScript)

### Installazione
```bash
npm install
```

### Build TypeScript
```bash
npm run build
```
Genera i `.js` da `*.ts` (richiede `tsconfig.json`).

### Sviluppo (watch)
```bash
npm run watch
```

### Avvio locale
È un progetto statico: apri `index.html` nel browser.
Su Windows (PowerShell) puoi usare:
```bash
npm start
```

### Selezione implementazione To‑Do (Array vs Map)
Il bootstrap in `main.ts`/`main.js` sceglie quale script caricare:
- Parametro URL: `?todos=array` oppure `?todos=map`
  - Esempi: `index.html?todos=map`, `index.html?todos=array`
- Preferenza persistente in `localStorage` sotto la chiave `todos_impl`
- Default: `array`

### Storage keys
- Array: `persona_todos_array`
- Map: `persona_todos`
- Personaggi: `phantomTasksCharacters`

### Note di accessibilità
- Elementi task con `tabIndex`, pulsanti con `aria-label`

### Credits
- Sviluppo: [biagio-scaglia](https://github.com/biagio-scaglia)
- Musica/immagini/video: asset dimostrativi/placeholder, non affiliati ad Atlus o Persona 5.


