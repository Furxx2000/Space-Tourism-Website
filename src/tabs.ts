const tabList = document.querySelector('[role="tablist"]') as HTMLDivElement;
const tabs = tabList?.querySelectorAll<HTMLElement>('[role="tab"]');

interface Crew {
  name: string;
  images: { png: string; webp: string };
  role: string;
  bio: string;
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
  const targetBtn = e.target as HTMLButtonElement;
  const targetPanel = targetBtn.getAttribute("aria-controls")!;
  const targetImage = targetBtn.dataset?.image!;
  const targetRole = targetBtn.dataset?.role;
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
  } else if (targetRole) {
    const response = await fetch("../dist/model/data.json");
    const result = await response.json();
    const crews = <Crew[]>result.crew;
    const crew = crews.find((c) => c.role === targetRole);
    const crewArticle = document.querySelector(
      ".grid-container--crew > article"
    );
    const crewPicture = document.querySelector(
      ".grid-container--crew > picture"
    );
    crewArticle?.remove();
    crewPicture?.remove();
    const template = `
    <article class="crew-details flow">
    <header class="flow flow--space-small">
      <h2 class="fs-600 ff-serif uppercase">${crew?.role}</h2>
      <p class="fs-700 uppercase ff-serif">${crew?.name}</p>
    </header>

    <p class="text-accent">${crew?.bio}</p>
  </article>

  <picture>
    <source
      srcset=${crew?.images.webp}
      type="image/webp"
    />
    <img src=${crew?.images.png} alt=${crew?.name} />
  </picture>`;
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
