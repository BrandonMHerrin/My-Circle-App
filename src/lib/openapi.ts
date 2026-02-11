export function buildOpenApiSpec(baseUrl?: string) {
	return {
		openapi: "3.0.3",
		info: {
			title: "Relationships API",
			version: "1.0.0",
			description:
				"API for contacts/relationships. Auth via Supabase session cookies.",
		},
		servers: baseUrl ? [{ url: baseUrl }] : [{ url: "/" }],
		tags: [{ name: "Contacts" }],
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "sb-access-token",
					description:
						"Uses Supabase session cookies. If you're logged into the app, requests from Swagger UI will include cookies automatically.",
				},
			},
			schemas: {
				Contact: {
					type: "object",
					properties: {
						id: { type: "string", format: "uuid" },
						user_id: { type: "string", format: "uuid" },
						fname: { type: "string" },
						lname: { type: "string" },
						email: { type: "string", nullable: true },
						phone: { type: "string", nullable: true },
						relationship: {
							type: "string",
							enum: ["family", "friend", "colleague", "acquaintance", "other"],
							nullable: true,
						},
						dob: { type: "string", format: "date", nullable: true },
						notes: { type: "string", nullable: true },
						created_at: { type: "string", format: "date-time" },
						updated_at: { type: "string", format: "date-time" },
					},
					required: [
						"id",
						"user_id",
						"fname",
						"lname",
						"created_at",
						"updated_at",
					],
				},
				ContactCreate: {
					type: "object",
					properties: {
						fname: { type: "string", example: "Heitor" },
						lname: { type: "string", example: "Chaves" },
						email: {
							type: "string",
							example: "heitor@mail.com",
							nullable: true,
						},
						phone: { type: "string", example: "34998061533", nullable: true },
						relationship: {
							type: "string",
							enum: ["family", "friend", "colleague", "acquaintance", "other"],
							nullable: true,
						},
						dob: {
							type: "string",
							format: "date",
							example: "1993-06-28",
							nullable: true,
						},
						notes: {
							type: "string",
							example: "Notes testing!",
							nullable: true,
						},
					},
					required: ["fname", "lname"],
				},
				ContactUpdate: {
					type: "object",
					properties: {
						fname: { type: "string" },
						lname: { type: "string" },
						email: { type: "string", nullable: true },
						phone: { type: "string", nullable: true },
						relationship: {
							type: "string",
							enum: ["family", "friend", "colleague", "acquaintance", "other"],
							nullable: true,
						},
						dob: { type: "string", format: "date", nullable: true },
						notes: { type: "string", nullable: true },
					},
				},
				Error: {
					type: "object",
					properties: {
						error: {
							type: "object",
							properties: {
								message: { type: "string" },
								details: {},
							},
							required: ["message"],
						},
					},
				},
			},
			Reminder: {
				type: "object",
				properties: {
					id: { type: "string", format: "uuid" },
					user_id: { type: "string", format: "uuid" },
					contact_id: { type: "string", format: "uuid" },

					reminder_type: {
						type: "string",
						enum: ["birthday", "follow_up", "custom", "anniversary"],
					},
					status: {
						type: "string",
						enum: ["active", "dismissed", "completed"],
					},

					message: { type: "string", nullable: true },
					reminder_date: { type: "string", format: "date-time" },

					created_at: { type: "string", format: "date-time" },
					updated_at: { type: "string", format: "date-time" },

					contact: {
						type: "object",
						nullable: true,
						properties: {
							id: { type: "string", format: "uuid" },
							fname: { type: "string" },
							lname: { type: "string" },
							email: { type: "string", nullable: true },
							phone: { type: "string", nullable: true },
							relationship: {
								type: "string",
								enum: [
									"family",
									"friend",
									"colleague",
									"acquaintance",
									"other",
								],
								nullable: true,
							},
							dob: { type: "string", format: "date", nullable: true },
						},
					},
				},
				required: [
					"id",
					"user_id",
					"reminder_type",
					"status",
					"reminder_date",
					"created_at",
					"updated_at",
				],
			},

			ReminderCreate: {
				type: "object",
				properties: {
					contact_id: { type: "string", format: "uuid" },
					reminder_type: {
						type: "string",
						enum: ["birthday", "follow_up", "custom", "anniversary"],
						default: "custom",
					},
					message: {
						type: "string",
						nullable: true,
						example: "Ask about his new job",
					},
					reminder_date: {
						type: "string",
						format: "date-time",
						example: "2026-02-15T14:00:00.000Z",
					},
				},
				required: ["contact_id", "reminder_date"],
			},

			ReminderPatch: {
				type: "object",
				properties: {
					status: {
						type: "string",
						enum: ["active", "dismissed", "completed"],
					},
					reminder_date: { type: "string", format: "date-time" },
					message: { type: "string", nullable: true },
				},
			},
		},
		security: [{ cookieAuth: [] }],
		paths: {
			"/api/contacts": {
				get: {
					tags: ["Contacts"],
					summary: "List contacts",
					parameters: [
						{
							name: "limit",
							in: "query",
							schema: { type: "integer", default: 25, maximum: 100 },
						},
						{
							name: "offset",
							in: "query",
							schema: { type: "integer", default: 0, minimum: 0 },
						},
						{ name: "search", in: "query", schema: { type: "string" } },
						{
							name: "relationship",
							in: "query",
							schema: {
								type: "string",
								enum: [
									"family",
									"friend",
									"colleague",
									"acquaintance",
									"other",
								],
							},
						},
					],
					responses: {
						"200": {
							description: "List of contacts",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											data: {
												type: "array",
												items: { $ref: "#/components/schemas/Contact" },
											},
											pagination: {
												type: "object",
												properties: {
													limit: { type: "integer" },
													offset: { type: "integer" },
													total: { type: "integer" },
												},
												required: ["limit", "offset", "total"],
											},
										},
										required: ["data", "pagination"],
									},
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},
				post: {
					tags: ["Contacts"],
					summary: "Create contact",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ContactCreate" },
							},
						},
					},
					responses: {
						"201": {
							description: "Created",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											data: { $ref: "#/components/schemas/Contact" },
										},
										required: ["data"],
									},
								},
							},
						},
						"400": {
							description: "Validation error",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},
			},
			"/api/contacts/{id}": {
				get: {
					tags: ["Contacts"],
					summary: "Get contact by id",
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "string", format: "uuid" },
						},
					],
					responses: {
						"200": {
							description: "Contact",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											data: { $ref: "#/components/schemas/Contact" },
										},
										required: ["data"],
									},
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"404": {
							description: "Not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},
				put: {
					tags: ["Contacts"],
					summary: "Update contact",
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "string", format: "uuid" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ContactUpdate" },
							},
						},
					},
					responses: {
						"200": {
							description: "Updated",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											data: { $ref: "#/components/schemas/Contact" },
										},
										required: ["data"],
									},
								},
							},
						},
						"400": {
							description: "Validation error",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"404": {
							description: "Not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},
				delete: {
					tags: ["Contacts"],
					summary: "Delete contact",
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "string", format: "uuid" },
						},
					],
					responses: {
						"200": {
							description: "Deleted",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: { success: { type: "boolean" } },
										required: ["success"],
									},
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"404": {
							description: "Not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},
			},
			"/api/reminders": {
				get: {
					tags: ["Reminders"],
					summary: "List reminders (supports filtering, sorting, date range)",
					parameters: [
						{
							name: "limit",
							in: "query",
							schema: { type: "integer", default: 25, maximum: 100 },
						},
						{
							name: "offset",
							in: "query",
							schema: { type: "integer", default: 0, minimum: 0 },
						},

						{
							name: "status",
							in: "query",
							schema: {
								type: "string",
								enum: ["active", "dismissed", "completed"],
							},
						},
						{
							name: "type",
							in: "query",
							schema: {
								type: "string",
								enum: [
									"birthday",
									"follow_up",
									"custom",
									"anniversary",
								],
							},
						},
						{
							name: "contact_id",
							in: "query",
							schema: { type: "string", format: "uuid" },
						},

						// Date range on reminder_date
						{
							name: "start",
							in: "query",
							schema: { type: "string", format: "date-time" },
						},
						{
							name: "end",
							in: "query",
							schema: { type: "string", format: "date-time" },
						},

						// Sorting
						{
							name: "sort",
							in: "query",
							schema: {
								type: "string",
								enum: ["reminder_date", "created_at"],
								default: "reminder_date",
							},
						},
						{
							name: "order",
							in: "query",
							schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
						},

						// Convenience filter
						{ name: "upcoming", in: "query", schema: { type: "boolean" } },
					],
					responses: {
						"200": {
							description: "List of reminders",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											data: {
												type: "array",
												items: { $ref: "#/components/schemas/Reminder" },
											},
											pagination: {
												type: "object",
												properties: {
													limit: { type: "integer" },
													offset: { type: "integer" },
													total: { type: "integer" },
												},
												required: ["limit", "offset", "total"],
											},
										},
										required: ["data", "pagination"],
									},
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},

				post: {
					tags: ["Reminders"],
					summary: "Create a reminder",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ReminderCreate" },
							},
						},
					},
					responses: {
						"201": {
							description: "Created",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											data: { $ref: "#/components/schemas/Reminder" },
										},
										required: ["data"],
									},
								},
							},
						},
						"400": {
							description: "Validation error",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},
			},

			"/api/reminders/{id}": {
				patch: {
					tags: ["Reminders"],
					summary: "Update a reminder (dismiss / snooze / partial update)",
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "string", format: "uuid" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/ReminderPatch" },
							},
						},
					},
					responses: {
						"200": {
							description: "Updated",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											data: { $ref: "#/components/schemas/Reminder" },
										},
										required: ["data"],
									},
								},
							},
						},
						"400": {
							description: "Validation error",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"404": {
							description: "Not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},

				delete: {
					tags: ["Reminders"],
					summary: "Delete a reminder",
					parameters: [
						{
							name: "id",
							in: "path",
							required: true,
							schema: { type: "string", format: "uuid" },
						},
					],
					responses: {
						"200": {
							description: "Deleted",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: { success: { type: "boolean" } },
										required: ["success"],
									},
								},
							},
						},
						"401": {
							description: "Unauthorized",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
						"404": {
							description: "Not found",
							content: {
								"application/json": {
									schema: { $ref: "#/components/schemas/Error" },
								},
							},
						},
					},
				},
			},
		},
	} as const;
}
