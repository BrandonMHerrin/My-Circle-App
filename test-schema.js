const { z } = require("zod");
const { zodSchema } = require("ai");

const contactsListQuerySchemaAI = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
	search: z.string().optional(),
});

const schema = zodSchema(contactsListQuerySchemaAI);
console.log("AI Schema:", JSON.stringify(schema, null, 2));
console.log("AI Schema Keys:", Object.keys(schema));
