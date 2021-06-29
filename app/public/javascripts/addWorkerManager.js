const workerButton = document.querySelector('.add-worker-button');
const portFormContainer = document.querySelector('.form-container');
const portFormBox = document.querySelector('.form-box');
const workerPassword = document.querySelector('#worker-pass');
const workerForm = document.querySelector('.worker-form');

workerButton.addEventListener('click', () => {
    portFormContainer.style.display = 'block';
    portFormContainer.classList.add('form-bg-blur-animation');
    portFormBox.classList.add('form-enter-animation');
});

// workerForm.onSubmit = function(e) {
//     workerPassword.value = new Hashes.SHA256().hex(workerPassword.value);
//     return true;
// }
