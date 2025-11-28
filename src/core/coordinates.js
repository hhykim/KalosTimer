import { state } from "@/state/state.js";
import { dom } from "@/ui/elements.js";

export function setCoordinates() {
    switch (dom.resolution.value) {
        case "1920x1080":
            if (!dom.optimal.checked) {
                state.sx1 = 30, state.sy1 = 151;
                state.sx2 = 23, state.sy2 = 162;
                break;
            }
        // fallthrough
        case "1366x768":
        case "1920x1200":
            state.sx1 = 21, state.sy1 = 107;
            state.sx2 = 16, state.sy2 = 115;
            break;
        case "2560x1440":
        case "2560x1600":
        case "2732x1536":
            state.sx1 = 43, state.sy1 = 215;
            state.sx2 = 33, state.sy2 = 231;
            break;
    }
}
