import { storage } from "./storage.js";
import { showToast } from "./toast.js";
import { navigate } from "./router.js";
import { API_CONFIG } from "./config/api.js";

const SESSION_KEY = "velmora.session";
const USERS_KEY = "velmora.users";
let session = null;

export function hydrateSession() {
  session = storage.get(SESSION_KEY, null) || readSessionStorage();
}

export function isAuthenticated() {
  return Boolean(session);
}

export function getSession() {
  return session;
}

export async function login(username, password, staySignedIn = true) {
  const normalized = normalizeUsername(username);
  const users = getUsers();
  const passwordHash = await hashPassword(password);
  const user = users.find(item => item.username === normalized);

  if (user && user.passwordHash === passwordHash) {
    session = {
      username: user.username,
      name: user.name,
      createdAt: new Date().toISOString()
    };
    persistSession(session, staySignedIn);
    showToast("Signed in");
    navigate("app");
    return true;
  }

  showToast("Check your username and password");
  return false;
}

export async function signUp({ name, username, password, staySignedIn = true }) {
  const normalized = normalizeUsername(username);
  if (!name.trim() || !normalized || password.length < 4) {
    showToast("Enter your name, username, and a password with at least 4 characters");
    return false;
  }

  const users = getUsers();
  if (users.some(user => user.username === normalized)) {
    showToast("That username is already taken");
    return false;
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    username: normalized,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString()
  };
  storage.set(USERS_KEY, [user, ...users]);

  session = {
    username: user.username,
    name: user.name,
    createdAt: new Date().toISOString()
  };
  persistSession(session, staySignedIn);
  showToast("Account created");
  navigate("app");
  return true;
}

export function startDiscordAuth(intent = "signin") {
  const url = intent === "signup" ? API_CONFIG.auth.discordSignUpUrl : API_CONFIG.auth.discordSignInUrl;
  if (!url) {
    showToast("Discord auth is ready for backend setup");
    return;
  }
  window.location.href = url;
}

export function logout() {
  session = null;
  storage.remove(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  showToast("Signed out");
  navigate("landing");
}

function getUsers() {
  return storage.get(USERS_KEY, []);
}

function persistSession(nextSession, staySignedIn) {
  sessionStorage.removeItem(SESSION_KEY);
  storage.remove(SESSION_KEY);
  if (staySignedIn) {
    storage.set(SESSION_KEY, nextSession);
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  }
}

function readSessionStorage() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

async function hashPassword(password) {
  if (!crypto.subtle) return btoa(password);
  const data = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}
