const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8000;
const fs = require("fs");
const spawn = require("child_process").spawn;
const gpio = require("rpi-gpio");
const channel = 11; // which is GPIO17 that is used in python.
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

		gpio.setup(channel, gpio.DIR_IN, gpio.EDGE_BOTH, readInput);

		function readInput(err) {
			try{

				console.log("pillup");
		

				gpio.on("change", function (channel, value) {

					console.log("The value changed " + value);

					gpio.read(channel, function (err, value) {
						if (err) {
							console.log("Error Reading:", err.message);
							return;
						}

						console.log("The value is " + value);
					});
				});


			}catch(error){
				console.log("error", error)
			}
			
		}

		console.log("got inside listen");

		
		
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
