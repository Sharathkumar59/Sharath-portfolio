// script.js
(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Chatbot elements
  const fab = document.getElementById("chatFab");
  const modal = document.getElementById("chatModal");
  const overlay = document.getElementById("chatOverlay");
  const closeBtn = document.getElementById("chatClose");

  const log = document.getElementById("chatLog");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatMsg");

  if (!fab || !modal || !overlay || !closeBtn || !log || !form || !input) return;

  // Random fun facts (locked set)
  const funFacts = [
    'My favourite question in any analysis is: “Does this actually make sense?”',
    "My instinct is to question the data before questioning the user.",
    "Most problems aren’t bad questions — they’re bad assumptions.",
    "I treat data quality as part of the analysis, not a separate step."
  ];

  const answers = {
    about:
      "I’m Sharath Ravindra, a Data Analyst with an MSc in Data Science (University of Surrey). I’ve worked with real-world data across enterprise analytics (Accenture) and operational reporting in a live retail environment.",
    skills:
      "My core strengths are SQL, Python (pandas/NumPy), Power BI (DAX, dashboards), and Excel (pivots/lookups). I’m strong on EDA, trend analysis, and data quality/validation.",
    experience:
      "At Accenture, I supported Shell’s Downstream Trading analytics: worked with large transactional datasets, built ETL workflows using Azure Data Factory, created Power BI KPI dashboards, and automated reporting/validation checks. Currently, I work with SKU-level sales and inventory reporting in M&S Simply Food (via SSP), reconciling reports with counts and summarising sales/waste trends for operations.",
    tools:
      "Tools I use: SQL, Python, Power BI, Excel, Git/GitHub, SQL Server, Azure Data Factory, and Databricks exposure. For ML/NLP: scikit-learn, LDA, and BERT (project use).",
    projects_html:
      `
      <div>Here are the highlights:</div>
      <ul>
        <li><strong>911 Emergency Calls</strong> — 500k+ records; patterns by time, location, and incident type.</li>
        <li><strong>Conversational Analytics (NLP)</strong> — 10k+ chatbot logs; sentiment/topic patterns and evaluation.</li>
        <li><strong>Power BI Sales Dashboard</strong> — KPI tracking and trend reporting.</li>
        <li><strong>SQL Data Model</strong> — relational schema + queries for business questions.</li>
      </ul>
      <div>If you want, ask: “Which project is best to start with?”</div>
      `,
    strengths:
      "How I work: I clarify requirements fast, validate data before sharing insights, communicate simply with non-technical stakeholders, and stay calm under time pressure. If results look wrong, I dig until they make sense."
  };

  const escapeHtml = (s) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

  const addMsg = (who, text, isHtml = false) => {
    const div = document.createElement("div");
    div.className = `msg ${who}`;

    const header = `<strong>${who === "user" ? "You" : "Sharath"}</strong>`;
    const body = isHtml ? text : escapeHtml(text);

    div.innerHTML = header + body;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  };

  const pickFunFact = () => {
    const idx = Math.floor(Math.random() * funFacts.length);
    return funFacts[idx];
  };

  const bestMatch = (q) => {
    const s = q.toLowerCase();

    if (s.includes("accenture") || s.includes("shell")) return "experience";
    if (s.includes("skills") || s.includes("sql") || s.includes("python") || s.includes("power bi")) return "skills";
    if (s.includes("project") || s.includes("portfolio")) return "projects";
    if (s.includes("tool") || s.includes("tech")) return "tools";
    if (s.includes("how") && s.includes("work")) return "strengths";
    if (s.includes("fun")) return "fun";
    if (s.includes("about") || s.includes("who are you")) return "about";

    return null;
  };

  const reply = (key) => {
    if (key === "projects") {
      addMsg("bot", answers.projects_html, true);
      return;
    }

    if (key === "fun") {
      addMsg("bot", pickFunFact());
      return;
    }

    const text =
      answers[key] ||
      "Try: About me, Skills, Experience, Tools, Projects, How I work, or Fun fact.";
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

    // special: “best project” question
    const s = q.toLowerCase();
    if (s.includes("best") && s.includes("project")) {
      addMsg("bot", "Start with <strong>911 Emergency Calls</strong>. It’s large-scale, easy to explain, and shows end-to-end analysis.", true);
      return;
    }

    const match = bestMatch(q);
    if (match) reply(match);
    else addMsg("bot", "I can help with: About me, Skills, Experience, Tools, Projects, How I work, or a Fun fact.");
  });
})();
