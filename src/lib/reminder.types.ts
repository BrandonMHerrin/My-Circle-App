export type ReminderStatus = "active" | "snoozed" | "dismissed" | "completed";
export type ReminderType =
	| "birthday"
	| "follow_up"
	| "custom"
	| "anniversary"
	| "other";

export type ContactMini = {
	id: string;
	first_name: string;
	last_name: string;
	email: string | null;
	phone: string | null;
	relationship: string | null;
	dob: string | null;
};

export type Reminder = {
	id: string;
	user_id: string;

	contact_id: string | null; // optional if reminder isn't tied to a contact
	type: ReminderType;
	status: ReminderStatus;

	title: string;
	message: string | null;

	remind_at: string; // timestamptz string
	snoozed_until: string | null; // timestamptz string

	created_at: string;
	updated_at: string;

	contact?: ContactMini | null; // populated when we join contacts
};
