const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8000;
const fs = require("fs");
const spawn = require("child_process").spawn;
const gpio = require("rpi-gpio");
const channel = 17;
const server = express();
server.use(bodyParser.json());
server.use(cors());

server.get("/", (req, res) => {
	try {
		var dataToSend;
		// spawn new child process to call the python script
		const python = spawn("python", ["python/hello.py"]);

		// collect data from script
		python.stdout.on("data", function (data) {
			console.log("Pipe data from python script ...");
			dataToSend = data.toString();

			console.log("Python response:::", dataToSend);
		});

		// in close event we are sure that stream from child process is closed
		python.on("close", (code) => {
			console.log(`child process close all stdio with code ${code}`);
			// send data to browser
			res.status(200).json({
				message: "Python Response.",
				payload: dataToSend,
			});
		});

		
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

server.get("/listen", (req, res) => {
	try {

		function readInput(err) {
			console.log("pillup")
			if (err) {
				console.log("Error:", err);
			};

			gpio.read(channel, function (err, value) {
				if (err) {
					console.log("Error Reading:", err);
				};

				console.log("The value is " + value);
			});
		}

		console.log("got inside listen");

		

		gpio.setup(17, gpio.DIR_IN,  readInput);
		
		// res.status(200).json({
		// 	message: "node Response.",
		// 	payload: "",
		// });
	} catch (error) {
		res.status(500).json({
			error: error.message,
		});
	}
});

server.listen(port, (err) => {
	if (err) console.log(err);
	console.log(`server is listening on port ${port}`);

	gpio.on("export", function (channel) {
		console.log("Channel set: " + channel);
	});
});
