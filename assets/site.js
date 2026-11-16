/* BStock — animações do site com Motion (molas físicas, interrompíveis).
   Personalidade "corporate/premium": entradas sobem 16px sem overshoot, cascata curta,
   feedback de toque com mola leve. Respeita "reduzir movimento". */
import { animate, inView, stagger, hover, press } from "https://cdn.jsdelivr.net/npm/motion@12.4.7/+esm";

window.__motion = true;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const enter = { type: "spring", visualDuration: 0.45, bounce: 0 };
const lift = { type: "spring", visualDuration: 0.3, bounce: 0.15 };
const tap = { type: "spring", visualDuration: 0.18, bounce: 0.3 };

if (!reduce) {
  // Entrada ao rolar: filhos de cada .reveal sobem + aparecem em cascata (máx. ~300ms de atraso)
  let seen = false;
  inView(".reveal", (group) => {
    seen = true;
    const kids = Array.from(group.children);
    animate(kids, { opacity: [0, 1], y: [16, 0] }, { ...enter, delay: stagger(0.06, { startDelay: 0.05 }) });
  }, { amount: 0.15, margin: "0px 0px -8% 0px" });
  // Salvaguarda: se o navegador não informar visibilidade (aba em segundo plano, leitores), mostra tudo
  setTimeout(() => { if (!seen) document.documentElement.classList.remove("js"); }, 2500);

  // Cards e amostras: sobem levemente no hover; mola interrompível
  hover(".card, .swatch, .asset, .rule", (el) => {
    animate(el, { y: -4 }, lift);
    return () => animate(el, { y: 0 }, lift);
  });

  // Botões: "apertam" e voltam com mola curta
  press(".btn, .swatch", (el) => {
    animate(el, { scale: 0.96 }, tap);
    return () => animate(el, { scale: 1 }, tap);
  });
} else {
  document.querySelectorAll(".reveal > *").forEach((el) => (el.style.opacity = 1));
}

// ---------- Copiar (cores, textos) ----------
const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
document.body.append(toast);
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}
async function copy(text, label) {
  try { await navigator.clipboard.writeText(text); showToast(`${label} copiado`); }
  catch { showToast("Não foi possível copiar"); }
}
document.querySelectorAll("[data-copy]").forEach((el) => {
  el.addEventListener("click", () => {
    const src = el.dataset.copyFrom ? document.querySelector(el.dataset.copyFrom)?.innerText : el.dataset.copy;
    if (src) copy(src.trim(), el.dataset.copyLabel || src.trim());
  });
});
