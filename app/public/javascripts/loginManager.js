const loginButton = document.querySelector('.login-button');
const loginForm = document.querySelector('.login-form');
const loginFormBox = document.querySelector('.form-box');
const loginFormContainer = document.querySelector('.form-container');
let formIsVisible = false;

loginButton.addEventListener('click', () => {
    if(!formIsVisible)
    {
        formIsVisible = true;
        loginFormContainer.style.display = 'block';
        loginFormContainer.classList.add('form-bg-blur-animation');
        loginFormBox.classList.add('form-enter-animation');
    } else if(formIsVisible) {
        formIsVisible = false;
        loginFormContainer.style.display = 'none';
        loginFormContainer.classList.remove('form-bg-blur-animation');
        loginFormBox.classList.remove('form-enter-animation');
    }
});