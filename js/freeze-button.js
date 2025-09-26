document.addEventListener('DOMContentLoaded', function() {
    // Function to prevent all animations and transitions
    function preventAnimations(element) {
        if (!element) return;
        
        // Apply styles to prevent any movement
        const styles = {
            'transform': 'none !important',
            'transition': 'none !important',
            'animation': 'none !important',
            'will-change': 'auto !important',
            'backface-visibility': 'visible !important',
            'perspective': 'none !important',
            'transform-style': 'flat !important',
            'position': 'relative !important',
            'top': '0 !important',
            'left': '0 !important',
            'right': '0 !important',
            'bottom': '0 !important'
        };
        
        // Apply styles to the element
        Object.assign(element.style, styles);
        
        // Also apply to all children
        Array.from(element.getElementsByTagName('*')).forEach(child => {
            Object.assign(child.style, styles);
        });
    }
    
    // Target the CTA button and its wrapper
    const ctaWrapper = document.querySelector('.cta-button-wrapper');
    const ctaLink = document.querySelector('.cta-image-link');
    const ctaImage = document.querySelector('.cta-button-image');
    
    // Apply the freeze to all relevant elements
    [ctaWrapper, ctaLink, ctaImage].forEach(element => {
        if (element) {
            preventAnimations(element);
            
            // Re-apply on mouse events to ensure styles stick
            ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach(event => {
                element.addEventListener(event, function(e) {
                    preventAnimations(this);
                    // Prevent default to be extra sure
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }, true); // Use capture phase to catch the event early
            });
        }
    });
    
    // Also add a global style to prevent any transforms
    const style = document.createElement('style');
    style.textContent = `
        .cta-button-wrapper *,
        .cta-button-wrapper *:before,
        .cta-button-wrapper *:after,
        .cta-image-link,
        .cta-image-link *,
        .cta-button-image,
        .cta-button-image * {
            transform: none !important;
            -webkit-transform: none !important;
            -moz-transform: none !important;
            -ms-transform: none !important;
            -o-transform: none !important;
            transition: none !important;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            animation: none !important;
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            will-change: auto !important;
            backface-visibility: visible !important;
            perspective: none !important;
            transform-style: flat !important;
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
        }
    `;
    document.head.appendChild(style);
});
