// tarjeton.js - Versión únicamente móvil - Optimizado para iPhone y Android
// Lógica para seleccionar partido y actualizar imágenes en votar.html

// Prevenir zoom y comportamientos no deseados
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

document.addEventListener('gesturechange', function(e) {
  e.preventDefault();
});

document.addEventListener('gestureend', function(e) {
  e.preventDefault();
});

// Función para manejar el clic en las tarjetas del tarjetón
function showExcludedPartyModal() {
  // Si el modal ya existe, solo mostrarlo
  let modal = document.getElementById('excluded-party-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'excluded-party-modal';
    modal.innerHTML = `
      <div class="epm-backdrop" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:9998;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);"></div>
      <div class="epm-modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:1.5em 2em;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:9999;display:flex;flex-direction:column;align-items:center;max-width:85vw;min-width:280px;text-align:center;">
        <div class="epm-close" style="align-self:flex-end;cursor:pointer;font-size:1.8em;color:#e53935;font-weight:bold;line-height:1;margin-bottom:10px;">&times;</div>
        <div style="font-size:2.5em;color:#e53935;margin-bottom:0.8em;">&#10006;</div>
        <div style="font-size:1.1em;text-align:center;font-weight:500;line-height:1.4;color:#333;">¡Cuidado! En esta opción no votas por LILYS OSUNA</div>
        <button style="margin-top:1.5em;padding:0.8em 1.5em;background:#e53935;color:white;border:none;border-radius:8px;font-size:1em;font-weight:500;cursor:pointer;" onclick="closeModal()">Entendido</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic en la X
    modal.querySelector('.epm-close').onclick = function() {
      closeModal();
    };
    
    // Cerrar al hacer clic fuera del modal
    modal.querySelector('.epm-backdrop').onclick = function() {
      closeModal();
    };
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  } else {
    modal.style.display = '';
  }
}

function closeModal() {
  const modal = document.getElementById('excluded-party-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function setupPartyLogoClicks() {
  const excludedParties = [
    'PSUV', 'TUPAMARO', 'PPT', 'SOMOS VENEZUELA', 'Futuro', 'MEP', 'PODEMOS',
    'PCV', 'Alianza para el Cambio', 'ORA', 'UPV', 'Enamórate Venezuela',
    'PARTIDO VERDE', 'PRN', 'UNICA', 'UNE'
  ];
  
  const partyLogos = document.querySelectorAll('.party-logo img');
  
  partyLogos.forEach(function(logo) {
    const logoContainer = logo.parentElement;
    
    // Agregar eventos tanto para clic como para toque
    const handleSelection = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const alt = logo.getAttribute('alt');
      if (excludedParties.includes(alt)) {
        showExcludedPartyModal();
        return;
      }
      
      // Efecto visual de selección
      logoContainer.style.transform = 'scale(0.95)';
      setTimeout(() => {
        logoContainer.style.transform = '';
      }, 150);
      
      // Guardar la ruta de la imagen seleccionada en localStorage
      localStorage.setItem('selectedPartyImg', logo.getAttribute('src'));
      localStorage.setItem('selectedPartyName', alt);
      
      // Redirigir a votar.html en la misma ventana
      setTimeout(() => {
        window.location.href = 'votar.html';
      }, 200);
    };
    
    // Eventos para dispositivos táctiles (optimizados para iOS y Android)
    let touchStartTime = 0;
    let touchStartY = 0;
    
    logoContainer.addEventListener('touchstart', function(e) {
      touchStartTime = Date.now();
      touchStartY = e.touches[0].clientY;
      this.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    logoContainer.addEventListener('touchmove', function(e) {
      const touchY = e.touches[0].clientY;
      const deltaY = Math.abs(touchY - touchStartY);
      
      // Si el usuario hace scroll, cancelar la selección
      if (deltaY > 10) {
        this.style.transform = '';
      }
    }, { passive: true });
    
    logoContainer.addEventListener('touchend', function(e) {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      // Solo procesar si fue un toque corto (menos de 500ms)
      if (touchDuration < 500) {
        this.style.transform = '';
        handleSelection(e);
      } else {
        this.style.transform = '';
      }
    }, { passive: false });
    
    // Evento de clic para compatibilidad
    logoContainer.addEventListener('click', handleSelection);
  });
}

// Función para actualizar las imágenes de partido en votar.html
function updateVotarPartyImages() {
  const selectedImg = localStorage.getItem('selectedPartyImg');
  const selectedName = localStorage.getItem('selectedPartyName');
  
  if (selectedImg) {
    const partyImgs = document.querySelectorAll('.partido img');
    partyImgs.forEach(function(img) {
      img.setAttribute('src', selectedImg);
    });
  }
  
  if (selectedName) {
    const partyNames = document.querySelectorAll('.partido .nombre-partido');
    partyNames.forEach(function(nameElement) {
      nameElement.textContent = selectedName;
    });
  }
}

// Función para verificar orientación y mostrar/ocultar mensaje
function checkOrientation() {
  const grid = document.querySelector('.party-grid');
  const message = document.querySelector('.rotate-message');
  
  if (!grid || !message) return;
  
  // Detectar si es dispositivo móvil
  const isMobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Solo aplicar en dispositivos móviles
    if (window.matchMedia("(orientation: portrait)").matches) {
      // Vertical - mostrar mensaje de rotación
      grid.style.display = 'none';
      message.style.display = 'flex';
    } else {
      // Horizontal - mostrar tarjetón
      grid.style.display = 'grid';
      message.style.display = 'none';
    }
  } else {
    // Escritorio - siempre mostrar tarjetón
    grid.style.display = 'grid';
    message.style.display = 'none';
  }
}

// Función para asegurar que el viewport se mantenga correcto
function ensureViewport() {
  // Forzar el viewport en dispositivos móviles
  if (window.innerWidth <= 768) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
  }
}

// Detectar en qué página estamos y ejecutar la función correspondiente
if (window.location.pathname.endsWith('tarjeton.html') || window.location.pathname.endsWith('tarjeton.html/')) {
  window.addEventListener('DOMContentLoaded', function() {
    ensureViewport();
    setupPartyLogoClicks();
    checkOrientation();
  });
  
  // Ejecutar al cambiar orientación
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      ensureViewport();
      checkOrientation();
    }, 100); // Pequeño delay para asegurar que la orientación se actualice
  });
  
  window.addEventListener('resize', function() {
    setTimeout(function() {
      ensureViewport();
      checkOrientation();
    }, 50);
  });
  
  // Prevenir comportamientos no deseados en iOS
  document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.party-grid')) {
      e.preventDefault();
    }
  }, { passive: false });
}

if (window.location.pathname.endsWith('votar.html') || window.location.pathname.endsWith('votar.html/')) {
  window.addEventListener('DOMContentLoaded', updateVotarPartyImages);
} 