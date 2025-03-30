// Signup functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsChecked = document.getElementById('terms').checked;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            if (!termsChecked) {
                showError('You must agree to the Terms of Service and Privacy Policy');
                return;
            }
            
            // Show loading state
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Creating Account...';
            submitButton.disabled = true;
            
            // Simulate API call for signup
            setTimeout(() => {
                // For demo purposes, using localStorage to store user data
                // In a real app, this would be an API call to your backend
                const users = JSON.parse(localStorage.getItem('users')) || [];
                
                // Check if email already exists
                if (users.some(u => u.email === email)) {
                    showError('Email is already registered');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    return;
                }
                
                // Create new user object
                const newUser = {
                    id: generateUserId(),
                    name,
                    email,
                    password, // In a real app, this would be hashed on the server
                    bio: '',
                    skills: {
                        teach: [],
                        learn: []
                    },
                    experience: 0,
                    rating: 0,
                    sessions: 0,
                    location: '',
                    availability: [],
                    joinDate: new Date().toISOString()
                };
                
                // Add user to "database"
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Auto login the user
                localStorage.setItem('currentUser', JSON.stringify({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    bio: newUser.bio,
                    skills: newUser.skills,
                    experience: newUser.experience,
                    rating: newUser.rating,
                    sessions: newUser.sessions,
                    location: newUser.location
                }));
                
                // Redirect to profile setup or dashboard
                window.location.href = 'profile.html?setup=true';
            }, 1500);
        });
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Generate a unique user ID
    function generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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