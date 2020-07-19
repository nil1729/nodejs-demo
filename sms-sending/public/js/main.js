const submitBtn = document.querySelector('.submit-btn');
const selectedNum = document.getElementById('number');
const textArea = document.querySelector('textarea');
const numOptions = document.querySelectorAll('select option');
const alert = document.querySelector('.alert');
const response = document.querySelector('.response');
const closeBtn = document.querySelector('.close');

submitBtn.addEventListener('click', sendPost, false);
closeBtn.addEventListener('click', resetAlert, false);

function errorAlert(msg) {
	alert.classList.add('show');
	alert.classList.add('alert-danger');
	response.textContent = msg;
}

function resetAlert() {
	alert.classList.remove('show');
	alert.classList.remove('alert-danger');
	alert.classList.remove('alert-success');
}

function sendPost() {
	resetAlert();
	const number = numOptions[selectedNum.selectedIndex].textContent;
	const message = textArea.value;
	if (message == '') {
		errorAlert("Message Box Couldn't be remain Blank");
		return;
	}
	fetch('/', {
		method: 'post',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ number: number, message: message }),
	})
		.then(res => {
			textArea.value = '';
			selectedNum.selectedIndex = 0;
			return res.json();
		})
		.then(data => {
			resetAlert();
			alert.classList.add('show');
			alert.classList.add('alert-success');
			if (data.error) {
				alert.classList.add('alert-danger');
			}
			response.textContent =
				data.msg || "Couldn't Send Message Some Technical Issues Occured";
		})
		.catch(e => {
			console.log(e);
			errorAlert("Couldn't Send Message Some Technical Issues Occured");
		});
}
