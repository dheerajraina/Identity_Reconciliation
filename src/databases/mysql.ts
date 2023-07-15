import { Sequelize } from "sequelize";
export const connection = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,

	{
		host: process.env.DB_HOST,
		dialect: "mysql",
		logging: true,
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
