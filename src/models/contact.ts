import { Sequelize, DataTypes } from "sequelize";
import { connection as sequelize } from "../databases/mysql";

const Contact = sequelize.define("Contact", {
	phoneNumber: { type: DataTypes.STRING, allowNull: true },
	email: { type: DataTypes.STRING, allowNull: true },
	linkedId: { type: DataTypes.INTEGER, allowNull: true },
	linkPrecedence: {
		type: DataTypes.ENUM,
		values: ["primary", "secondary"],
		defaultValue: "primary",
	},
	deletedAt: { type: DataTypes.DATE, allowNull: true },

	// createdAt and updatedAt added by default
});

export  default Contact ;
