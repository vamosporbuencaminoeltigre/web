// votar.js - Versión Mobile - Compatibilidad Universal

// Detectar el tipo de dispositivo
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(navigator.userAgent);
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function showVotarAlertaModal() {
  let modal = document.getElementById('votar-alerta-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'votar-alerta-modal';
    modal.innerHTML = `
      <div class="vam-backdrop" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9998;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);"></div>
      <div class="vam-modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:1.5em;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:9999;display:flex;flex-direction:column;align-items:center;max-width:85vw;min-width:280px;border:1px solid rgba(0,0,0,0.1);">
        <div class="vam-close" style="align-self:flex-end;cursor:pointer;font-size:1.8em;color:#e53935;font-weight:bold;line-height:1;margin-bottom:10px;padding:5px;-webkit-tap-highlight-color:transparent;">&times;</div>
        <div style="font-size:2.5em;color:#e53935;margin-bottom:0.5em;">&#9888;</div>
        <div style="font-size:1.1em;text-align:center;font-weight:600;line-height:1.3;color:#333;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;">
          NI LO INTENTES<br>PRESIONA SOLO VOTAR
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic en la X
    const closeBtn = modal.querySelector('.vam-close');
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      modal.style.display = 'none';
    });
    
    // Cerrar al hacer clic fuera del modal
    const backdrop = modal.querySelector('.vam-backdrop');
    backdrop.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      modal.style.display = 'none';
    });
    
    // Cerrar con la tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display !== 'none') {
        modal.style.display = 'none';
      }
    });
    
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    modal.style.display = '';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }
}

function showVotoExitoso() {
  // Ocultar todo el contenido principal
  const contenedor = document.querySelector('.contenedor-votacion');
  if (contenedor) contenedor.style.display = 'none';

  // Crear contenedor de mensaje de éxito con imagen voto.png
  let exitoDiv = document.getElementById('voto-exitoso');
  if (!exitoDiv) {
    exitoDiv = document.createElement('div');
    exitoDiv.id = 'voto-exitoso';
    exitoDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100vw;
      background: #fff;
      padding: 0;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
    `;
    exitoDiv.innerHTML = `
      <img src="inicio/voto.png" alt="Voto Exitoso" loading="eager" id="img-voto-exito" style="max-width:100vw;max-height:100vh;width:100vw;height:100vh;object-fit:contain;cursor:pointer;">
      <button id="cerrar-voto-exito" style="position:absolute;top:18px;right:18px;background:#e53935;color:#fff;border:none;border-radius:50%;width:40px;height:40px;font-size:2em;line-height:1;cursor:pointer;z-index:10001;">&times;</button>
    `;
    document.body.appendChild(exitoDiv);

    // Cerrar al hacer clic en la imagen o el botón
    const cerrar = () => { window.location.href = 'inicio.html'; };
    document.getElementById('img-voto-exito').onclick = cerrar;
    document.getElementById('cerrar-voto-exito').onclick = cerrar;
    exitoDiv.addEventListener('touchstart', cerrar);
  } else {
    exitoDiv.style.display = 'flex';
  }
}

function updateVotarPartyImages() {
  const selectedImg = localStorage.getItem('selectedPartyImg');
  if (selectedImg) {
    const partyImgs = document.querySelectorAll('.partido img');
    partyImgs.forEach(function(img) {
      img.setAttribute('src', selectedImg);
    });
  }
}

function setupVotarAlerta() {
  // Mostrar alerta al hacer clic o tocar cualquier tarjeta de partido
  const partidos = document.querySelectorAll('.partido');
  partidos.forEach(function(partido) {
    // Click
    partido.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showVotarAlertaModal();
    });
    // Touch
    partido.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showVotarAlertaModal();
    }, { passive: false });
  });

  // Botón votar
  const votarBtn = document.querySelector('.boton-votar');
  if (votarBtn) {
    const votarHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      showVotoExitoso();
    };
    votarBtn.addEventListener('click', votarHandler);
    votarBtn.addEventListener('touchstart', votarHandler, { passive: false });
  }

  // Prevenir zoom en toda la página
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Prevenir doble tap para zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
  
  // Prevenir scroll en el body
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  
  // Prevenir selección de texto
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });
  
  // Prevenir arrastrar elementos
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });
  
  // Configuraciones específicas para iOS
  if (isIOS) {
    // Prevenir zoom en iOS
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
      e.preventDefault();
    });
    
    document.addEventListener('gestureend', function(e) {
      e.preventDefault();
    });
    
    // Prevenir scroll elástico en iOS
    document.body.style.webkitOverflowScrolling = 'touch';
  }
  
  // Configuraciones específicas para Android
  if (isAndroid) {
    // Prevenir zoom en Android
    document.addEventListener('touchmove', function(e) {
      if (e.scale !== 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  // Prevenir que la página se mueva al hacer scroll
  window.addEventListener('scroll', function(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  }, { passive: false });
  
  // Prevenir resize del viewport
  window.addEventListener('resize', function() {
    // Forzar el viewport a permanecer estable
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
  });
}

// --- INICIO FUNCIÓN DE ORIENTACIÓN CLONADA DE TARJETON ---
function checkOrientation() {
  const grid = document.querySelector('.contenedor-votacion');
  const message = document.querySelector('.rotate-message');
  if (!grid || !message) return;
  // Detectar si es dispositivo móvil
  const isMobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    if (window.matchMedia("(orientation: portrait)").matches) {
      grid.style.display = 'none';
      message.style.display = 'flex';
    } else {
      grid.style.display = '';
      message.style.display = 'none';
    }
  } else {
    grid.style.display = '';
    message.style.display = 'none';
  }
}

function ensureViewport() {
  if (window.innerWidth <= 768) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
  }
}

if (window.location.pathname.endsWith('votar.html') || window.location.pathname.endsWith('votar.html/')) {
  window.addEventListener('DOMContentLoaded', function() {
    ensureViewport();
    checkOrientation();
  });
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      ensureViewport();
      checkOrientation();
    }, 100);
  });
  window.addEventListener('resize', function() {
    setTimeout(function() {
      ensureViewport();
      checkOrientation();
    }, 50);
  });
}
// --- FIN FUNCIÓN DE ORIENTACIÓN CLONADA DE TARJETON ---

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    updateVotarPartyImages();
    setupVotarAlerta();
  });
} else {
  updateVotarPartyImages();
  setupVotarAlerta();
}

// Asegurar que funcione incluso si se carga después
window.addEventListener('load', function() {
  if (!document.querySelector('.partido img')) {
    setTimeout(setupVotarAlerta, 100);
  }
}); 
