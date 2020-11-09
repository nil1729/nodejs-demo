const http = require('http');

let todos = [
	{ id: 1, text: 'Todo One' },
	{ id: 2, text: 'Todo Two' },
	{ id: 3, text: 'Todo Three' },
];

const server = http.createServer((req, res) => {
	const { method, url } = req;
	const URLRegex = /todos\/+[0-9]*$/;
	let body = [];

	req
		.on('data', (chunks) => body.push(chunks))
		.on('end', () => {
			let statusCode = 404;
			let response = {
				success: false,
				data: null,
			};

			body = Buffer.concat(body).toString();

			if (method === 'GET' && url === '/todos') {
				statusCode = 200;
				response.success = true;
				response.data = todos;
			}
			if (method === 'POST' && url === '/todos') {
				let todo;
				try {
					todo = JSON.parse(body);
				} catch (error) {
					console.log(error);
					todo = {};
				}
				if (todo && (!todo.id || !todo.text)) {
					statusCode = 400;
					response.error = 'Please add all fields';
				} else {
					const { id, text } = todo;
					const dupIndex = todos.findIndex((todo) => todo.id === id);
					if (dupIndex !== -1) {
						statusCode = 400;
						response.error = 'Duplicate entry found';
					} else {
						todos.push({
							id,
							text,
						});
						statusCode = 200;
						response.success = true;
						response.data = todos[todos.length - 1];
					}
				}
			}

			if (method === 'PUT' && URLRegex.test(url)) {
				const id = parseInt(url.split('/').pop());
				const foundIndex = todos.findIndex((todo) => todo.id === id);

				if (foundIndex > -1) {
					let updatedTodo;
					try {
						updatedTodo = JSON.parse(body);
					} catch (error) {
						console.log(error);
						updatedTodo = {};
					}
					if (updatedTodo.text) {
						todos = todos.map((todo) => {
							if (todo.id === id) {
								return {
									...todo,
									text: updatedTodo.text,
								};
							}
							return todo;
						});

						response.success = true;
						statusCode = 200;
						response.data = todos[foundIndex];
					} else {
						statusCode = 400;
						response.error =
							'Please add some required fields to update requested resource';
					}
				} else {
					response.error = 'No todo found for requested id';
				}
			}

			if (method === 'DELETE' && URLRegex.test(url)) {
				const id = parseInt(url.split('/').pop());
				const foundIndex = todos.findIndex((todo) => todo.id === id);

				if (foundIndex > -1) {
					response.data = todos[foundIndex];
					response.success = true;
					statusCode = 200;

					todos = todos.filter((todo) => todo.id !== id);
				} else {
					response.error = 'No todo found for requested id';
				}
			}

			res.writeHead(statusCode, {
				'Content-Type': 'application/json',
				'X-Powered-By': 'NodeJS',
			});

			res.end(JSON.stringify(response));
		});
});

const PORT = 5000;

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
