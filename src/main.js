import { clearLocalStorage } from "@/state/storage.js";
import { dom } from "@/ui/elements.js";

window.resolution = dom.resolution;
window.clearLocalStorage = clearLocalStorage;

dom.init();
import "@/ui/events.js";
