export type ReminderStatus = "active" | "dismissed" | "completed";
export type ReminderType = "birthday" | "follow_up" | "custom" | "anniversary";

export type ContactMini = {
	id: string;
	fname: string;
	lname: string;
	email: string | null;
	phone: string | null;
	relationship: string | null;
	dob: string | null;
};

export type Reminder = {
	id: string;
	user_id: string;

	contact_id: string;
	reminder_type: ReminderType;
	status: ReminderStatus;

	message: string | null;
	reminder_date: string;

	created_at: string;
	updated_at: string;

	contact?: ContactMini | null; // populated when we join contacts
};
