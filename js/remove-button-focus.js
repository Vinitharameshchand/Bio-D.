// Remove focus outline on click for all buttons and links
document.addEventListener('DOMContentLoaded', function() {
    // Function to handle mousedown events
    function handleMouseDown(e) {
        // Only prevent default for left mouse button (button 0)
        if (e.button === 0) {
            this.style.outline = 'none';
            // Add a class to prevent focus
            this.classList.add('no-focus');
        }
    }

    // Function to handle click events
    function handleClick(e) {
        // If the element has our no-focus class, prevent focus
        if (this.classList.contains('no-focus')) {
            e.preventDefault();
            this.blur();
            // Remove the class after a short delay
            setTimeout(() => this.classList.remove('no-focus'), 100);
            
            // If it's a link, navigate after a short delay
            if (this.tagName === 'A' || this.closest('a')) {
                const link = this.tagName === 'A' ? this : this.closest('a');
                if (link && link.href) {
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 10);
                }
            }
        }
    }

    // Add event listeners for all interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [tabindex], .cta-button, .about-cta-btn');
    
    interactiveElements.forEach(element => {
        // Handle mousedown
        element.addEventListener('mousedown', handleMouseDown);
        
        // Handle click
        element.addEventListener('click', handleClick);
        
        // Handle touch
        element.addEventListener('touchstart', function() {
            this.style.outline = 'none';
        }, { passive: true });
    });

    // Add CSS to handle the no-focus state
    const style = document.createElement('style');
    style.textContent = `
        .no-focus {
            outline: none !important;
        }
        
        /* Ensure focus is only visible for keyboard users */
        body:not(.keyboard-user) button:focus,
        body:not(.keyboard-user) a:focus,
        body:not(.keyboard-user) [tabindex]:focus {
            outline: none !important;
        }
    `;
    document.head.appendChild(style);

    // Detect keyboard users
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });

    // Detect mouse users
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-user');
    });
});
