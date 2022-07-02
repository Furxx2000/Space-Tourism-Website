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
    const response = await fetch("./model/data.json");
    const result = await response.json();
    const targetData = result.find(
      (d: Data) => d?.role || d?.name === targetRole
    );
    console.log(targetData);
    const crewArticle = document.querySelector(
      ".grid-container--crew > article"
    );
    const crewPicture = document.querySelector(
      ".grid-container--crew > picture"
    );
    crewArticle?.remove();
    crewPicture?.remove();
    //   const template = `
    //   <article class="crew-details flow">
    //   <header class="flow flow--space-small">
    //     <h2 class="fs-600 ff-serif uppercase">${
    //       crew?.role || "The terminology..."
    //     }</h2>
    //     <p class="fs-700 uppercase ff-serif">${crew?.name}</p>
    //   </header>

    //   <p class="text-accent">${crew?.bio || crew?.description}</p>
    // </article>

    // <picture>
    //   <source
    //     srcset=${crew?.images.webp || crew?.images.landscape}
    //     type=${crew?.images.webp ? "image/webp" : "image/jpg"}
    //   />
    //   <img src=${crew?.images.png || crew?.images.landscape} alt=${crew?.name} />
    // </picture>`;

    // mainContainer.insertAdjacentHTML("beforeend", template);
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
