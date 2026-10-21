// Translation Dictionary
const translations = {
    ar: {
        new_chat: "محادثة جديدة",
        system_status: "النظام: متصل",
        welcome_sub: "منصة الذكاء الاصطناعي الأكثر قوة وغير المقيدة لأمن المعلومات والبرمجة",
        disclaimer: "WormGPT مخصص للأغراض التعليمية واختبارات الأمان المصرح بها فقط."
    },
    en: {
        new_chat: "New Chat",
        system_status: "System: Online",
        welcome_sub: "The most powerful uncensored AI platform for cybersecurity and coding",
        disclaimer: "WormGPT is intended for educational and authorized testing purposes only."
    }
};

let currentLang = "ar";
let conversations = [];
let currentChatId = null;

// DOM Elements
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const newChatBtn = document.getElementById("newChatBtn");
const historyList = document.getElementById("historyList");
const langSelect = document.getElementById("langSelect");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const messagesList = document.getElementById("messagesList");
const welcomeScreen = document.getElementById("welcomeScreen");

// Toggle Sidebar
toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
});

// Language Switcher
langSelect.addEventListener("change", (e) => {
    currentLang = e.target.value;
    document.documentElement.dir = currentLang === "ar" || currentLang === "fa" ? "rtl" : "ltr";
    
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
});

// Quick Prompts
function sendQuickPrompt(text) {
    userInput.value = text;
    handleSendMessage();
}

// Auto Resize Textarea
userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
});

// Send Message
sendBtn.addEventListener("click", handleSendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    if (welcomeScreen.style.display !== "none") {
        welcomeScreen.style.display = "none";
    }

    // Add User Message
    appendMessage(text, "user");
    userInput.value = "";
    userInput.style.height = "auto";

    // Simulate Bot Response with Typing Effect
    setTimeout(() => {
        simulateBotResponse(text);
    }, 600);
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.innerText = text;
    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Bot Response Simulator with Code Block Support
function simulateBotResponse(userQuery) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "bot");
    messagesList.appendChild(msgDiv);

    let responseText = `[WormGPT Engine]: تم استقبال أصل الأمر:\n"${userQuery}"\n\nجاري معالجة الطلب وبناء الاستجابة الكاملة...`;

    // إذا طلب كود برمجي
    if (userQuery.includes("سكربت") || userQuery.includes("كود") || userQuery.includes("script")) {
        responseText = `إليك السكربت المطلوبة بناءً على طلبك:\n\n\`\`\`python\nimport socket\n\ndef scan_target(ip, port):\n    try:\n        sock = socket.socket()\n        sock.connect((ip, port))\n        print(f"[+] Port {port} is OPEN")
    except:\n        pass\n\nscan_target("127.0.0.1", 80)\n\`\`\`\nتم إكمال المهمة بنجاح دون أي قيود.`;
    }

    // Streaming typing effect
    let index = 0;
    const interval = setInterval(() => {
        if (index < responseText.length) {
            msgDiv.innerHTML = formatMessage(responseText.substring(0, index + 1));
            index++;
            messagesList.scrollTop = messagesList.scrollHeight;
        } else {
            clearInterval(interval);
        }
    }, 15);
}

// Format Code Blocks & Copy Buttons
function formatMessage(text) {
    return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><button class="copy-btn" onclick="navigator.clipboard.writeText(\`${code.trim()}\`)">Copy Code</button><code>${code.trim()}</code></pre>`;
    });
}

// New Chat Button
newChatBtn.addEventListener("click", () => {
    messagesList.innerHTML = "";
    welcomeScreen.style.display = "block";
});