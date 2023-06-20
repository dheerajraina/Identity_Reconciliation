import express from "express";
import { My_Sql_Database, connection } from "./databases/mysql";
import { Contact } from "./models/contact";
const app = express();
const port = 3000; // to be put into .env file
const database_ops = new My_Sql_Database();
database_ops.authenticate();

app.get("/", async (req, res) => {
	res.redirect("/identify");
});
app.get("/identify", async (req, res) => {
	res.send("Identity Reconciliation");
});

app.listen(port, () => {
	return console.log("Express App Listening at http://localhost:", port);
});
