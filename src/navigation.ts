const nav = document.querySelector(".primary-navigation") as HTMLUListElement;
const navToggle = document.querySelector(
  ".mobile-nav-toggle"
) as HTMLButtonElement;

// When someone clicks the hamburger button
navToggle.addEventListener("click", () => {
  const visibility = nav.dataset?.visible;

  if (visibility === "false") {
    nav.dataset.visible = "true";
    navToggle.setAttribute("aria-expanded", "true");
  } else {
    nav.dataset.visible = "false";
    navToggle.setAttribute("aria-expanded", "false");
  }
});
