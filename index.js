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


  // --- Funcionalidad de Filtrado de Categorías en Blog ---

  // Solo ejecuta esto si estamos en la página del blog
  if (document.body.contains(document.querySelector('.blog-grid'))) { // Verifica si existe la rejilla de artículos

    const articles = document.querySelectorAll('.blog-grid .article-card');
    const categoryLinks = document.querySelectorAll('.blog-sidebar .sidebar-widget ul li a');
    const blogTitle = document.querySelector('.page-header h2'); // Título "Blog de Seguridad"

    // Función para filtrar artículos
    const filterArticles = (category) => {
      let articlesFound = 0;
      articles.forEach(article => {
        // Si no hay categoría (mostrar todos con href="#") O la categoría coincide
        if (!category || article.dataset.category === category) {
          article.style.display = 'flex'; // Muestra el artículo (flex porque así se ve en desktop)
          articlesFound++;
        } else {
          article.style.display = 'none'; // Oculta el artículo
        }
      });

      // Actualizar título (opcional)
      if (blogTitle) {
          if (category) {
              // Intenta encontrar el texto del enlace de la categoría seleccionada
              const activeLink = Array.from(categoryLinks).find(link => link.getAttribute('href') === `#${category}`);
              blogTitle.textContent = activeLink ? `Blog: ${activeLink.textContent}` : `Blog: ${category}`;
          } else {
              blogTitle.textContent = 'Blog de Seguridad'; // Título original
          }
      }

      // Mostrar mensaje si no se encuentran artículos (opcional)
      const grid = document.querySelector('.blog-grid');
      let noResultMessage = grid.querySelector('.no-results-message');
      if (articlesFound === 0 && category) {
          if (!noResultMessage) {
              noResultMessage = document.createElement('p');
              noResultMessage.className = 'no-results-message';
              noResultMessage.textContent = 'No hay artículos en esta categoría.';
              noResultMessage.style.textAlign = 'center';
              noResultMessage.style.marginTop = '20px';
              // Inserta el mensaje después de la rejilla o en otro lugar adecuado
              grid.parentNode.insertBefore(noResultMessage, grid.nextSibling);
          }
      } else if (noResultMessage) {
          noResultMessage.remove();
      }
    };

    // Event listener para los clics en enlaces de categoría
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Solo previene el comportamiento por defecto si es un enlace de filtro (# o #categoria) en la página actual
        if (href.startsWith('#')) {
          e.preventDefault(); // Evita el salto de página brusco
          const category = href.substring(1); // Obtiene el nombre de la categoría sin el # (será vacío si es solo '#')
          window.location.hash = category; // Actualiza el hash en la URL (opcional pero bueno para compartir/navegar)
          // Llama a filtrar ('null' si category está vacío, que corresponde a '#')
          filterArticles(category || null);
        }
        // Si es un enlace a blog.html (desde un artículo), deja que navegue normalmente
      });
    });

    // Filtrar al cargar la página basado en el hash actual en la URL
    const initialCategory = window.location.hash.substring(1);
    filterArticles(initialCategory || null); // Llama a filtrar con la categoría inicial (o null si no hay hash)

     // Escuchar cambios en el hash (botones atrás/adelante del navegador)
      window.addEventListener('hashchange', () => {
        const newCategory = window.location.hash.substring(1);
        filterArticles(newCategory || null);
    });
  }
  // --- Fin de Funcionalidad de Filtrado ---