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
