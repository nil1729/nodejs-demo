const form = document.getElementById('add-form');
const submitBtn = document.querySelector('#add-form .btn');
const storeId = document.getElementById('storeId');
const storeAddress = document.getElementById('address');
form.addEventListener('submit', async function (e) {
	e.preventDefault();
	if (storeId.value.trim().length === 0) {
		alert('Please enter the Store ID');
		return;
	}
	if (storeAddress.value.trim().length === 0) {
		alert('Please enter the Store Address');
		return;
	}
	const requestData = {
		storeId: storeId.value,
		address: storeAddress.value,
	};
	storeId.value = '';
	storeAddress.value = '';
	submitBtn.setAttribute('disabled', true);
	submitBtn.textContent = 'Loading ...';
	const res = await sendRequest(requestData);
	if (res.success) {
		alert('Store Added');
		window.location.href = '/index.html';
	} else {
		alert(res.error);
	}

	submitBtn.textContent = 'Add Store';
	submitBtn.removeAttribute('disabled');
});

const sendRequest = async (requestData) => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: JSON.stringify(requestData),
		redirect: 'follow',
	};
	const response = await fetch('/api/v1/stores', requestOptions);
	const JSONData = await response.json();
	return JSONData;
};
