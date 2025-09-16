function resolvePreferredImpl() {
    const params = new URLSearchParams(window.location.search);
    const urlChoice = params.get('todos');
    if (urlChoice === 'array' || urlChoice === 'map') {
        localStorage.setItem('todos_impl', urlChoice);
        return urlChoice;
    }
    const stored = localStorage.getItem('todos_impl');
    if (stored === 'array' || stored === 'map') {
        return stored;
    }
    return 'array';
}
function loadScriptSequentially(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
}
async function bootstrap() {
    const impl = resolvePreferredImpl();
    const implSrc = impl === 'map' ? 'todo_map.js' : 'todo_array.js';
    await loadScriptSequentially(implSrc);
    await loadScriptSequentially('script.js');
    if (document.readyState !== 'loading') {
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }
    const ensureShown = () => {
        const bodyEl = document.body;
        const intro = document.getElementById('introVideoContainer');
        const modal = document.getElementById('callingCardModal');
        if (intro)
            intro.style.display = 'none';
        if (modal)
            modal.style.display = 'none';
        bodyEl.classList.remove('hide-main-content');
    };
    const skipBtn = document.getElementById('skipIntroButton');
    if (skipBtn) {
        skipBtn.addEventListener('click', ensureShown);
    }
    setTimeout(() => {
        if (document.body.classList.contains('hide-main-content')) {
            ensureShown();
        }
    }, 2000);
}
bootstrap().catch(err => {
    console.error('Bootstrap error:', err);
});
