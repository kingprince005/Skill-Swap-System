// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the navbar
    initializeNavbar();
    
    // Add hamburger menu event listener
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Check user authentication state
    checkAuthState();
    
    // Add event listeners for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Make sure profile dropdown stays visible if it should be
            setTimeout(checkAuthState, 100);
        });
    });
    
    // Add global click event to maintain auth state
    document.addEventListener('click', function(e) {
        // Don't interfere with the dropdown toggle functionality
        if (!e.target.closest('.profile-icon')) {
            setTimeout(checkAuthState, 100);
        }
    });
});

// Function to initialize navbar
function initializeNavbar() {
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown-menu a)');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Function to toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.classList.toggle('show-mobile');
    hamburger.classList.toggle('active');
    
    // Make sure profile dropdown visibility is maintained
    setTimeout(checkAuthState, 50);
}

// Function to check authentication state
function checkAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileDropdown = document.getElementById('profileDropdown');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser) {
        // User is logged in
        if (profileDropdown) {
            profileDropdown.style.display = 'block';
            document.getElementById('userInitial').textContent = currentUser.name.charAt(0).toUpperCase();
        }
        
        if (authButtons) {
            authButtons.style.display = 'none';
        }
    } else {
        // User is not logged in
        if (profileDropdown) {
            profileDropdown.style.display = 'none';
        }
        
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
    }
}

// Function to toggle profile dropdown
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.profile-dropdown')) {
            dropdown.style.display = 'none';
            document.removeEventListener('click', closeDropdown);
        }
    }, { once: true });
}

// Function to logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Function to scroll to a section smoothly
function scrollToSection(sectionId, e) {
    if (e) e.preventDefault(); // Prevent default link behavior
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80, // Account for navbar height
            behavior: 'smooth'
        });
    }
} 