const loginButton = document.querySelector('.login-button');
const loginForm = document.querySelector('.login-form');

loginButton.addEventListener('click', () => {
    console.log("login yes");
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let obj ={
        email: document.querySelector('#login-email').value,
        password: document.querySelector('#login-password').value
    };

    fetch('/api/login', {method: 'POST', body: obj});

});