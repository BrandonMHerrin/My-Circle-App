const fetch = require("node-fetch");

async function testChat() {
    const res = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "how many contacts do I have?",
            history: [],
            context: { currentPage: "/dashboard" }
        })
    });

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

testChat();
