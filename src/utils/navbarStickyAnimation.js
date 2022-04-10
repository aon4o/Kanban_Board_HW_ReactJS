document.addEventListener("DOMContentLoaded", function(){
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        const navbarContainer = document.getElementById('navbar-container');
        if (window.scrollY > 160) {
            navbar.classList.add('fixed-top', 'bg-primary', 'shadow-lg-mine');
            navbarContainer.classList.remove('mt-3', 'px-3', 'py-2', 'shadow-lg-mine');
        } else {
            navbar.classList.remove('fixed-top', 'bg-primary', 'shadow-lg-mine');
            navbarContainer.classList.add('mt-3', 'px-3', 'py-2', 'shadow-lg-mine');
        }
    });
});