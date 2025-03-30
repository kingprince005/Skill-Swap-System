// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }
            
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Logging in...';
            submitButton.disabled = true;
            
            // Simulate API call for login
            setTimeout(() => {
                // For demo purposes, using localStorage to check credentials
                // In a real app, this would be an API call to your backend
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Login successful
                    // Store user info in localStorage (in real app, store JWT token)
                    localStorage.setItem('currentUser', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        bio: user.bio || '',
                        skills: user.skills || {
                            teach: [],
                            learn: []
                        },
                        experience: user.experience || 0,
                        rating: user.rating || 0,
                        sessions: user.sessions || 0,
                        location: user.location || ''
                    }));
                    
                    // Redirect to main page or dashboard
                    window.location.href = 'index.html';
                } else {
                    // Login failed
                    showError('Invalid email or password');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            }, 1000);
        });
    }
    
    // Function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    // Check if user is already logged in
    function checkLoginStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // User is already logged in, redirect to index or dashboard
            window.location.href = 'index.html';
        }
    }
    
    // Check login status when page loads
    checkLoginStatus();
}); 