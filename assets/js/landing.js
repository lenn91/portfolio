/* Landing page behaviour: pointer spotlight and the curtain wipe before entering the portfolio. */
const stage = document.querySelector("#stage");
const go = document.querySelector("#go");
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

addEventListener("pointermove", e => {
  stage.style.setProperty("--mx", e.clientX + "px");
  stage.style.setProperty("--my", e.clientY + "px");
}, { passive: true });

go.addEventListener("click", e => {
  if (reduce || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let the link work normally
  e.preventDefault();
  document.body.classList.add("leaving");
  setTimeout(() => { location.href = go.href; }, 700);
});

