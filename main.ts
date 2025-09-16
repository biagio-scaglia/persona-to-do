type TodosImpl = 'array' | 'map';

function resolvePreferredImpl(): TodosImpl {
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

function loadScriptSequentially(src: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
}

async function bootstrap(): Promise<void> {
    const impl: TodosImpl = resolvePreferredImpl();
    const implSrc = impl === 'map' ? 'todo_map.js' : 'todo_array.js';

    if (document.readyState === 'loading') {
        await new Promise<void>(resolve => {
            document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
        });
    }

    await loadScriptSequentially(implSrc);
    await loadScriptSequentially('script.js');
}

bootstrap().catch(err => {
    console.error('Bootstrap error:', err);
});
