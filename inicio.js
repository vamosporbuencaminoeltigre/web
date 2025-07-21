// Intentar bloquear la orientación a vertical (portrait) en navegadores compatibles
if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait').catch(function(){});
}
// Configuración completa para dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
    
    // Prevenir zoom en todos los dispositivos
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
    
    // Prevenir doble tap para zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevenir gestos de zoom (iOS)
    document.addEventListener('gesturestart', function(event) {
        event.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(event) {
        event.preventDefault();
    });
    
    document.addEventListener('gestureend', function(event) {
        event.preventDefault();
    });
    
    // Prevenir scroll y zoom adicional
    document.addEventListener('wheel', function(event) {
        event.preventDefault();
    }, { passive: false });
    
    // Funcionalidad del botón de votar
    const voteButton = document.querySelector('.vote-button');
    
    // Función para manejar el click/touch
    function handleVoteClick() {
        // Efecto visual al presionar
        voteButton.style.transform = 'translateX(-50%) scale(0.9)';
        
        setTimeout(() => {
            voteButton.style.transform = 'translateX(-50%) scale(1)';
        }, 150);
        
        // Redirigir a la página del tarjetón
        console.log('Redirigiendo al tarjetón de votación...');
        
        // Pequeña pausa para mostrar el efecto visual antes de redirigir
        setTimeout(() => {
            window.location.href = 'tarjeton.html';
        }, 200);
    }
    
    // Event listeners para máxima compatibilidad
    voteButton.addEventListener('click', handleVoteClick);
    voteButton.addEventListener('touchend', handleVoteClick);
    
    // Efectos táctiles para feedback visual
    voteButton.addEventListener('touchstart', function() {
        this.style.transform = 'translateX(-50%) scale(1.05)';
    });
    
    voteButton.addEventListener('touchcancel', function() {
        this.style.transform = 'translateX(-50%) scale(1)';
    });
    
    // Prevenir selección de texto
    document.addEventListener('selectstart', function(event) {
        event.preventDefault();
    });
    
    // Prevenir arrastrar elementos
    document.addEventListener('dragstart', function(event) {
        event.preventDefault();
    });
    
    // Detectar dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        console.log('Dispositivo móvil detectado');
    }
    
    // Ajustar altura para dispositivos con barra de navegación
    function adjustViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', adjustViewportHeight);
    window.addEventListener('orientationchange', adjustViewportHeight);
    adjustViewportHeight();
    
    console.log('Sitio web móvil completamente cargado y optimizado');
});
