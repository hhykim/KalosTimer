"use strict";

const resolution = document.getElementById("resolution");
if (localStorage.getItem("resolution") !== null) {
    resolution.selectedIndex = localStorage.getItem("resolution");
}
const optimal = document.getElementById("optimal");
if (localStorage.getItem("optimal") == "1") {
    optimal.checked = true;
}

const normal = document.getElementById("normal");
const chaos = document.getElementById("chaos");
const extreme = document.getElementById("extreme");
switch (localStorage.getItem("mode")) {
    case "1":
        chaos.checked = true;
        break;
    case "2":
        extreme.checked = true;
        break;
}

const volume = document.getElementById("volume");
if (localStorage.getItem("volume") !== null) {
    volume.value = localStorage.getItem("volume");
}
const audio = new Audio("audio.mp3");
audio.volume = volume.value;

const start = document.getElementById("start");
const stop = document.getElementById("stop");
const download = document.getElementById("download");

const x = document.getElementById("x");
if (localStorage.getItem("x") !== null) {
    x.value = localStorage.getItem("x");
}
const y = document.getElementById("y");
if (localStorage.getItem("y") !== null) {
    y.value = localStorage.getItem("y");
}
const toggle = document.getElementById("toggle");
if (localStorage.getItem("toggle") == "1") {
    toggle.checked = true;

    x.disabled = false;
    y.disabled = false;
}

const sx = document.getElementById("sx");
if (localStorage.getItem("sx") !== null) {
    sx.value = localStorage.getItem("sx");
}
const sy = document.getElementById("sy");
if (localStorage.getItem("sy") !== null) {
    sy.value = localStorage.getItem("sy");
}
const ex = document.getElementById("ex");
if (localStorage.getItem("ex") !== null) {
    ex.value = localStorage.getItem("ex");
}
const ey = document.getElementById("ey");
if (localStorage.getItem("ey") !== null) {
    ey.value = localStorage.getItem("ey");
}
const meter = document.getElementById("meter");
const test = document.getElementById("test");
const popup = document.getElementById("popup");

const phase1 = document.getElementById("phase1");
const phase2 = document.getElementById("phase2");
const invalid = document.getElementById("invalid");

const video = document.getElementById("video");
const context = document.getElementById("canvas").getContext("2d", { willReadFrequently: true });

let sx1, sy1;
let sx2, sy2;

let delay, nextDelay, lastDelay, timestamp;
let painterId, timerId;

let running = false;
let enhanced = false;

volume.addEventListener("input", e => {
    localStorage.setItem("volume", e.target.value);

    audio.volume = e.target.value;
    audio.play();
});

start.addEventListener("click", async e => {
    localStorage.setItem("resolution", resolution.selectedIndex);
    localStorage.setItem("optimal", optimal.checked ? "1" : "0");
    localStorage.setItem("mode", document.querySelector("input[name='mode']:checked").value);

    video.srcObject = await navigator.mediaDevices.getDisplayMedia();
    video.srcObject.getVideoTracks()[0].addEventListener("ended", e => stopVideo());

    setCoordinates();
    setPainterId();

    setInputsState(true);
});

function setCoordinates() {
    switch (resolution.value) {
        case "1366x768":
            sx1 = 21, sy1 = 107;
            sx2 = 16, sy2 = 115;
            break;
        case "1920x1080":
            if (!optimal.checked) {
                sx1 = 30, sy1 = 151;
                sx2 = 23, sy2 = 162;
            } else {
                sx1 = 21, sy1 = 107;
                sx2 = 16, sy2 = 115;
            }
            break;
        case "1920x1200":
            sx1 = 21, sy1 = 107;
            sx2 = 16, sy2 = 115;
            break;
        case "2560x1440":
        case "2560x1600":
        case "2732x1536":
            sx1 = 43, sy1 = 215;
            sx2 = 33, sy2 = 231;
            break;
    }
}

function setPainterId() {
    const width = context.canvas.width;
    const height = context.canvas.height;

    context.drawImage(video, 0, 0, width, height, 0, 0, width, height);
    setTrigger();

    painterId = setTimeout(setPainterId, 1000);
}

function setTrigger() {
    const active = [255, 102, 51, 255];
    const inactive = [102, 221, 255, 255];

    let dx, dy;
    if (toggle.checked) {
        dx = Number(x.value);
        dy = Number(y.value);
    } else {
        dx = 0;
        dy = video.videoHeight - resolution.value.split("x")[1];
    }

    const rgba1 = context.getImageData(sx1 + dx, sy1 + dy, 1, 1).data;
    const rgba2 = context.getImageData(sx2 + dx, sy2 + dy, 1, 1).data;

    if (rgba1.every((v, i) => Math.abs(v - active[i]) < 10)) {
        phase1.checked = true;

        if (!running) {
            running = true;
            delay = 15000;

            setTimer(delay - 4500);
        }
    } else if (rgba1.every((v, i) => Math.abs(v - inactive[i]) < 10)) {
        phase1.checked = true;
        running = false;

        clearTimeout(timerId);
    } else if (rgba2.every((v, i) => Math.abs(v - active[i]) < 10)) {
        phase2.checked = true;

        if (!running) {
            running = true;

            if (normal.checked) {
                delay = 15000;
            } else if (chaos.checked) {
                delay = 13500;
            } else {
                delay = 13000;
            }

            setTimer(delay - 4500);
        }
    } else if (rgba2.every((v, i) => Math.abs(v - inactive[i]) < 10)) {
        phase2.checked = true;
        running = false;

        clearTimeout(timerId);
    } else {
        invalid.checked = true;
    }

    if (normal.checked) return;
    if (running) {
        if (invalid.checked) return;

        if (!enhanced && findCircles() >= 3) {
            enhanced = true;

            if (phase1.checked) {
                if (chaos.checked) {
                    delay = 12000;

                    clearTimeout(timerId);
                    setTimer((lastDelay - 3000) - (performance.now() - timestamp));
                } else {
                    delay = 10000;

                    clearTimeout(timerId);
                    setTimer((lastDelay - 5000) - (performance.now() - timestamp));
                }
            } else if (phase2.checked) {
                if (chaos.checked) {
                    delay = 11500;
                } else {
                    delay = 11000;
                }

                clearTimeout(timerId);
                setTimer((lastDelay - 2000) - (performance.now() - timestamp));
            }
        } else if (enhanced && findCircles() < 3) {
            enhanced = false;

            if (phase1.checked) {
                delay = 15000;

                clearTimeout(timerId);
                if (chaos.checked) {
                    setTimer((lastDelay + 3000) - (performance.now() - timestamp));
                } else {
                    setTimer((lastDelay + 5000) - (performance.now() - timestamp));
                }
            } else if (phase2.checked) {
                if (chaos.checked) {
                    delay = 13500;
                } else {
                    delay = 13000;
                }

                clearTimeout(timerId);
                setTimer((lastDelay + 2000) - (performance.now() - timestamp));
            }
        }
    } else {
        enhanced = false;
    }
}

function findCircles() {
    try {
        const cap = new cv.VideoCapture(video);
        video.width = video.videoWidth;
        video.height = video.videoHeight;

        const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        cap.read(src);

        const rect = new cv.Rect(Number(sx.value), Number(sy.value), Number(ex.value - sx.value), Number(ey.value - sy.value));
        const dst = src.roi(rect);

        cv.cvtColor(dst, dst, cv.COLOR_RGBA2RGB);
        cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV);

        const mask1 = new cv.Mat();
        const mask2 = new cv.Mat();
        const low1 = new cv.Mat(dst.rows, dst.cols, dst.type(), [0, 140, 100, 0]);
        const high1 = new cv.Mat(dst.rows, dst.cols, dst.type(), [10, 255, 255, 255]);
        const low2 = new cv.Mat(dst.rows, dst.cols, dst.type(), [160, 140, 100, 0]);
        const high2 = new cv.Mat(dst.rows, dst.cols, dst.type(), [179, 255, 255, 255]);

        cv.inRange(dst, low1, high1, mask1);
        cv.inRange(dst, low2, high2, mask2);
        cv.add(mask1, mask2, dst);
        cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0, 0);

        const circles = new cv.Mat();
        cv.HoughCircles(dst, circles, cv.HOUGH_GRADIENT, 1, 50, 100, 20, 10, 35);
        const result = circles.cols;

        src.delete();
        dst.delete();
        mask1.delete();
        mask2.delete();
        low1.delete();
        high1.delete();
        low2.delete();
        high2.delete();
        circles.delete();

        return result;
    } catch (e) {
        stop.click();

        Swal.fire({
            titleText: "OpenCV.js error",
            text: "Log: [F12] - [Console]",
            icon: "warning",
            iconColor: "red",
            toast: true,
            showConfirmButton: false
        });
        console.log(e.stack);
    }
};

function setTimer(once) {
    lastDelay = once;
    timestamp = performance.now();

    if (once < 0) {
        nextDelay = delay - 4500;
    }
    timerId = setTimeout(setTimerId, once);
}

function setTimerId() {
    audio.play();

    timestamp = performance.now();
    if (nextDelay > 0) {
        lastDelay = nextDelay;
        timerId = setTimeout(setTimerId, nextDelay);

        nextDelay = 0;
    } else {
        lastDelay = delay;
        timerId = setTimeout(setTimerId, delay);
    }
}

stop.addEventListener("click", e => {
    video.srcObject.getVideoTracks()[0].stop();
    stopVideo();
});

function stopVideo() {
    clearTimeout(painterId);
    clearTimeout(timerId);

    nextDelay = 0;
    running = false;
    enhanced = false;

    video.srcObject = null;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    setInputsState(false);
}

function setInputsState(state) {
    if (state) {
        resolution.disabled = true;
        optimal.disabled = true;

        normal.disabled = true;
        chaos.disabled = true;
        extreme.disabled = true;

        start.disabled = true;
        stop.disabled = false;
        download.disabled = false;
    } else {
        resolution.disabled = false;
        optimal.disabled = false;

        normal.disabled = false;
        chaos.disabled = false;
        extreme.disabled = false;

        start.disabled = false;
        stop.disabled = true;
        download.disabled = true;

        invalid.checked = true;
    }
}

download.addEventListener("click", e => {
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = context.canvas.toDataURL();

    link.click();
});

x.addEventListener("input", e => {
   localStorage.setItem("x", e.target.value);
});

y.addEventListener("input", e => {
   localStorage.setItem("y", e.target.value);
});

toggle.addEventListener("click", e => {
    if (e.target.checked) {
        localStorage.setItem("toggle", "1");

        x.disabled = false;
        y.disabled = false;
    } else {
        localStorage.setItem("toggle", "0");

        x.disabled = true;
        y.disabled = true;
    }
});

sx.addEventListener("input", e => {
    localStorage.setItem("sx", e.target.value);
});

sy.addEventListener("input", e => {
    localStorage.setItem("sy", e.target.value);
});

ex.addEventListener("input", e => {
    localStorage.setItem("ex", e.target.value);
});

ey.addEventListener("input", e => {
    localStorage.setItem("ey", e.target.value);
});

test.addEventListener("click", e => {
    if (video.srcObject === null) {
        alert("먼저 화면 공유를 시작해 주세요.");
    } else {
        meter.value = findCircles();
        meter.dataset.tooltip = `${meter.value}간섭`;
    }
});

popup.addEventListener("click", e => {
    if (video.srcObject === null) {
        alert("먼저 화면 공유를 시작해 주세요.");
    } else {
        open("popup.html", "popup", `popup, width=${video.videoWidth}, height=${video.videoHeight}`);
    }
});

function clearLocalStorage() {
    Swal.fire({
        titleText: "로컬 스토리지 초기화",
        icon: "question",
        toast: true,
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                titleText: "초기화 중...",
                icon: "info",
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                didOpen: () => {
                    stop.click();
                    start.disabled = true;
                }
            }).then(() => {
                localStorage.clear();
                location.replace("");
            });
        }
    });
}
