"use strict";
const nav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-nav-toggle");
navToggle.addEventListener("click", () => {
    var _a;
    const visibility = (_a = nav.dataset) === null || _a === void 0 ? void 0 : _a.visible;
    if (visibility === "false") {
        nav.dataset.visible = "true";
        navToggle.setAttribute("aria-expanded", "true");
    }
    else {
        nav.dataset.visible = "false";
        navToggle.setAttribute("aria-expanded", "false");
    }
});
