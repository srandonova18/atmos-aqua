const loginButton = document.querySelector('.login-button');
const loginForm = document.querySelector('.login-form');
const loginFormContainer = document.querySelector('.form-container');
let formIsVisible = false;

loginButton.addEventListener('click', () => {
    if(!formIsVisible)
    {
        formIsVisible = true;
        loginFormContainer.style.display = 'block';
    } else if(formIsVisible) {
        formIsVisible = false;
        loginFormContainer.style.display = 'none';
    }
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