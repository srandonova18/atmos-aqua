const loginArea = document.querySelector('#num');
const loginButton = document.querySelector('#button');

loginButton.addEventListener('click', (e) => {
  e.preventDefault();

  window.location.replace(`/api/get-shipment/${loginArea.value}`);
});