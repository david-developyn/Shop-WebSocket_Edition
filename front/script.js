const stock = {};
const server_connection = new WebSocket('ws://localhost:5000');

// Asks for the entire stock inventory
server_connection.addEventListener("open", () => server_connection.send(JSON.stringify({
	type: "get all stock"
})));

server_connection.addEventListener("message", event => {
	const data = JSON.parse(event.data);
	Object.keys(data).forEach(stock_name => {
		// Adds new stock types to the stock list
		if (!(stock_name in stock)) {
			stock[stock_name] = {};
			document.getElementById("stock").innerHTML += `
				<div id="${stock_name}">
					<h2>${stock_name}</h2>
					<h3 class="inline">Amount: <span class="amount"></span></h3>
					<button onclick="edit_amount('${stock_name}', 1)">Add</button>
					<button onclick="edit_amount('${stock_name}', -1)">Remove</button>
					<h3>Price: £<span class="price"></span></h3>
				</div>
			`;
		}

		// Updates existing stock
		Object.keys(data[stock_name]).forEach(property => {
			document.querySelector(`#${stock_name} .${property}`).textContent = data[stock_name][property];
			stock[stock_name][property] = data[stock_name][property];
		});
	});

	// Calculates the new total stock worth every update
	let total_worth = 0;
	Object.keys(stock).forEach(stock_name => total_worth += stock[stock_name].amount * stock[stock_name].price);
	document.getElementById("total_worth").innerText = total_worth;
});

// Asks to edit a stock's amount
const edit_amount = (name, edit_amount) => {
	server_connection.send(JSON.stringify({
		type: "edit stock amount",
		data: {
			name,
			edit_amount
		}
	}));
};