export const GLOSSARY = {
  'Ayin': 'Nothingness; the no-thing state preceding creation.',
  'Shevirah': 'The shattering of the vessels in the world of Tohu.',
  'Tzimtzum': 'The primordial contraction allowing space for creation.',
  'Ohr Chozer': 'Returning Light; the response of the vessel to the Light.'
};

export function linkGlossaryTerms(element) {
  if (!element) return;
  const terms = Object.keys(GLOSSARY);
  terms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    element.innerHTML = element.innerHTML.replace(regex, `<span class="glossary-term" data-term="${term}">${term}</span>`);
  });
}

export function setupGlossaryPopups() {
  document.body.addEventListener('mouseenter', (e) => {
    const target = e.target.closest('.glossary-term');
    if (!target) return;
    let tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    tooltip.textContent = GLOSSARY[target.dataset.term] || '';
    document.body.appendChild(tooltip);
    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 4}px`;
    target._tooltip = tooltip;
  }, true);

  document.body.addEventListener('mouseleave', (e) => {
    const target = e.target.closest('.glossary-term');
    if (target && target._tooltip) {
      target._tooltip.remove();
      target._tooltip = null;
    }
  }, true);
}
