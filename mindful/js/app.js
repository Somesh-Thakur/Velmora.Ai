import { startBackground } from "./background.js";
import { initRouter } from "./router.js";
import { hydrateSession } from "./auth.js";

startBackground();
hydrateSession();
initRouter();
