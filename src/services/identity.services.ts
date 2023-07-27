import Contact from "../models/contact";
import { Sequelize } from "sequelize";

class IdentityServices {
	public async findAllContactsWithSameEmailOrPhone(
		phoneNumber: string,
		email: string
	){
		const contacts = await Contact.findAll({
			where: Sequelize.or({ email: email }, { phoneNumber: phoneNumber }),
		},);
		return contacts;
	}
}

export default IdentityServices;
