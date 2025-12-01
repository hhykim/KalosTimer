import { findCircles } from "@/core/circles.js";
import { COLOR, DELAY, OFFSET } from "@/core/constants.js";
import { setTimer } from "@/core/timer.js";
import { state } from "@/state/state.js";
import { dom } from "@/ui/elements.js";

export function setPainterId() {
    const width = dom.canvas.width;
    const height = dom.canvas.height;

    dom.context.drawImage(dom.video, 0, 0, width, height, 0, 0, width, height);
    processFrame();

    state.painterId = setTimeout(setPainterId, 1000);
}

function processFrame() {
    let dx, dy;
    if (dom.toggle.checked) {
        dx = Number(dom.x.value);
        dy = Number(dom.y.value);
    } else {
        dx = 0;
        dy = dom.video.videoHeight - dom.resolution.value.split("x")[1];
    }

    const rgba1 = dom.context.getImageData(state.sx1 + dx, state.sy1 + dy, 1, 1).data;
    const rgba2 = dom.context.getImageData(state.sx2 + dx, state.sy2 + dy, 1, 1).data;

    if (colorsMatch(rgba1, COLOR.ACTIVE)) {
        dom.phase1.checked = true;

        if (!state.running) {
            state.running = true;
            state.delay = DELAY.P1.COMMON;

            setTimer(state.delay - OFFSET.PRE_TRIGGER);
        }
    } else if (colorsMatch(rgba1, COLOR.INACTIVE)) {
        dom.phase1.checked = true;
        state.running = false;

        clearTimeout(state.timerId);
    } else if (colorsMatch(rgba2, COLOR.ACTIVE)) {
        dom.phase2.checked = true;

        if (!state.running) {
            state.running = true;

            if (dom.normal.checked) {
                state.delay = DELAY.P2.NORMAL;
            } else if (dom.chaos.checked) {
                state.delay = DELAY.P2.CHAOS;
            } else {
                state.delay = DELAY.P2.EXTREME;
            }

            setTimer(state.delay - OFFSET.PRE_TRIGGER);
        }
    } else if (colorsMatch(rgba2, COLOR.INACTIVE)) {
        dom.phase2.checked = true;
        state.running = false;

        clearTimeout(state.timerId);
    } else {
        dom.invalid.checked = true;
    }

    if (dom.normal.checked) return;
    if (state.running) {
        if (dom.invalid.checked) return;

        if (!state.enhanced && findCircles() >= 3) {
            state.enhanced = true;

            if (dom.phase1.checked) {
                if (dom.chaos.checked) {
                    state.delay = DELAY.ENHANCED.P1.CHAOS;

                    clearTimeout(state.timerId);
                    setTimer((state.lastDelay - OFFSET.P1.CHAOS) - (performance.now() - state.timestamp));
                } else {
                    state.delay = DELAY.ENHANCED.P1.EXTREME;

                    clearTimeout(state.timerId);
                    setTimer((state.lastDelay - OFFSET.P1.EXTREME) - (performance.now() - state.timestamp));
                }
            } else if (dom.phase2.checked) {
                if (dom.chaos.checked) {
                    state.delay = DELAY.ENHANCED.P2.CHAOS;
                } else {
                    state.delay = DELAY.ENHANCED.P2.EXTREME;
                }

                clearTimeout(state.timerId);
                setTimer((state.lastDelay - OFFSET.P2.COMMON) - (performance.now() - state.timestamp));
            }
        } else if (state.enhanced && findCircles() < 3) {
            state.enhanced = false;

            if (dom.phase1.checked) {
                state.delay = DELAY.P1.COMMON;

                clearTimeout(state.timerId);
                if (dom.chaos.checked) {
                    setTimer((state.lastDelay + OFFSET.P1.CHAOS) - (performance.now() - state.timestamp));
                } else {
                    setTimer((state.lastDelay + OFFSET.P1.EXTREME) - (performance.now() - state.timestamp));
                }
            } else if (dom.phase2.checked) {
                if (dom.chaos.checked) {
                    state.delay = DELAY.P2.CHAOS;
                } else {
                    state.delay = DELAY.P2.EXTREME;
                }

                clearTimeout(state.timerId);
                setTimer((state.lastDelay + OFFSET.P2.COMMON) - (performance.now() - state.timestamp));
            }
        }
    } else {
        state.enhanced = false;
    }
}

function colorsMatch(a, b) {
    return a.every((v, i) => Math.abs(v - b[i]) < COLOR.TOLERANCE);
}
