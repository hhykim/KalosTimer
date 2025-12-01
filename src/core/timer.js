import { OFFSET } from "@/core/constants.js";
import { state } from "@/state/state.js";
import { dom } from "@/ui/elements.js";

export function setTimer(once) {
    state.lastDelay = once;
    state.timestamp = performance.now();

    if (once < 0) {
        state.nextDelay = state.delay - OFFSET.PRE_TRIGGER;
    }
    state.timerId = setTimeout(setTimerId, once);
}

function setTimerId() {
    dom.audio.play();

    state.timestamp = performance.now();
    if (state.nextDelay > 0) {
        state.lastDelay = state.nextDelay;
        state.timerId = setTimeout(setTimerId, state.nextDelay);

        state.nextDelay = 0;
    } else {
        state.lastDelay = state.delay;
        state.timerId = setTimeout(setTimerId, state.delay);
    }
}
