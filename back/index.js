const {stock} = require("./stock");
const express = (require("express"))();
const express_ws = require("express-ws")(express);

express.ws("/", websocket => websocket.on("message", message => {
	message = JSON.parse(message);
	const {data} = message;
	switch (message.type) {
		case "get all stock": // Sends the entire stock inventory to new clients
			websocket.send(JSON.stringify(stock));
			break;
		case "edit stock amount": // If a client updates the stock amount, the amount is updated for all clients
			const stock_item = stock[data.name];
			if (stock_item.amount + data.edit_amount < 0) return;
			stock_item.amount += data.edit_amount;
			express_ws.getWss().clients.forEach(client => client.send(JSON.stringify({
				[data.name]: {
					amount: stock_item.amount
				}
			})));
			break;
	}
}));

express.listen(5000);