// main.js
// Lógica para seleccionar partido y actualizar imágenes en votar.html

// Función para manejar el clic en las tarjetas del tarjetón
function showExcludedPartyModal() {
  // Si el modal ya existe, solo mostrarlo
  let modal = document.getElementById('excluded-party-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'excluded-party-modal';
    modal.innerHTML = `
      <div class="epm-backdrop" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9998;"></div>
      <div class="epm-modal-content" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:2em 2.5em;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.2);z-index:9999;display:flex;flex-direction:column;align-items:center;max-width:90vw;">
        <div class="epm-close" style="align-self:flex-end;cursor:pointer;font-size:1.5em;color:#e53935;font-weight:bold;line-height:1;">&times;</div>
        <div style="font-size:3em;color:#e53935;margin-bottom:0.5em;">&#10006;</div>
        <div style="font-size:1.2em;text-align:center;font-weight:500;">¡Cuidado! En esta opción no votas por LILYS OSUNA</div>
      </div>
    `;
    document.body.appendChild(modal);
    // Cerrar al hacer clic en la X
    modal.querySelector('.epm-close').onclick = function() {
      modal.style.display = 'none';
    };
    // Cerrar al hacer clic fuera del modal
    modal.querySelector('.epm-backdrop').onclick = function() {
      modal.style.display = 'none';
    };
  } else {
    modal.style.display = '';
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
    logo.addEventListener('click', function() {
      const alt = logo.getAttribute('alt');
      if (excludedParties.includes(alt)) {
        showExcludedPartyModal();
        return;
      }
      // Guardar la ruta de la imagen seleccionada en localStorage
      localStorage.setItem('selectedPartyImg', logo.getAttribute('src'));
      // Redirigir a votar.html en la misma ventana
      window.location.href = 'votar.html';
    });
  });
}

// Función para actualizar las imágenes de partido en votar.html
function updateVotarPartyImages() {
  const selectedImg = localStorage.getItem('selectedPartyImg');
  if (selectedImg) {
    const partyImgs = document.querySelectorAll('.partido img');
    partyImgs.forEach(function(img) {
      img.setAttribute('src', selectedImg);
    });
  }
}

// Detectar en qué página estamos y ejecutar la función correspondiente
if (window.location.pathname.endsWith('tarjeton.html')) {
  window.addEventListener('DOMContentLoaded', setupPartyLogoClicks);
}
if (window.location.pathname.endsWith('votar.html')) {
  window.addEventListener('DOMContentLoaded', updateVotarPartyImages);
} 