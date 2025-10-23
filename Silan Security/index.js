document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slides img');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  let index = 0;

  // Mostrar la primera imagen al cargar
  function showSlide(i) {
    slides.forEach((img, idx) => {
      img.classList.toggle('active', idx === i);
    });
  }

  // Evento botón siguiente
  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  });

  // Evento botón anterior
  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  });

  // Cambio automático cada 5 segundos
  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 5000);

  // Inicializar el primer slide visible
  showSlide(index);
});
