// script.js
(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Chatbot
  const fab = document.getElementById("chatFab");
  const modal = document.getElementById("chatModal");
  const overlay = document.getElementById("chatOverlay");
  const closeBtn = document.getElementById("chatClose");

  const log = document.getElementById("chatLog");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatMsg");

  if (!fab || !modal || !overlay || !closeBtn || !log || !form || !input) return;

  const answers = {
    about:
      "I’m Sharath Ravindra, a Data Analyst with an MSc in Data Science (University of Surrey). I’ve worked with real-world data across enterprise analytics (Accenture) and operational reporting in a live retail environment.",
    skills:
      "My core strengths are SQL, Python (pandas/NumPy), Power BI (DAX, dashboards), and Excel (pivots/lookups). I’m strong on EDA, trend analysis, and data quality/validation.",
    experience:
      "At Accenture, I supported Shell’s Downstream Trading analytics: worked with large transactional datasets, built ETL workflows using Azure Data Factory, created Power BI KPI dashboards, and automated reporting/validation checks. Currently, I work with SKU-level sales and inventory reporting in M&S Simply Food (via SSP), reconciling reports with counts and summarising sales/waste trends for operations.",
    tools:
      "Tools I use: SQL, Python, Power BI, Excel, Git/GitHub, SQL Server, Azure Data Factory, and Databricks exposure. For ML/NLP: scikit-learn, LDA, and BERT (project use).",
    projects:
      "Key projects: (1) 911 Emergency Calls Analysis – 500k+ records, pattern analysis by time/location/type. (2) Conversational Analytics (NLP) – 10k+ chatbot interactions, sentiment/topic patterns and evaluation metrics. (3) Power BI Sales Dashboard – KPI tracking and trends. (4) SQL Car Dealership Data Model – schema + complex queries.",
    roles:
      "I’m targeting Data Analyst, Junior Data Analyst, BI Analyst, and data-focused Business/Operations Analyst roles in the UK.",
    strengths:
      "How I work: I clarify requirements fast, validate data before sharing insights, communicate simply with non-technical stakeholders, and stay calm under time pressure. If results look wrong, I dig until they make sense.",
    fun:
      "Fun fact: I like turning messy datasets into clear stories — and I’m also consistent with gym + cycling, so I’m disciplined with routines."
  };

  const addMsg = (who, text) => {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.innerHTML = `<strong>${who === "user" ? "You" : "Sharath"}</strong>${text}`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  };

  const bestMatch = (q) => {
    const s = q.toLowerCase();
    if (s.includes("accenture") || s.includes("shell")) return "experience";
    if (s.includes("skills") || s.includes("sql") || s.includes("python") || s.includes("power bi")) return "skills";
    if (s.includes("project") || s.includes("portfolio")) return "projects";
    if (s.includes("role") || s.includes("job") || s.includes("looking for")) return "roles";
    if (s.includes("how") && s.includes("work")) return "strengths";
    if (s.includes("tool") || s.includes("tech")) return "tools";
    if (s.includes("fun")) return "fun";
    if (s.includes("about") || s.includes("who are you")) return "about";
    return null;
  };

  const reply = (qKey) => {
    const text = answers[qKey] || "Try: About me, Skills, Experience, Tools, Projects, Roles, or Fun fact.";
    addMsg("bot", text);
  };

  const openChat = () => {
    overlay.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    if (!log.dataset.started) {
      addMsg("bot", "Hi — I’m Sharath. What would you like to know?");
      log.dataset.started = "1";
    }
    input.focus();
  };

  const closeChat = () => {
    overlay.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = "";
    fab.focus();
  };

  fab.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  overlay.addEventListener("click", closeChat);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeChat();
  });

  document.querySelectorAll(".chat-quick button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.q;
      addMsg("user", btn.textContent);
      reply(key);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    addMsg("user", q);
    input.value = "";

    const match = bestMatch(q);
    if (match) reply(match);
    else addMsg("bot", "I can help with: About me, Skills, Experience, Tools, Projects, Roles I’m targeting, or a Fun fact.");
  });
})();
