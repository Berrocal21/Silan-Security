document.addEventListener('DOMContentLoaded', () => {
  
  // --- Carrusel de la página principal ---
  const hero = document.querySelector('.hero');
  if (hero) {
    const slides = document.querySelectorAll('.slides img');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    let index = 0;

    // Mostrar la imagen especificada
    function showSlide(i) {
      slides.forEach((img, idx) => {
        img.classList.toggle('active', idx === i);
      });
    }

    // Evento botón siguiente
    if(next) {
      next.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        showSlide(index);
      });
    }

    // Evento botón anterior
    if(prev) {
      prev.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
      });
    }

    // Cambio automático cada 5 segundos
    let slideInterval = setInterval(() => {
      index = (index + 1) % slides.length;
      showSlide(index);
    }, 5000);

    // Inicializar el primer slide visible
    if(slides.length > 0) {
      showSlide(index);
    }
  }

  // --- Menú de navegación móvil (hamburguesa) ---
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');

  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      header.classList.toggle('nav-open');
    });
  }

  // --- Formulario de Contacto ---
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Previene el envío real del formulario

      // Simulación de envío
      // Aquí iría la lógica de envío (fetch, AJAX, etc.)
      
      // Mostrar mensaje de éxito (simulado)
      // En un caso real, esto dependería de la respuesta del servidor
      const formData = new FormData(contactForm);
      const nombre = formData.get('name');

      if (nombre) {
          formMessage.textContent = `¡Gracias por tu mensaje, ${nombre}! Nos pondremos en contacto contigo pronto.`;
          formMessage.className = 'success';
          contactForm.reset(); // Limpia el formulario
      } else {
          formMessage.textContent = 'Por favor, completa todos los campos requeridos.';
          formMessage.className = 'error';
      }

      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = '';
      }, 5000);
    });
  }

  // --- Lightbox de Galería (para nosotros.html) ---
  const galleryGrid = document.querySelector('.gallery-grid');
  const lightbox = document.getElementById('lightbox');
  
  if (galleryGrid && lightbox) {
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-cap');
    const lbClose = document.querySelector('.lb-close');

    galleryGrid.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (!img) return;
      
      // Usa src como fallback si data-full no existe
      lbImg.src = img.dataset.full || img.src; 
      lbImg.alt = img.alt || '';
      lbCap.textContent = img.alt || '';
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbImg.src = ''; // Limpia el src para evitar flashes
    };

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      // Cierra si se hace clic en el fondo, no en la imagen
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Cierra con la tecla Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
        closeLightbox();
      }
    });
  }

});

// --- Funcionalidad del Formulario de Comentarios ---
  const commentForms = document.querySelectorAll('.comment-form'); // Selecciona todos los formularios de comentarios

  commentForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Previene el envío real del formulario

      // Obtener los datos del formulario
      const nameInput = form.querySelector('#name');
      const commentInput = form.querySelector('#comment');
      const name = nameInput.value.trim();
      const commentText = commentInput.value.trim();

      // Validación simple
      if (!name || !commentText) {
        alert('Por favor, ingresa tu nombre y comentario.');
        return; // Detiene la ejecución si falta algo
      }

      // Obtener la sección de comentarios padre
      const commentsSection = form.closest('.comments-section');
      if (!commentsSection) return; // Salir si no se encuentra la sección

      // Crear el HTML para el nuevo comentario
      const newCommentHTML = `
        <div class="comment">
            <img src="https://placehold.co/50x50/eeeeee/aaaaaa?text=${name.substring(0,1).toUpperCase()}" alt="Avatar" class="avatar">
            <div class="comment-body">
                <span class="author">${escapeHTML(name)}</span>
                <span class="date">${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
                <p>${escapeHTML(commentText)}</p>
            </div>
        </div>
      `;

      // Insertar el nuevo comentario ANTES del formulario
      form.insertAdjacentHTML('beforebegin', newCommentHTML);

      // Limpiar el formulario
      nameInput.value = '';
      commentInput.value = '';
      // Si usaste el campo de email, límpialo también:
      // const emailInput = form.querySelector('#email');
      // if (emailInput) emailInput.value = '';

      // Opcional: Actualizar el contador de comentarios
      const commentCountHeader = commentsSection.querySelector('h3');
      if (commentCountHeader) {
          // Extrae el número actual (si existe) o asume 0
          const match = commentCountHeader.textContent.match(/\((\d+)\)/);
          const currentCount = match ? parseInt(match[1], 10) : 0;
          commentCountHeader.textContent = `Comentarios (${currentCount + 1})`;
      }

      // Opcional: Eliminar el mensaje "Aún no hay comentarios" si existe
      const noCommentsMessage = commentsSection.querySelector('p[style*="italic"]');
      if (noCommentsMessage) {
        noCommentsMessage.remove();
      }
    });
  });

  // Función auxiliar para evitar inyección de HTML (XSS básico)
  function escapeHTML(str) {
      return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
  }