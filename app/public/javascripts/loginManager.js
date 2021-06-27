const loginButton = document.querySelector('.login-button');
const loginForm = document.querySelector('.login-form');

loginButton.addEventListener('click', () => {
    console.log("login yes");
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let obj ={
        email: document.querySelector('#login-email').value,
        password: new Hashes.MD5().hex(document.querySelector('#login-password').value)
    };

    fetch('/api/login', {method: 'POST', body: obj});

    console.log(obj);

});