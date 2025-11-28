import { startCapture, stopCapture } from "@/core/capture.js";
import { findCircles } from "@/core/circles.js";
import { dom } from "@/ui/elements.js";

dom.volume.addEventListener("input", e => {
    localStorage.setItem("volume", e.target.value);

    dom.audio.volume = e.target.value;
    dom.audio.play();
});

dom.start.addEventListener("click", startCapture);
dom.stop.addEventListener("click", stopCapture);

dom.download.addEventListener("click", e => {
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = dom.canvas.toDataURL();

    link.click();
});

dom.toggle.addEventListener("click", e => {
    if (e.target.checked) {
        localStorage.setItem("toggle", "1");

        dom.x.disabled = false;
        dom.y.disabled = false;
    } else {
        localStorage.setItem("toggle", "0");

        dom.x.disabled = true;
        dom.y.disabled = true;
    }
});

["x", "y", "sx", "sy", "ex", "ey"].forEach(id => {
    document.getElementById(id).addEventListener("input", e => {
        localStorage.setItem(id, e.target.value);
    });
});

dom.test.addEventListener("click", e => {
    if (dom.video.srcObject === null) {
        alert("먼저 화면 공유를 시작해 주세요.");
    } else {
        dom.meter.value = findCircles();
        dom.meter.dataset.tooltip = `${dom.meter.value}간섭`;
    }
});

dom.popup.addEventListener("click", e => {
    if (dom.video.srcObject === null) {
        alert("먼저 화면 공유를 시작해 주세요.");
    } else {
        open(
            "/popup.html",
            "popup",
            `popup, width=${dom.video.videoWidth}, height=${dom.video.videoHeight}`
        );
    }
});
