// Lightbox
const grid = document.querySelector('.gallery-grid');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('lightbox-cap');
const lbClose = document.querySelector('.lb-close');

if (grid && lightbox) {
  grid.addEventListener('click', e => {
    const img = e.target.closest('img');
    if (!img) return;
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  const close = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
      lbClose.click();
    }
  });
}
