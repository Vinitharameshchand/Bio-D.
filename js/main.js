// main.js for Bio D
// Add your interactive JS here

// Example: Navbar hamburger toggle (for mobile)
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('nav-menu-active');
    });
  }
});
