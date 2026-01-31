import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

async function testInsert() {
    try {
        console.log("Testing insert into 'contacts' with 'user_id'...");
        const testPayload = {
            fname: "Test",
            lname: "User",
            relationship: "friend",
            user_id: "9640b5e7-8d46-45d8-a3e5-aac73844c365" // Use the ID found earlier
        };

        const { data, error } = await supabase
            .from("contacts")
            .insert([testPayload])
            .select();

        if (error) {
            console.error("Insert failed:", error.message);
            console.error("Error details:", error);
        } else {
            console.log("SUCCESS: Insert worked!", data);

            // Clean up
            if (data && data[0]) {
                console.log("Cleaning up test contact...");
                await supabase.from("contacts").delete().eq("id", data[0].id);
            }
        }
    } catch (err) {
        console.error("Fatal error during test:", err);
    }
}

testInsert();
