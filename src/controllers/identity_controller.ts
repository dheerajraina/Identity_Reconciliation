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



// updates older records if any primary contact changes to secondary and adds a linkedId
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
