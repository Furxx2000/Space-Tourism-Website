"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList === null || tabList === void 0 ? void 0 : tabList.querySelectorAll('[role="tab"]');
tabList === null || tabList === void 0 ? void 0 : tabList.addEventListener("keydown", changeTabFocus);
tabs === null || tabs === void 0 ? void 0 : tabs.forEach((t) => {
    t.addEventListener("click", changeTabPanel);
});
let tabFocus = 0;
function changeTabFocus(e) {
    const keydownLeft = 37;
    const keydownRight = 39;
    if (e.which === keydownLeft || e.which === keydownRight) {
        tabs[tabFocus].setAttribute("tabindex", "-1");
        if (e.which === keydownRight) {
            tabFocus++;
            if (tabFocus >= tabs.length) {
                tabFocus = 0;
            }
        }
        else if (e.which === keydownLeft) {
            tabFocus--;
            if (tabFocus < 0) {
                tabFocus = tabs.length - 1;
            }
        }
        tabs[tabFocus].setAttribute("tabindex", "0");
        tabs[tabFocus].focus();
    }
}
function changeTabPanel(e) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const targetBtn = e.currentTarget;
        const targetPanel = targetBtn.getAttribute("aria-controls");
        const targetImage = (_a = targetBtn.dataset) === null || _a === void 0 ? void 0 : _a.image;
        const targetRole = (_b = targetBtn.dataset) === null || _b === void 0 ? void 0 : _b.role;
        const targetTech = (_c = targetBtn.dataset) === null || _c === void 0 ? void 0 : _c.tech;
        const tabContainer = targetBtn.parentNode;
        const mainContainer = tabContainer === null || tabContainer === void 0 ? void 0 : tabContainer.parentNode;
        (_d = tabContainer === null || tabContainer === void 0 ? void 0 : tabContainer.querySelector("[aria-selected='true']")) === null || _d === void 0 ? void 0 : _d.setAttribute("aria-selected", "false");
        targetBtn.setAttribute("aria-selected", "true");
        if (targetBtn.hasAttribute("aria-controls")) {
            hideContent(mainContainer, '[role="tabpanel"]');
            showContent(mainContainer, targetPanel);
            hideContent(mainContainer, "picture");
            showContent(mainContainer, targetImage);
        }
        else if (targetRole || targetTech) {
            const response = yield fetch("https://furxx2000.github.io/Space-Tourism-Website/model/data.json");
            const result = yield response.json();
            const targetData = targetRole ? result.crew : result.technology;
            const target = targetData.find((d) => (d.role || d.name) === (targetRole || targetTech));
            const crewArticle = document.querySelector(`.grid-container--${targetRole ? "crew" : "technology"} > article`);
            const crewPicture = document.querySelector(`.grid-container--${targetRole ? "crew" : "technology"} picture`);
            crewArticle === null || crewArticle === void 0 ? void 0 : crewArticle.remove();
            crewPicture === null || crewPicture === void 0 ? void 0 : crewPicture.remove();
            let template = `
      <article class="${targetRole ? "crew" : "technology"}-details flow">
      <header class="flow">
        <h2 class="${targetRole
                ? "fs-600 ff-serif"
                : "fs-300 ff-sans-cond text-accent letter-spacing-3"} uppercase">${(target === null || target === void 0 ? void 0 : target.role) || "The terminology..."}</h2>
        <p class="fs-700 uppercase ff-serif">${target === null || target === void 0 ? void 0 : target.name}</p>
      </header>

      <p class="text-accent">${(target === null || target === void 0 ? void 0 : target.bio) || (target === null || target === void 0 ? void 0 : target.description)}</p>
    </article>

    <picture>
      <source
        srcset=${(target === null || target === void 0 ? void 0 : target.images.webp) || (target === null || target === void 0 ? void 0 : target.images.landscape)}
        type=${(target === null || target === void 0 ? void 0 : target.images.webp) ? "image/webp" : "image/jpg"}
      />
      <img src=${(target === null || target === void 0 ? void 0 : target.images.png) || (target === null || target === void 0 ? void 0 : target.images.landscape)} alt=${target === null || target === void 0 ? void 0 : target.name} />
    </picture>`;
            if (targetTech) {
                const template2 = `
      <picture class="desktop-picture">
          <source
            srcset=${target === null || target === void 0 ? void 0 : target.images.portrait}
            type="image/jpg"
          />
          <img
            src=${target === null || target === void 0 ? void 0 : target.images.portrait}
            alt=${target === null || target === void 0 ? void 0 : target.name}
          />
        </picture>
      `;
                template = template.concat(" ", template2);
            }
            mainContainer.insertAdjacentHTML("beforeend", template);
        }
    });
}
function hideContent(parent, content) {
    parent === null || parent === void 0 ? void 0 : parent.querySelectorAll(content).forEach((a) => a.setAttribute("hidden", "true"));
}
function showContent(parent, content) {
    var _a;
    (_a = parent === null || parent === void 0 ? void 0 : parent.querySelector(`#${content}`)) === null || _a === void 0 ? void 0 : _a.removeAttribute("hidden");
}
