import { dom } from "@/ui/elements.js";

export function setInputsState(state) {
    if (state) {
        dom.resolution.disabled = true;
        dom.optimal.disabled = true;

        dom.normal.disabled = true;
        dom.chaos.disabled = true;
        dom.extreme.disabled = true;

        dom.start.disabled = true;
        dom.stop.disabled = false;
        dom.download.disabled = false;
    } else {
        dom.resolution.disabled = false;
        dom.optimal.disabled = false;

        dom.normal.disabled = false;
        dom.chaos.disabled = false;
        dom.extreme.disabled = false;

        dom.start.disabled = false;
        dom.stop.disabled = true;
        dom.download.disabled = true;

        dom.invalid.checked = true;
    }
}
