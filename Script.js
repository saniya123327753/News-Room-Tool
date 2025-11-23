// Add News Article
async function addNews() {
    let text = document.getElementById("newsInput").value.trim();
    if (!text) return;

    await fetch("http://localhost:5000/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
    });

    loadNews();
}

// Load Articles
async function loadNews() {
    let res = await fetch("http://localhost:5000/articles");
    let data = await res.json();

    let list = document.getElementById("newsList");
    list.innerHTML = "";

    data.forEach(item => {
        let div = document.createElement("div");
        div.textContent = item.content;
        list.appendChild(div);
    });
}

// AI Summary (simple)
function generateSummary() {
    let text = document.getElementById("summaryText").value;
    let summary = text.split(" ").slice(0, 20).join(" ") + "... (summary)";
    document.getElementById("summaryOutput").innerText = summary;
}

// Send Message
async function sendMessage() {
    let msg = document.getElementById("teamMessage").value.trim();
    if (!msg) return;

    await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    });

    loadMessages();
}

// Load Messages
async function loadMessages() {
    let res = await fetch("http://localhost:5000/messages");
    let data = await res.json();

    let list = document.getElementById("messageList");
    list.innerHTML = "";

    data.forEach(m => {
        let div = document.createElement("div");
        div.textContent = m.message;
        list.appendChild(div);
    });
}

// Auto Load on Start
loadNews();
loadMessages();