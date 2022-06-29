const tabList = document.querySelector('[role="tablist"]') as HTMLDivElement;
const tabs = tabList?.querySelectorAll<HTMLElement>('[role="tab"]');

tabList?.addEventListener("keydown", changeTabFocus);

tabs.forEach((t) => {
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

function changeTabPanel(e: MouseEvent) {
  const targetBtn = e.target as HTMLButtonElement;
  const targetPanel = targetBtn.getAttribute("aria-controls") as string;
  const targetImage = targetBtn.dataset.image as string;
  const tabContainer = targetBtn.parentNode as HTMLElement;
  const mainContainer = tabContainer?.parentNode as HTMLElement;

  hideContent(mainContainer, '[role="tabpanel"]');
  showContent(mainContainer, targetPanel);

  hideContent(mainContainer, "picture");
  showContent(mainContainer, targetImage);

  tabContainer
    ?.querySelector("[aria-selected='true']")
    ?.setAttribute("aria-selected", "false");
  targetBtn.setAttribute("aria-selected", "true");
}

function hideContent(parent: HTMLElement, content: string) {
  parent
    ?.querySelectorAll(content)
    .forEach((a) => a.setAttribute("hidden", "true"));
}

function showContent(parent: HTMLElement, content: string) {
  parent?.querySelector(`#${content}`)?.removeAttribute("hidden");
}
