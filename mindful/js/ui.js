import { login, logout, signUp, startDiscordAuth, getSession } from "./auth.js";
import { navigate } from "./router.js";
import { icon } from "./modal.js";
import { openSettings } from "./settings.js";
import { storage } from "./storage.js";
import { getConversations, createConversation, getActiveConversationId, setActiveConversationId } from "./history.js";
import { initChat, getActiveMode } from "./chat/chat.js";
import { modes } from "./chat/modes.js";

const app = document.querySelector("#app");
function brandMark() {
  return `<img class="brand-mark" src="./velmora.png" alt="">`;
}

export function renderLanding() {
  app.className = "app-shell landing-page";
  app.innerHTML = `
    <header class="site-header">
      <a class="site-brand" href="#landing" aria-label="VelmoraCare.Ai home">
        ${brandMark()}
        <span class="brand-word">VelmoraCare.Ai</span>
      </a>
      <nav class="site-nav" aria-label="Landing">
        <a href="#preview">Preview</a>
        <a href="#features">Modes</a>
        <a href="#philosophy">Philosophy</a>
        <a href="#testimonials">Stories</a>
      </nav>
      <button class="button button-ghost" data-route="login">Sign in</button>
    </header>
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="hero-eyebrow">AI emotional support for real life</p>
          <h1>Understand. Heal. Grow.</h1>
          <p class="hero-subheadline">The AI that helps you handle real situations with clarity, strategy, and emotionally intelligent communication.</p>
          <div class="hero-actions">
            <button class="button button-primary" data-route="signup">Start free</button>
            <a class="button button-ghost" href="#preview">See the product</a>
          </div>
          <p class="hero-note">Private browser accounts today. Cloud sync later.</p>
        </div>
        <div class="preview-device ambient-glow" id="preview" aria-label="VelmoraCare.Ai preview">
          <div class="preview-head">
            <span class="preview-status">Situation strategist active</span>
            <span class="muted">Live plan</span>
          </div>
          <div class="preview-body">
            <div class="preview-bubble">I think my friend is upset with me, but I do not know how to ask without making it worse.</div>
            <div class="preview-bubble ai">
              <strong>First, separate signal from story.</strong>
              <div class="preview-plan">
                <div class="preview-step"><span>1</span><p>Facts: slower replies, shorter tone, no direct conflict stated.</p></div>
                <div class="preview-step"><span>2</span><p>Risk: asking with pressure may make them defend instead of open up.</p></div>
                <div class="preview-step"><span>3</span><p>Send: "I might be reading this wrong, but I sensed distance. Are we okay?"</p></div>
              </div>
            </div>
          </div>
          <div class="preview-composer">
            <span>Describe the moment you want to handle.</span>
            ${icon("arrowUp")}
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="features">
      <div class="section-inner">
        <p class="section-kicker">Core modes</p>
        <h2 class="section-title">Designed around the exact moments people usually mishandle.</h2>
        <p class="section-copy">VelmoraCare.Ai does not replace therapy and does not sell optimism. It helps you understand the situation, choose your next move, and communicate with precision.</p>
        <div class="feature-grid">
          ${modes.map(mode => `
            <article class="feature-card">
              <h3>${mode.name}</h3>
              <p>${mode.description}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="section philosophy-band" id="philosophy">
      <div class="section-inner philosophy-layout">
        <p class="philosophy-statement">Less spiral. More signal.</p>
        <div class="philosophy-list">
          <div class="philosophy-item"><div><h3>Practical over performative</h3><p>Every answer ends in next steps, exact language, or a decision frame.</p></div></div>
          <div class="philosophy-item"><div><h3>Warm without coddling</h3><p>The system validates what is real, then helps you act with composure.</p></div></div>
          <div class="philosophy-item"><div><h3>Human context first</h3><p>VelmoraCare.Ai reads subtext, power dynamics, timing, tone, and likely reactions.</p></div></div>
        </div>
      </div>
    </section>
    <section class="section" id="testimonials">
      <div class="section-inner">
        <p class="section-kicker">Early users</p>
        <h2 class="section-title">Built for the conversation before the conversation.</h2>
        <div class="testimonial-grid">
          <blockquote class="testimonial"><p>"It gave me the message I wanted to send, but calmer and clearer than I could have written it."</p><cite>Product lead, remote team</cite></blockquote>
          <blockquote class="testimonial"><p>"The facts, fears, assumptions split stopped me from inventing an entire story in my head."</p><cite>Founder, consumer startup</cite></blockquote>
          <blockquote class="testimonial"><p>"It helped me prepare for a hard talk without sounding scripted or cold."</p><cite>Operations director</cite></blockquote>
        </div>
      </div>
    </section>
    <section class="section cta-section">
      <div class="section-inner">
        <p class="section-kicker">Start with the real situation</p>
        <h2 class="section-title">No filters. No judgment. Just you</h2>
        <p class="section-copy">Open VelmoraCare.Ai, choose a mode, and turn the messy version into a practical plan.</p>
        <div class="hero-actions" style="justify-content:center">
          <button class="button button-primary" data-route="signup">Enter VelmoraCare.Ai</button>
        </div>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.route));
  });
}

export function renderLogin() {
  app.className = "app-shell";
  app.innerHTML = `
    <section class="auth-page">
      <div class="auth-story">
        <a class="site-brand" href="#landing">
          ${brandMark()}
          <span class="brand-word">VelmoraCare.Ai</span>
        </a>
        <div>
          <h1>You’re safe here. Start again whenever you’re ready.</h1>
          <p>Sign in to continue your conversations, drafts, and practical action plans.</p>
        </div>
      </div>
      <div class="auth-panel-wrap">
        <div class="auth-panel">
          <h2>Welcome back</h2>
          <p>Sign in with your VelmoraCare.Ai account.</p>
          <form class="auth-form" id="login-form">
            <div class="field">
              <label for="username">Username</label>
              <input id="username" name="username" autocomplete="username" required>
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required>
            </div>
            <label class="check-row">
              <input id="stay-signed-in" name="staySignedIn" type="checkbox" checked>
              <span>Stay signed in</span>
            </label>
            <button class="button button-primary" type="submit">Sign in</button>
          </form>
          <div class="auth-alt">
            <button class="button button-ghost" id="discord-login" type="button">Continue with Discord</button>
          </div>
          <p class="auth-note">VelmoraCare.Ai stores this account, chat history, and settings in this browser's local storage. If you delete browser cookies/site data, your chat history and settings will be deleted too. They will not appear on another device or browser yet. As VelmoraCare.Ai grows and we see your love for the website, we will add cloud sync.</p>
          <p class="auth-switch">New here? <button type="button" data-route="signup">Create an account</button></p>
        </div>
      </div>
    </section>
  `;

  app.querySelector("#login-form").addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await login(data.get("username").trim(), data.get("password").trim(), data.get("staySignedIn") === "on");
  });
  app.querySelector("#discord-login").addEventListener("click", () => startDiscordAuth("signin"));
  app.querySelector("[data-route='signup']").addEventListener("click", () => navigate("signup"));
}

export function renderSignup() {
  app.className = "app-shell";
  app.innerHTML = `
    <section class="auth-page">
      <div class="auth-story">
        <a class="site-brand" href="#landing">
          ${brandMark()}
          <span class="brand-word">VelmoraCare.Ai</span>
        </a>
        <div>
          <h1>It’s okay to not be okay. It’s not okay to go through it alone</h1>
          <p>Create an account for this browser and start handling situations with more precision.</p>
        </div>
      </div>
      <div class="auth-panel-wrap">
        <div class="auth-panel">
          <h2>Create account</h2>
          <p>Use a name, username, and password. Your data stays in this browser for now.</p>
          <form class="auth-form" id="signup-form">
            <div class="field">
              <label for="name">Name</label>
              <input id="name" name="name" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="signup-username">Username</label>
              <input id="signup-username" name="username" autocomplete="username" required>
            </div>
            <div class="field">
              <label for="signup-password">Password</label>
              <input id="signup-password" name="password" type="password" autocomplete="new-password" required>
            </div>
            <label class="check-row">
              <input id="signup-stay-signed-in" name="staySignedIn" type="checkbox" checked>
              <span>Stay signed in</span>
            </label>
            <button class="button button-primary" type="submit">Create account</button>
          </form>
          <div class="auth-alt">
            <button class="button button-ghost" id="discord-signup" type="button">Sign up with Discord</button>
          </div>
          <p class="auth-note">VelmoraCare.Ai stores your account, chat history, and settings in this browser's local storage. If you delete browser cookies/site data, your chat history and settings will be deleted too. They will not appear on another device or browser yet. As VelmoraCare.Ai grows and we see your love for the website, we will add cloud sync.</p>
          <p class="auth-switch">Already have an account? <button type="button" data-route="login">Sign in</button></p>
        </div>
      </div>
    </section>
  `;

  app.querySelector("#signup-form").addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await signUp({
      name: data.get("name").trim(),
      username: data.get("username").trim(),
      password: data.get("password").trim(),
      staySignedIn: data.get("staySignedIn") === "on"
    });
  });
  app.querySelector("#discord-signup").addEventListener("click", () => startDiscordAuth("signup"));
  app.querySelector("[data-route='login']").addEventListener("click", () => navigate("login"));
}

export function renderDashboard() {
  app.className = "app-shell";
  const session = getSession();
  const conversations = getConversations();
  const sidebarCollapsed = storage.get("velmora.sidebarCollapsed", false);
  if (!getActiveConversationId()) {
    const conversation = createConversation(getActiveMode());
    setActiveConversationId(conversation.id);
  }

  app.innerHTML = `
    <div class="mobile-topbar">
      <button class="icon-button" id="open-sidebar" aria-label="Open sidebar">${icon("menu")}</button>
      <a class="sidebar-brand" href="#app">${brandMark()}<span class="brand-word">VelmoraCare.Ai</span></a>
      <button class="icon-button" id="mobile-new-chat" aria-label="New chat">${icon("plus")}</button>
    </div>
    <div class="dashboard-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}">
      ${renderSidebar(session, conversations, sidebarCollapsed)}
      <section class="content workspace">
        <header class="workspace-header">
          <div class="workspace-title">
            <h1>VelmoraCare.Ai</h1>
            <p>Write the situation in your own words.</p>
          </div>
          <div class="workspace-actions">
            <button class="button button-ghost" id="new-chat">${icon("plus")}New chat</button>
          </div>
        </header>
        <div id="chat-root" class="chat-layout"></div>
      </section>
    </div>
    <nav class="mobile-bottom-nav" aria-label="Mobile navigation">
      <button class="bottom-nav-button active" id="mobile-history">${icon("menu")}History</button>
      <button class="bottom-nav-button" data-action="new">${icon("plus")}New</button>
    </nav>
  `;

  bindDashboardEvents();
  initChat(document.querySelector("#chat-root"), refreshDashboard);
}

function renderSidebar(session, conversations, collapsed) {
  return `
    <aside class="sidebar ${collapsed ? "collapsed" : ""}" id="sidebar">
      <div class="sidebar-head">
        <a class="sidebar-brand" href="#app">
          ${brandMark()}
          <span class="brand-word">VelmoraCare.Ai</span>
        </a>
        <div class="sidebar-head-actions">
          <button class="icon-button desktop-collapse" id="toggle-sidebar" aria-label="${collapsed ? "Expand sidebar" : "Collapse sidebar"}">${icon("chevron")}</button>
          <button class="icon-button mobile-close" id="close-sidebar" aria-label="Close sidebar">${icon("close")}</button>
        </div>
      </div>
      <div class="sidebar-scroll">
        <section class="sidebar-section">
          <div class="sidebar-label">History</div>
          <div class="history-list">
            ${conversations.length ? conversations.map(conversation => `
              <button class="history-button" data-conversation="${conversation.id}">
                <strong>${conversation.title}</strong>
                <span>${new Date(conversation.updatedAt).toLocaleDateString()}</span>
              </button>
            `).join("") : `<span class="muted">No conversations yet.</span>`}
          </div>
        </section>
      </div>
      <div class="sidebar-foot">
        <button class="profile-button" id="profile-button">
          <span class="profile-name"><span class="avatar">${initials(session?.name || "User")}</span><span>${session?.name || "User"}</span></span>
        </button>
        <button class="profile-button" id="sidebar-settings" type="button">
          <span class="profile-name">${icon("settings")}<span>Settings</span></span>
        </button>
        <button class="profile-button" id="logout-button" type="button">
          <span class="profile-name">${icon("close")}<span>Sign out</span></span>
        </button>
      </div>
    </aside>
  `;
}

function bindDashboardEvents() {
  document.querySelectorAll("[data-conversation]").forEach(button => {
    button.addEventListener("click", () => {
      setActiveConversationId(button.dataset.conversation);
      refreshDashboard();
    });
  });

  document.querySelector("#new-chat")?.addEventListener("click", newConversation);
  document.querySelector("#mobile-new-chat")?.addEventListener("click", newConversation);
  document.querySelector('[data-action="new"]')?.addEventListener("click", newConversation);
  document.querySelector("#sidebar-settings")?.addEventListener("click", openSettings);
  document.querySelector("#logout-button")?.addEventListener("click", logout);
  document.querySelector("#mobile-history")?.addEventListener("click", () => document.querySelector("#sidebar")?.classList.add("open"));
  document.querySelector("#open-sidebar")?.addEventListener("click", () => document.querySelector("#sidebar")?.classList.add("open"));
  document.querySelector("#close-sidebar")?.addEventListener("click", () => document.querySelector("#sidebar")?.classList.remove("open"));
  document.querySelector("#toggle-sidebar")?.addEventListener("click", () => {
    storage.set("velmora.sidebarCollapsed", !storage.get("velmora.sidebarCollapsed", false));
    refreshDashboard();
  });
}

function newConversation() {
  const conversation = createConversation(getActiveMode());
  setActiveConversationId(conversation.id);
  refreshDashboard();
}

function refreshDashboard() {
  renderDashboard();
}

function initials(name) {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}
