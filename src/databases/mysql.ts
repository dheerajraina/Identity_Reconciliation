import { Sequelize } from "sequelize";
export const connection = new Sequelize(
	"identity_reconciliation",
	"root",
	"G7mpxMhN",

	{
		host: "localhost",
		dialect: "mysql",
                logging:true
	}
);
export class My_Sql_Database {
	async authenticate(): Promise<void> {
		try {
			await connection.authenticate();
			console.log("Connection has been established successfully.");
		} catch (error) {
			console.error("Unable to connect to the database:", error);
		}
	}
}
