const overview = document.querySelector('#pridex-overview video');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (overview) {
  // Open on the task demonstrations; the original film stays available in full.
  overview.addEventListener('loadedmetadata', () => {
    if (!reducedMotion.matches) overview.currentTime = 8;
  }, {once: true});
  const applyMotionPreference = () => {
    overview.autoplay = !reducedMotion.matches;
    if (reducedMotion.matches) overview.pause();
  };
  applyMotionPreference();
  reducedMotion.addEventListener('change', applyMotionPreference);
}
