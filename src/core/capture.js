import { setCoordinates } from "@/core/coordinates.js";
import { setPainterId } from "@/core/painter.js";
import { state } from "@/state/state.js";
import { dom } from "@/ui/elements.js";
import { setInputsState } from "@/ui/ui.js";

export async function startCapture() {
    localStorage.setItem("resolution", dom.resolution.selectedIndex);
    localStorage.setItem("optimal", dom.optimal.checked ? "1" : "0");
    localStorage.setItem("mode", document.querySelector("input[name='mode']:checked").value);

    if (navigator.userAgent.includes("Whale")) {
        alert("네이버 웨일에서 일부 기능이 작동하지 않을 수 있습니다.");
    }
    dom.video.srcObject = await navigator.mediaDevices.getDisplayMedia();
    dom.video.srcObject.getVideoTracks()[0].addEventListener("ended", stopVideo);

    setCoordinates();
    setPainterId();

    setInputsState(true);
}

export function stopCapture() {
    dom.video.srcObject.getVideoTracks()[0].stop();
    stopVideo();
}

function stopVideo() {
    clearTimeout(state.painterId);
    clearTimeout(state.timerId);

    state.nextDelay = 0;
    state.running = false;
    state.enhanced = false;

    dom.video.srcObject = null;
    dom.context.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

    setInputsState(false);
}
