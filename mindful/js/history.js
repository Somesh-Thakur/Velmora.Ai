import { storage } from "./storage.js";

const HISTORY_KEY = "velmora.conversations";
const ACTIVE_KEY = "velmora.activeConversation";

export function getConversations() {
  return storage.get(HISTORY_KEY, []);
}

export function saveConversations(conversations) {
  storage.set(HISTORY_KEY, conversations);
}

export function getActiveConversationId() {
  return storage.get(ACTIVE_KEY, null);
}

export function setActiveConversationId(id) {
  storage.set(ACTIVE_KEY, id);
}

export function getActiveConversation() {
  const id = getActiveConversationId();
  return getConversations().find(conversation => conversation.id === id) || null;
}

export function createConversation(mode) {
  const now = new Date().toISOString();
  const conversation = {
    id: crypto.randomUUID(),
    title: "New situation",
    mode,
    messages: [],
    createdAt: now,
    updatedAt: now
  };
  saveConversations([conversation, ...getConversations()]);
  return conversation;
}

export function updateConversation(id, updater) {
  const conversations = getConversations();
  const next = conversations.map(conversation => {
    if (conversation.id !== id) return conversation;
    const updated = updater({ ...conversation, messages: [...conversation.messages] });
    return { ...updated, updatedAt: new Date().toISOString() };
  });
  saveConversations(next);
}

export function addMessage(conversationId, message) {
  updateConversation(conversationId, conversation => {
    const next = { ...message, id: message.id || crypto.randomUUID(), createdAt: new Date().toISOString() };
    const messages = [...conversation.messages, next];
    const title = conversation.title === "New situation" && message.role === "user"
      ? message.content.slice(0, 48) || "New situation"
      : conversation.title;
    return { ...conversation, title, messages };
  });
}

export function replaceLastAssistant(conversationId, content) {
  updateConversation(conversationId, conversation => {
    const messages = [...conversation.messages];
    const index = messages.map(message => message.role).lastIndexOf("assistant");
    if (index >= 0) {
      messages[index] = { ...messages[index], content, createdAt: new Date().toISOString() };
    }
    return { ...conversation, messages };
  });
}
