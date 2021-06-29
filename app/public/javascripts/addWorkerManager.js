const workerButton = document.querySelector('.add-worker-button');
const portFormContainer = document.querySelector('.form-container');
const portFormBox = document.querySelector('.form-box');

workerButton.addEventListener('click', () => {
    portFormContainer.style.display = 'block';
    portFormContainer.classList.add('form-bg-blur-animation');
    portFormBox.classList.add('form-enter-animation');
});