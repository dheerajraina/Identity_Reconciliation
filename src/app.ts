import express from "express";

import cors from "cors";
import "dotenv/config";

import { My_Sql_Database, connection } from "./databases/mysql";
import Contact from "./models/contact";
import identity_controller from "./controllers/identity_controller";
const app = express();
const port = 3000; // to be put into .env file
const database_ops = new My_Sql_Database();

database_ops.authenticate();

app.use(express.json());

app.get("/", async (req, res) => {
	res.redirect("/identify");
});
app.post("/identify", identity_controller);
app.get("/clear-identify", async (req, res) => {
	Contact.destroy({ where: {} });
	res.status(200).json({message:'All data from table deleted'});
});

app.listen(port, () => {
	return console.log("Express App Listening at http://localhost:", port);
});
