const socket = io('ws://localhost:8080');
const inputForm = document.querySelector('form');
const textInput = document.querySelector('input');
const listWrapper = document.querySelector('ul');

inputForm.addEventListener('submit', function (e) {
	e.preventDefault();
	const messageText = textInput.value;
	if (messageText.trim().length === 0) return;
	socket.emit('message', messageText);
	textInput.value = '';
});

socket.on('server-messages', function (message) {
	const listItem = document.createElement('li');
	listItem.innerText = message;
	listWrapper.appendChild(listItem);
});

socket.on('error-messages', function (message) {
	const listItem = document.createElement('li');
	listItem.innerText = message;
	listItem.style.color = 'red';
	listItem.style.fontSize = '16px';
	listWrapper.appendChild(listItem);
});
