import Swal from "sweetalert2";

import { dom } from "@/ui/elements.js";

export function clearLocalStorage() {
    Swal.fire({
        titleText: "로컬 스토리지 초기화",
        icon: "question",
        toast: true,
        showCancelButton: true
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire({
                titleText: "초기화 중...",
                icon: "info",
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                didOpen: () => {
                    dom.stop.click();
                    dom.start.disabled = true;
                }
            }).then(() => {
                localStorage.clear();
                location.replace("");
            });
        }
    });
}
