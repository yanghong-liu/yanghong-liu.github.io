const figureDialog = document.querySelector('#figure-dialog');
const enlargedFigure = document.querySelector('#enlarged-figure');
let figureTrigger;
document.querySelectorAll('a[data-zoom]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !figureDialog.showModal) return;
    event.preventDefault();
    figureTrigger = link;
    enlargedFigure.src = link.href;
    enlargedFigure.alt = link.querySelector('img').alt;
    document.querySelector('#original-figure').href = link.href;
    document.querySelector('#figure-caption').textContent = link.closest('figure').querySelector('figcaption').textContent.replace('Click any figure to enlarge.', '').trim();
    figureDialog.showModal();
    document.querySelector('#close-figure').focus();
  });
});
document.querySelector('#close-figure').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', event => {
  const bounds = figureDialog.getBoundingClientRect();
  if (event.target === figureDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) figureDialog.close();
});
figureDialog.addEventListener('close', () => figureTrigger?.focus());
