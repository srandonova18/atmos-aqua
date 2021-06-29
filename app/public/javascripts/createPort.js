const createButton = document.querySelector('.create-port-button');
const finishSelButton = document.querySelector('.finish-selection-button');
const mapElement = document.querySelector('#map');
const instructions = document.querySelector('.instructions');
const portFormContainer = document.querySelector('.form-container');
const portFormBox = document.querySelector('.form-box');

createButton.addEventListener('click', () => {
    mapElement.style.filter = 'blur(0px)';
    createButton.style.display = 'none';
    instructions.style.display = 'block';
    finishSelButton.style.display = 'block';
});

finishSelButton.addEventListener('click', () => {
    portFormContainer.style.display = 'block';
    portFormContainer.classList.add('form-bg-blur-animation');
    portFormBox.classList.add('form-enter-animation');
    finishSelButton.style.display = 'none';
});