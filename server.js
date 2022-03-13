const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8000;
const fs = require("fs");

const server = express();
server.use(bodyParser.json());
server.use(cors());

server.get("/", (req, res) => {
	try {

		res.status(200).json({
			message: "Ok",
			payload: "--",
		});
		
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

server.listen(port, (err) => {
	if (err) console.log(err);
	console.log(`server is listening on port ${port}`);
});
