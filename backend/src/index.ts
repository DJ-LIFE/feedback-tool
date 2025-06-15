import express from "express";

const app = express();

app.get("/", (req, res) => {
	console.log("Hello From the Server");
	res.status(200).json({ success: "This is message for the success" });
});

app.listen(8081, () => {
	console.log("Server connection Properly");
});
