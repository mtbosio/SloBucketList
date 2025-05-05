// js/dark-mode-toggle.js
// wait until the body exists
window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('change', event => {
        if (event.target.type === 'checkbox') {
            event.currentTarget.classList.toggle(
                'dark-mode',
                event.target.checked
            );
        }
    });
});
