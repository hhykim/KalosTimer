import { findCircles } from "@/core/circles.js";
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
    const active = [255, 102, 51, 255];
    const inactive = [102, 221, 255, 255];

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

    if (rgba1.every((v, i) => Math.abs(v - active[i]) < 10)) {
        dom.phase1.checked = true;

        if (!state.running) {
            state.running = true;
            state.delay = 15000;

            setTimer(state.delay - 4500);
        }
    } else if (rgba1.every((v, i) => Math.abs(v - inactive[i]) < 10)) {
        dom.phase1.checked = true;
        state.running = false;

        clearTimeout(state.timerId);
    } else if (rgba2.every((v, i) => Math.abs(v - active[i]) < 10)) {
        dom.phase2.checked = true;

        if (!state.running) {
            state.running = true;

            if (dom.normal.checked) {
                state.delay = 15000;
            } else if (dom.chaos.checked) {
                state.delay = 13500;
            } else {
                state.delay = 13000;
            }

            setTimer(state.delay - 4500);
        }
    } else if (rgba2.every((v, i) => Math.abs(v - inactive[i]) < 10)) {
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
                    state.delay = 12000;

                    clearTimeout(state.timerId);
                    setTimer((state.lastDelay - 3000) - (performance.now() - state.timestamp));
                } else {
                    state.delay = 10000;

                    clearTimeout(state.timerId);
                    setTimer((state.lastDelay - 5000) - (performance.now() - state.timestamp));
                }
            } else if (dom.phase2.checked) {
                if (dom.chaos.checked) {
                    state.delay = 11500;
                } else {
                    state.delay = 11000;
                }

                clearTimeout(state.timerId);
                setTimer((state.lastDelay - 2000) - (performance.now() - state.timestamp));
            }
        } else if (state.enhanced && findCircles() < 3) {
            state.enhanced = false;

            if (dom.phase1.checked) {
                state.delay = 15000;

                clearTimeout(state.timerId);
                if (dom.chaos.checked) {
                    setTimer((state.lastDelay + 3000) - (performance.now() - state.timestamp));
                } else {
                    setTimer((state.lastDelay + 5000) - (performance.now() - state.timestamp));
                }
            } else if (dom.phase2.checked) {
                if (dom.chaos.checked) {
                    state.delay = 13500;
                } else {
                    state.delay = 13000;
                }

                clearTimeout(state.timerId);
                setTimer((state.lastDelay + 2000) - (performance.now() - state.timestamp));
            }
        }
    } else {
        state.enhanced = false;
    }
}
