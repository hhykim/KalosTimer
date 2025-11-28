import Swal from "sweetalert2";

import { dom } from "@/ui/elements.js";

export function findCircles() {
    let src, dst, mask1, mask2, low1, high1, low2, high2, circles;

    try {
        const cap = new cv.VideoCapture(dom.video);
        dom.video.width = dom.video.videoWidth;
        dom.video.height = dom.video.videoHeight;

        src = new cv.Mat(dom.video.height, dom.video.width, cv.CV_8UC4);
        cap.read(src);

        const rect = new cv.Rect(
            Number(dom.sx.value), Number(dom.sy.value),
            Number(dom.ex.value - dom.sx.value), Number(dom.ey.value - dom.sy.value)
        );
        dst = src.roi(rect);

        cv.cvtColor(dst, dst, cv.COLOR_RGBA2RGB);
        cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV);

        mask1 = new cv.Mat();
        mask2 = new cv.Mat();
        low1 = new cv.Mat(dst.rows, dst.cols, dst.type(), [0, 140, 100, 0]);
        high1 = new cv.Mat(dst.rows, dst.cols, dst.type(), [10, 255, 255, 255]);
        low2 = new cv.Mat(dst.rows, dst.cols, dst.type(), [160, 140, 100, 0]);
        high2 = new cv.Mat(dst.rows, dst.cols, dst.type(), [179, 255, 255, 255]);

        cv.inRange(dst, low1, high1, mask1);
        cv.inRange(dst, low2, high2, mask2);
        cv.add(mask1, mask2, dst);
        cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0, 0);

        circles = new cv.Mat();
        cv.HoughCircles(dst, circles, cv.HOUGH_GRADIENT, 1, 50, 100, 20, 10, 35);

        return circles.cols;
    } catch (e) {
        dom.stop.click();

        Swal.fire({
            titleText: "OpenCV.js error",
            text: "Log: [F12] - [Console]",
            icon: "warning",
            iconColor: "red",
            toast: true,
            showConfirmButton: false
        });
        console.error(e.stack);
    } finally {
        [src, dst, mask1, mask2, low1, high1, low2, high2, circles]
            .forEach(m => m?.delete());
    }
}
