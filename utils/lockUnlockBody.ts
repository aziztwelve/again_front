export const lockUnlockBody = () => {
    const body = document.querySelector('body');

    const lock = () => body.classList.add('_lock');
    const unlock = () => body.classList.remove('_lock');
    const toggle = () => {
        if ( body.classList.contains('_lock') ) {
            unlock();
        } else  {
            lock()
        }
    };

    return {
        lock,
        unlock,
        toggle
    }
}