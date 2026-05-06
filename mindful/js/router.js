import { isAuthenticated } from "./auth.js";
import { renderLanding, renderLogin, renderSignup, renderDashboard } from "./ui.js";

const routes = {
  landing: renderLanding,
  login: renderLogin,
  signup: renderSignup,
  app: renderDashboard
};

export function navigate(route) {
  window.location.hash = route;
}

export function currentRoute() {
  return window.location.hash.replace("#", "") || "landing";
}

export function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}

function renderRoute() {
  const route = currentRoute();
  if (route === "app" && !isAuthenticated()) {
    navigate("login");
    return;
  }

  const renderer = routes[route] || routes.landing;
  renderer();
}
