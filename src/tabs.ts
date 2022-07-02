const tabList = document.querySelector('[role="tablist"]') as HTMLDivElement;
const tabs = tabList?.querySelectorAll<HTMLElement>('[role="tab"]');

interface Data {
  name: string;
  images: {
    png?: string;
    webp?: string;
    portrait?: string;
    landscape?: string;
  };
  role?: string;
  bio?: string;
  description?: string;
}

tabList?.addEventListener("keydown", changeTabFocus);

tabs?.forEach((t) => {
  t.addEventListener("click", changeTabPanel);
});

let tabFocus: number = 0;
function changeTabFocus(e: KeyboardEvent): void {
  const keydownLeft: number = 37;
  const keydownRight: number = 39;

  if (e.which === keydownLeft || e.which === keydownRight) {
    tabs[tabFocus].setAttribute("tabindex", "-1");

    if (e.which === keydownRight) {
      tabFocus++;
      if (tabFocus >= tabs.length) {
        tabFocus = 0;
      }
    } else if (e.which === keydownLeft) {
      tabFocus--;
      if (tabFocus < 0) {
        tabFocus = tabs.length - 1;
      }
    }

    tabs[tabFocus].setAttribute("tabindex", "0");
    tabs[tabFocus].focus();
  }
}

async function changeTabPanel(e: MouseEvent) {
  const targetBtn = e.currentTarget as HTMLButtonElement;
  const targetPanel = targetBtn.getAttribute("aria-controls")!;
  const targetImage = targetBtn.dataset?.image!;
  const targetRole = targetBtn.dataset?.role;
  const targetTech = targetBtn.dataset?.tech;
  const tabContainer = targetBtn.parentNode!;
  const mainContainer = tabContainer?.parentNode as HTMLElement;
  tabContainer
    ?.querySelector("[aria-selected='true']")
    ?.setAttribute("aria-selected", "false");
  targetBtn.setAttribute("aria-selected", "true");

  if (targetBtn.hasAttribute("aria-controls")) {
    hideContent(mainContainer, '[role="tabpanel"]');
    showContent(mainContainer, targetPanel);

    hideContent(mainContainer, "picture");
    showContent(mainContainer, targetImage);
  } else if (targetRole || targetTech) {
    const response = await fetch(
      "https://furxx2000.github.io/Space-Tourism-Website/model/data.json"
    );
    const result = await response.json();
    const targetData = targetRole ? result.crew : result.technology;
    const target = targetData.find(
      (d: Data) => (d.role || d.name) === (targetRole || targetTech)
    );
    const crewArticle = document.querySelector(
      `.grid-container--${targetRole ? "crew" : "technology"} > article`
    );
    const crewPicture = document.querySelector(
      `.grid-container--${targetRole ? "crew" : "technology"} picture`
    );
    crewArticle?.remove();
    crewPicture?.remove();
    let template = `
      <article class="${targetRole ? "crew" : "technology"}-details flow">
      <header class="flow">
        <h2 class="${
          targetRole
            ? "fs-600 ff-serif"
            : "fs-300 ff-sans-cond text-accent letter-spacing-3"
        } uppercase">${target?.role || "The terminology..."}</h2>
        <p class="fs-700 uppercase ff-serif">${target?.name}</p>
      </header>

      <p class="text-accent">${target?.bio || target?.description}</p>
    </article>

    <picture>
      <source
        srcset=${target?.images.webp || target?.images.landscape}
        type=${target?.images.webp ? "image/webp" : "image/jpg"}
      />
      <img src=${target?.images.png || target?.images.landscape} alt=${
      target?.name
    } />
    </picture>`;
    if (targetTech) {
      const template2 = `
      <picture class="desktop-picture">
          <source
            srcset=${target?.images.portrait}
            type="image/jpg"
          />
          <img
            src=${target?.images.portrait}
            alt=${target?.name}
          />
        </picture>
      `;
      template = template.concat(" ", template2);
    }

    mainContainer.insertAdjacentHTML("beforeend", template);
  }
}

function hideContent(parent: HTMLElement, content: string) {
  parent
    ?.querySelectorAll(content)
    .forEach((a) => a.setAttribute("hidden", "true"));
}

function showContent(parent: HTMLElement, content: string) {
  parent?.querySelector(`#${content}`)?.removeAttribute("hidden");
}
