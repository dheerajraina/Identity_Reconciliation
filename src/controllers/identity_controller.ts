import e, { Request, Response } from "express";
import Contact from "../models/contact";
import { Sequelize, and, Op } from "sequelize";

let phone_number_store: Map<string, boolean> = new Map();
let email_store: Map<string, boolean> = new Map();
let primary_id_store: Map<number, boolean> = new Map();
let oldest_record_id: number;
let newly_created_id: number;
let linked_emails_set: Set<string> = new Set();
let linked_phone_numbers_set: Set<string> = new Set();
let secondary_contact_ids: Set<number> = new Set();

async function identity_controller(req: Request, res: Response): Promise<void> {
	// Logic to fetch users from the database
	const req_email: string = req.body.email || "";
	const req_phone: string = req.body.phoneNumber || "";
	clear_all_globals();
	
	// THOUGHT: see if a function can be added here which sets two boolean varibles , for ex: email_exists , number_exists; and as soon as both of them are true break of of the find operation
	// above step might help us in getting rid of "store_all_phonenumbers_and_emails_and_primary_ids" function and will reduce time complexity greatly i think
	await Contact.findAll({
		where: Sequelize.or({ email: req_email }, { phoneNumber: req_phone }),
	}).then(async (result) => {
		if (result.length == 0) {
			await add_record(req_email, req_phone, null, "primary");
			return res.json({
				contact: {
					primaryContatctId: newly_created_id,
					emails: Array.from(email_store.keys()),
					phoneNumbers: Array.from(phone_number_store.keys()),
					secondaryContactIds: [],
				},
			});
		}
		await store_all_phonenumbers_and_emails_and_primary_ids(result);

		let primary_ids_list: number[] = await find_oldest_primary_record();

		if (await update_records(primary_ids_list, oldest_record_id)) {
			if (!phone_number_store.has(req_phone) || !email_store.has(req_email)) {
				if (
					req_email != null &&
					req_phone != null &&
					req_email.length > 0 &&
					req_phone.length > 0
				) {
					await add_record(req_email, req_phone, oldest_record_id, "secondary");
				}
			}
			await fetch_identity(oldest_record_id);
			// linked_emails_set.keys()), Array.from(linked_phone_numbers_set.keys())
			return res.json({
				contact: {
					primaryContatctId: oldest_record_id,
					emails: Array.from(linked_emails_set.keys()), // first element being email of primary contact
					phoneNumbers: Array.from(linked_phone_numbers_set.keys()), // first element being phoneNumber of primary contact
					secondaryContactIds: Array.from(secondary_contact_ids), // Array of all Contact IDs that are "secondary" to the primary contact
				},
			});
		} else {
			return res.status(201).json({
				message: "Server Error",
			});
		}
	});
}

// stores all the emails,phone numbers,primary ids
async function store_all_phonenumbers_and_emails_and_primary_ids(
	all_contacts
): Promise<void> {
	await all_contacts.forEach((contact) => {
		let contact_details = contact.dataValues;
		if (contact_details.phoneNumber) {
			let phone_number = contact_details.phoneNumber;
			if (!phone_number_store.has(phone_number)) {
				phone_number_store.set(phone_number, true);
			}
		}
		if (contact_details.email) {
			let email = contact_details.email;
			if (!email_store.has(email)) {
				email_store.set(email, true);
			}
		}
		if (contact_details.linkPrecedence == "primary") {
			let primary_id: number = contact_details.id;
			if (!primary_id_store.has(primary_id)) {
				primary_id_store.set(primary_id, true);
			}
		} else {
			let primary_id: number = contact_details.linkedId;
			if (!primary_id_store.has(primary_id)) {
				primary_id_store.set(primary_id, true);
			}
		}
	});

	return;
}

// find the oldest primary record if more than one primary records match with the request payload
function find_oldest_primary_record(): Promise<number[]> {
	return new Promise(async (resolve, reject) => {
		let primary_ids_list = Array.from(primary_id_store.keys());
		await Contact.findAll({
			where: {
				id: {
					[Op.in]: primary_ids_list,
				},
			},
		}).then(async (result) => {
			// sorts primary contacts in chronological manner

			result.sort((a, b) => a.dataValues.createdAt - b.dataValues.createdAt);

			oldest_record_id = result[0]?.dataValues.id;

			primary_ids_list = primary_ids_list.filter(
				(id) => id !== oldest_record_id
			);

			resolve(primary_ids_list);
		});
	});
}

async function add_record(
	email: string,
	phone_number: string,
	linkedId: number,
	linkPrecedence: string
) {
	await Contact.create({
		email: email,
		phoneNumber: phone_number,
		linkedId: linkedId,
		linkPrecedence: linkPrecedence,
	}).then((result) => {
		newly_created_id = result.dataValues.id;
	});

	if (phone_number) {
		if (!phone_number_store.has(phone_number)) {
			phone_number_store.set(phone_number, true);
		}
	}
	if (email) {
		if (!email_store.has(email)) {
			email_store.set(email, true);
		}
	}
	return;
}

// updates older records if any primary contact changes to secondary
async function update_records(target_id_list, replace_with): Promise<boolean> {
	try {
		await Contact.update(
			{ linkPrecedence: "secondary", linkedId: oldest_record_id },
			{
				where: Sequelize.or(
					{
						id: {
							[Op.in]: target_id_list,
						},
					},
					{
						linkedId: {
							[Op.in]: target_id_list,
						},
					}
				),
			}
		);
		return true;
	} catch (error) {
		return false;
	}
}


// THOUGHT: what if we just have a seperate collection for storing this information ; whenever a primary contact changes to secondary, the table updates
// Above thought if implemented successfully, it surely will take up space but will time complexity will reduce significantly
// fetching the primary contact and all the linked contacts
function fetch_identity(target_id): Promise<void> {
	return new Promise(async (resolve, reject) => {
		await Contact.findAll({
			where: Sequelize.or({ id: target_id }, { linkedId: target_id }),
		}).then((result) => {
			result.forEach((element) => {
				if (element.dataValues.id != target_id)
					secondary_contact_ids.add(element.dataValues.id);
				if (element.dataValues.email)
					linked_emails_set.add(element.dataValues.email);
				if (element.dataValues.phoneNumber)
					linked_phone_numbers_set.add(element.dataValues.phoneNumber);
			});
		});
		resolve();
	});
}

function clear_all_globals() {
	phone_number_store.clear();
	email_store.clear();
	primary_id_store.clear();
	oldest_record_id = null;
	newly_created_id = null;
	linked_emails_set.clear();
	linked_phone_numbers_set.clear();
	secondary_contact_ids.clear();
}
export default identity_controller;
