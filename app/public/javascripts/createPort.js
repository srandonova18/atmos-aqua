const createButton = document.querySelector('.create-port-button');
const mapElement = document.querySelector('#map');
const instructions = document.querySelector('.instructions');

createButton.addEventListener('click', () => {
    mapElement.style.filter = 'blur(0px)';
    createButton.style.display = 'none';
    instructions.style.display = 'block';
});