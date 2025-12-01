const ids = [
    "resolution", "optimal", "normal", "chaos", "extreme",
    "volume", "start", "stop", "download",
    "toggle", "x", "y",
    "sx", "sy", "ex", "ey",
    "meter", "test", "popup",
    "phase1", "phase2", "invalid",
    "video", "canvas"
];

/** @type {import("../types/dom.js").DomElements} */
export const dom = {};
ids.forEach(id => {
    dom[id] = document.getElementById(id);
});

dom.audio = new Audio("/audio.mp3");
dom.context = dom.canvas.getContext("2d", { willReadFrequently: true });

dom.init = function() {
    const value = localStorage.getItem("resolution");
    if (value !== null) {
        this.resolution.selectedIndex = value;
    }

    if (localStorage.getItem("optimal") === "1") {
        this.optimal.checked = true;
    }

    switch (localStorage.getItem("mode")) {
        case "1":
            this.chaos.checked = true;
            break;
        case "2":
            this.extreme.checked = true;
            break;
    }

    if (localStorage.getItem("toggle") === "1") {
        this.toggle.checked = true;

        this.x.disabled = false;
        this.y.disabled = false;
    }

    ["volume", "x", "y", "sx", "sy", "ex", "ey"].forEach(id => {
        const value = localStorage.getItem(id);
        if (value !== null) {
            document.getElementById(id).value = value;
        }
    });
    this.audio.volume = this.volume.value;
};
