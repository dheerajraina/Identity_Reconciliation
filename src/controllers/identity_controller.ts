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
