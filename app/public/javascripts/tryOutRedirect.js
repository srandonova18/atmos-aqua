const tryOutButton = document.querySelector('.try-app-button');

tryOutButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/create-port';
    console.log("hello");
});