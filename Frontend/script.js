// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Scroll Animation Implementation
class ScrollAnimation {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class based on scroll direction
                    const scrollDirection = this.getScrollDirection();
                    entry.target.classList.add('animate');
                    entry.target.dataset.direction = scrollDirection;
                    // Add a class to mark the element as visible
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        this.lastScrollTop = 0;
        this.init();
    }

    getScrollDirection() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const direction = currentScrollTop > this.lastScrollTop ? 'down' : 'up';
        this.lastScrollTop = currentScrollTop;
        return direction;
    }

    init() {
        // Add animation classes to elements
        document.querySelectorAll('.feature-card, .profile-card, .skill-card, .hero-content, .skills h2, .profile h2, .features h2').forEach(el => {
            el.classList.add('scroll-animate');
            this.observer.observe(el);
        });

        // Add scroll event listener for continuous animation
        window.addEventListener('scroll', () => {
            const elements = document.querySelectorAll('.scroll-animate:not(.visible)');
            elements.forEach(el => {
                if (this.isElementInViewport(el)) {
                    const direction = this.getScrollDirection();
                    el.classList.add('animate');
                    el.dataset.direction = direction;
                    el.classList.add('visible');
                }
            });
        });
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// Login Modal
const loginBtn = document.querySelector('.login-btn');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');

// Modal functionality
let isModalOpen = false;

function openLoginModal() {
    if (!isModalOpen) {
        document.getElementById('loginModal').style.display = 'block';
        isModalOpen = true;
    }
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    isModalOpen = false;
}

function openSignupModal() {
    if (!isModalOpen) {
        document.getElementById('signupModal').style.display = 'block';
        isModalOpen = true;
    }
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
    isModalOpen = false;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const profileModal = document.getElementById('profileModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
    if (event.target === profileModal) {
        closeProfileModal();
    }
}

// Remove duplicate event listeners
document.querySelector('.login-btn').removeEventListener('click', openLoginModal);
document.querySelector('.signup-btn').removeEventListener('click', openSignupModal);

// Add event listeners once
document.querySelector('.login-btn').addEventListener('click', openLoginModal);
document.querySelector('.signup-btn').addEventListener('click', openSignupModal);

// Close buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            isModalOpen = false;
        }
    });
});

// Handle form submissions
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    try {
        console.log('Attempting login with:', { email });
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Close modal and show success message
            closeLoginModal();
            
            // Update UI to show logged-in state
            updateUIForLoggedInUser(data.user);
            
            // Show success message
            showNotification('Login successful!', 'success');
        } else {
            // Show error message from server
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
});

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to check login state on page load
function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (user && token) {
        // User is logged in
        updateUIForLoggedInUser(user);
    } else {
        // User is not logged in
        const profileDropdown = document.querySelector('.profile-dropdown');
        const authButtons = document.querySelector('.auth-buttons');
        
        if (profileDropdown) profileDropdown.style.display = 'none';
        if (authButtons) authButtons.style.display = 'flex';
    }
}

// Function to update UI for logged-in user
function updateUIForLoggedInUser(user) {
    // Update profile icon if it exists
    const profileDropdown = document.querySelector('.profile-dropdown');
    const authButtons = document.querySelector('.auth-buttons');
    const userInitial = document.getElementById('userInitial');
    
    if (profileDropdown) profileDropdown.style.display = 'block';
    if (authButtons) authButtons.style.display = 'none';
    if (userInitial) userInitial.textContent = user.name.charAt(0).toUpperCase();
    
    // Store current user data in localStorage for easy access across the app
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Function to update profile modal with user data
function updateProfileModal(user) {
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        const profileHeader = profileModal.querySelector('.profile-header');
        const profileName = profileModal.querySelector('.profile-name');
        const profileEmail = profileModal.querySelector('.profile-email');
        const profileStats = profileModal.querySelector('.profile-stats');
        const skillsList = profileModal.querySelector('.skills-list');

        // Update profile header
        if (profileHeader) {
            profileHeader.innerHTML = `
                <img src="https://via.placeholder.com/150" alt="Profile Picture" class="profile-pic">
                <h3>${user.name}</h3>
            `;
        }

        // Update profile name
        if (profileName) {
            profileName.textContent = user.name;
        }

        // Update profile email
        if (profileEmail) {
            profileEmail.textContent = user.email;
        }

        // Update profile stats
        if (profileStats) {
            profileStats.innerHTML = `
                <div class="stat">
                    <span class="stat-value">${user.skills ? user.skills.length : 0}</span>
                    <span class="stat-label">Skills</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${user.completedSessions || 0}</span>
                    <span class="stat-label">Sessions</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${user.rating || 0}</span>
                    <span class="stat-label">Rating</span>
                </div>
            `;
        }

        // Update skills list
        if (skillsList && user.skills) {
            const skillTags = skillsList.querySelector('.skill-tags');
            if (skillTags) {
                skillTags.innerHTML = user.skills.map(skill => 
                    `<span>${skill.name}</span>`
                ).join('');
            }
        }
    }
}

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    try {
        console.log('Attempting registration with:', { name, email });
        console.log('API URL:', `${API_BASE_URL}/auth/register`);
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        console.log('Registration response status:', response.status);
        
        const data = await response.json();
        console.log('Registration response data:', data);

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            closeSignupModal();
            alert('Registration successful!');
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error details:', error);
        console.error('Error stack:', error.stack);
        alert('Registration failed. Please check the console for details.');
    }
});

// Skills Grid Implementation
class SkillsGrid {
    constructor() {
        this.skillsGrid = document.querySelector('.skills-grid');
        this.searchInput = document.getElementById('skillSearch');
        this.exploreButton = document.querySelector('.explore-button');
        this.skillsSection = document.querySelector('.skills');
        this.heroSection = document.querySelector('.hero');
        this.featuresSection = document.querySelector('.features');
        this.footer = document.querySelector('.footer');
        this.navbar = document.querySelector('.navbar');
        this.skills = [
            {
                title: 'Web Development',
                description: 'Learn HTML, CSS, and JavaScript to build modern websites',
                image: "/Image/web development.jpg",
                level: 4,
                learners: 1200
            },
            {
                title: 'Data Science',
                description: 'Master data analysis and machine learning techniques',
                image:"/Image/data science.jpg",
                level: 5,
                learners: 800
            },
            {
                title: 'UI/UX Design',
                description: 'Create beautiful and user-friendly interfaces',
                image: "/Image/UI-UX.jpg",
                level: 3,
                learners: 600
            },
            {
                title: 'Mobile Development',
                description: 'Build iOS and Android applications',
                image: "/Image/mobile development.jpg",
                level: 4,
                learners: 900
            },
            {
                title: 'Digital Marketing',
                description: 'Learn to promote products and services online',
                image: "/Image/digital marketing.jpg",
                level: 3,
                learners: 700
            },
            {
                title: 'Photography',
                description: 'Master the art of capturing stunning images',
                image: "/Image/photography.jpg",
                level: 4,
                learners: 500
            }
        ];

        this.additionalSkills = [
            {
                title: 'Artificial Intelligence',
                description: 'Learn about AI and machine learning fundamentals',
                image: "/Image/AI.jpg",
                level: 5,
                learners: 1100
            },
            {
                title: 'Cybersecurity',
                description: 'Master the art of protecting digital systems',
                image: "/Image/cyber-security.jpg",
                level: 4,
                learners: 850
            },
            {
                title: 'Cloud Computing',
                description: 'Learn about cloud platforms and services',
                image: "/Image/Cloud-Computing.jpg",
                level: 4,
                learners: 950
            },
            {
                title: 'Blockchain Development',
                description: 'Build decentralized applications',
                image: "/Image/Blockchain-Development.jpg",
                level: 5,
                learners: 750
            }
        ];
        
        this.currentSkills = [...this.skills];
        this.init();
    }

    init() {
        this.renderSkills(this.currentSkills);
        this.setupSearch();
        this.setupExploreMore();
    }

    setupSearch() {
        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length > 0) {
                // Hide other sections
                this.heroSection.style.display = 'none';
                this.featuresSection.style.display = 'none';
                this.footer.style.display = 'none';
                
                // Show skills section at the top
                this.skillsSection.style.marginTop = '80px'; // Account for fixed navbar
                this.skillsSection.style.paddingTop = '2rem';
                
                // Filter and render skills
                const filteredSkills = this.currentSkills.filter(skill => 
                    skill.title.toLowerCase().includes(searchTerm) ||
                    skill.description.toLowerCase().includes(searchTerm)
                );
                this.renderSkills(filteredSkills);
            } else {
                // Show all sections when search is empty
                this.heroSection.style.display = 'flex';
                this.featuresSection.style.display = 'block';
                this.footer.style.display = 'block';
                
                // Reset skills section styling
                this.skillsSection.style.marginTop = '0';
                this.skillsSection.style.paddingTop = '5rem';
                
                // Render all skills
                this.renderSkills(this.currentSkills);
            }
        });
    }

    renderSkills(skills) {
        this.skillsGrid.innerHTML = '';
        if (skills.length === 0) {
            this.skillsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No skills found</h3>
                    <p>Try different keywords or browse all skills</p>
                </div>
            `;
            return;
        }
        
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card scroll-animate';
            skillCard.innerHTML = `
                <img src="${skill.image}" alt="${skill.title}" class="skill-image">
                <div class="skill-content">
                    <h3 class="skill-title">${skill.title}</h3>
                    <p class="skill-description">${skill.description}</p>
                    <div class="skill-meta">
                        <div class="skill-level">
                            ${this.generateStars(skill.level)}
                            <span>${skill.level}/5</span>
                        </div>
                        <span>${skill.learners} learners</span>
                    </div>
                    <a href="skill-details.html?skill=${encodeURIComponent(skill.title)}" class="cta-button" style="width: 100%; margin-top: 1rem; text-decoration: none; display: block; text-align: center;">Learn More</a>
                </div>
            `;
            this.skillsGrid.appendChild(skillCard);
            new ScrollAnimation().observer.observe(skillCard);
        });
    }

    generateStars(level) {
        return Array(5).fill('').map((_, index) => `
            <i class="fas fa-star${index < level ? '' : ' far'}"></i>
        `).join('');
    }

    setupExploreMore() {
        this.exploreButton.addEventListener('click', () => {
            this.currentSkills = [...this.currentSkills, ...this.additionalSkills];
            this.renderSkills(this.currentSkills);
            this.exploreButton.style.display = 'none';
        });
    }
}

// Profile Modal Functions
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;
    
    modal.style.display = 'block';
    
    // Update profile modal content with current user data
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) {
        updateProfileModalContent(currentUser);
    } else {
        console.error('No user data found in localStorage');
    }
    
    // Add event listeners for skill management
    setupProfileModalSkillListeners();
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.style.display = 'none';
}

function updateProfileModalContent(user) {
    if (!user) return;
    
    // Basic user info
    const profileInitial = document.getElementById('profileInitial');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileBio = document.getElementById('profileBio');
    const profilePicContainer = document.getElementById('profilePicContainer');
    
    if (profileInitial) profileInitial.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    if (profileName) profileName.textContent = user.name || 'User Name';
    if (profileEmail) profileEmail.textContent = user.email || 'user@example.com';
    
    // Set profile image if available
    if (profilePicContainer && user.profileImage) {
        profileInitial.style.display = 'none';
        profilePicContainer.style.background = `url(${user.profileImage}) center/cover`;
    } else if (profilePicContainer) {
        profileInitial.style.display = 'flex';
        profilePicContainer.style.background = '#3498db';
    }
    
    // Bio section
    if (profileBio) {
        if (user.bio && user.bio.trim() !== '') {
            profileBio.textContent = user.bio;
            profileBio.classList.remove('empty-state');
        } else {
            profileBio.textContent = 'No bio available. Click "Edit Profile" to add a bio.';
            profileBio.classList.add('empty-state');
        }
    }
    
    // Skills counts
    const skillsCount = document.getElementById('skillsCount');
    const sessionsCount = document.getElementById('sessionsCount');
    const ratingValue = document.getElementById('ratingValue');
    
    let totalSkills = 0;
    if (user.skills) {
        if (user.skills.teach) totalSkills += user.skills.teach.length;
        if (user.skills.learn) totalSkills += user.skills.learn.length;
    }
    
    if (skillsCount) skillsCount.textContent = totalSkills;
    if (sessionsCount) sessionsCount.textContent = user.sessions || 0;
    if (ratingValue) ratingValue.textContent = user.rating || 0;
    
    // Populate skills sections
    updateSkillsSection('teachSkills', user.skills?.teach || []);
    updateSkillsSection('learnSkills', user.skills?.learn || []);
    
    // Setup profile image upload
    setupProfileImageUpload();
    
    // Setup skill input handlers
    setupProfileModalSkillListeners();
    
    // Add edit profile button event listener
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        // Remove previous event listeners to avoid duplicates
        const newEditBtn = editProfileBtn.cloneNode(true);
        editProfileBtn.parentNode.replaceChild(newEditBtn, editProfileBtn);
        
        // Add new event listener
        newEditBtn.addEventListener('click', function() {
            // Close profile modal
            closeProfileModal();
            // Redirect to profile page with edit mode
            window.location.href = 'profile.html?edit=true';
        });
    }
    
    // Add save changes button event listener
    const saveProfileChangesBtn = document.getElementById('saveProfileChangesBtn');
    if (saveProfileChangesBtn) {
        // Remove previous event listeners to avoid duplicates
        const newSaveBtn = saveProfileChangesBtn.cloneNode(true);
        saveProfileChangesBtn.parentNode.replaceChild(newSaveBtn, saveProfileChangesBtn);
        
        // Add new event listener
        newSaveBtn.addEventListener('click', saveProfileModalChanges);
    }
}

// Function to set up profile image upload
function setupProfileImageUpload() {
    const profileImageUpload = document.getElementById('profileImageUpload');
    if (!profileImageUpload) return;
    
    // Remove previous event listeners to avoid duplicates
    const newUploadInput = profileImageUpload.cloneNode(true);
    profileImageUpload.parentNode.replaceChild(newUploadInput, profileImageUpload);
    
    // Add new event listener
    newUploadInput.addEventListener('change', handleProfileImageUpload);
}

// Function to handle profile image upload
function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Only process image files
    if (!file.type.match('image.*')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Show loading notification
    showNotification('Uploading image...', 'info');
    
    // Read the file and create data URL
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const imageData = event.target.result;
            
            // Get current user data
            const currentUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('currentUser'));
            const token = localStorage.getItem('token');
            
            if (!currentUser) {
                showNotification('User data not found. Please log in again.', 'error');
                return;
            }
            
            if (!token) {
                showNotification('Authentication token not found. Please log in again.', 'error');
                return;
            }
            
            // Update profile picture in UI for immediate feedback
            const profileInitial = document.getElementById('profileInitial');
            const profilePicContainer = document.getElementById('profilePicContainer');
            
            if (profileInitial && profilePicContainer) {
                profileInitial.style.display = 'none';
                profilePicContainer.style.background = `url(${imageData}) center/cover`;
            } else {
                console.warn('Profile avatar elements not found in the DOM');
            }
            
            // Update user data locally
            currentUser.profileImage = imageData;
            
            // Prepare data for server update
            const userData = {
                profileImage: imageData
            };
            
            // Save to server with timeout for error handling
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timed out')), 10000)
            );
            
            Promise.race([
                fetch(`${API_BASE_URL}/users/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                }),
                timeoutPromise
            ])
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to update profile image');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Update localStorage with server response
                if (data && data.profileImage) {
                    currentUser.profileImage = data.profileImage;
                }
                
                // Update both localStorage entries for consistency
                localStorage.setItem('user', JSON.stringify(currentUser));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Show success message
                showNotification('Profile picture updated!', 'success');
            })
            .catch(error => {
                console.error('Error updating profile image:', error);
                
                // Update localStorage anyway to keep UI consistent
                localStorage.setItem('user', JSON.stringify(currentUser));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Show error but not too alarming since the image is at least saved locally
                showNotification('Profile picture saved locally. Server update failed.', 'info');
            });
        } catch (error) {
            console.error('Error processing image data:', error);
            showNotification('Error processing image. Please try again.', 'error');
        }
    };
    
    reader.onerror = function() {
        console.error('Error reading file');
        showNotification('Error reading file. Please try again.', 'error');
    };
    
    reader.readAsDataURL(file);
}

// Function to set up skill management listeners
function setupProfileModalSkillListeners() {
    // Add teach skill button
    const addTeachSkillBtn = document.getElementById('addTeachSkillBtn');
    const addTeachSkillInput = document.getElementById('addTeachSkill');
    
    if (addTeachSkillBtn && addTeachSkillInput) {
        // Remove previous event listeners
        const newAddTeachBtn = addTeachSkillBtn.cloneNode(true);
        addTeachSkillBtn.parentNode.replaceChild(newAddTeachBtn, addTeachSkillBtn);
        
        // Add new event listener
        newAddTeachBtn.addEventListener('click', function() {
            const skillText = addTeachSkillInput.value.trim();
            if (skillText) {
                addSkillTag(skillText, 'teachSkills', true);
                addTeachSkillInput.value = '';
            }
        });
        
        // Add enter key support
        addTeachSkillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                newAddTeachBtn.click();
            }
        });
    }
    
    // Add learn skill button
    const addLearnSkillBtn = document.getElementById('addLearnSkillBtn');
    const addLearnSkillInput = document.getElementById('addLearnSkill');
    
    if (addLearnSkillBtn && addLearnSkillInput) {
        // Remove previous event listeners
        const newAddLearnBtn = addLearnSkillBtn.cloneNode(true);
        addLearnSkillBtn.parentNode.replaceChild(newAddLearnBtn, addLearnSkillBtn);
        
        // Add new event listener
        newAddLearnBtn.addEventListener('click', function() {
            const skillText = addLearnSkillInput.value.trim();
            if (skillText) {
                addSkillTag(skillText, 'learnSkills', false);
                addLearnSkillInput.value = '';
            }
        });
        
        // Add enter key support
        addLearnSkillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                newAddLearnBtn.click();
            }
        });
    }
}

// Function to add a skill tag
function addSkillTag(skillText, containerId, isTeachSkill) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Remove empty state message if it exists
    const emptyState = container.querySelector('.empty-state');
    if (emptyState) {
        container.removeChild(emptyState);
    }
    
    // Check if skill already exists
    const existingSkills = container.querySelectorAll('.skill-tag');
    for (let i = 0; i < existingSkills.length; i++) {
        if (existingSkills[i].textContent.replace('×', '').trim() === skillText) {
            showNotification('This skill is already in your list', 'info');
            return;
        }
    }
    
    // Create skill tag
    const skillTag = document.createElement('div');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `${skillText}<span class="remove-skill">×</span>`;
    
    // Add remove functionality
    const removeBtn = skillTag.querySelector('.remove-skill');
    removeBtn.addEventListener('click', function() {
        container.removeChild(skillTag);
        
        // Check if we need to show empty state
        if (container.querySelectorAll('.skill-tag').length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'empty-state';
            emptyMsg.textContent = 'No skills added yet';
            container.appendChild(emptyMsg);
        }
        
        // Update skill count
        updateSkillCount();
    });
    
    container.appendChild(skillTag);
    
    // Update skill count
    updateSkillCount();
}

// Function to update skill count
function updateSkillCount() {
    const teachSkills = document.getElementById('teachSkills');
    const learnSkills = document.getElementById('learnSkills');
    const skillsCount = document.getElementById('skillsCount');
    
    if (!teachSkills || !learnSkills || !skillsCount) return;
    
    const teachCount = teachSkills.querySelectorAll('.skill-tag').length;
    const learnCount = learnSkills.querySelectorAll('.skill-tag').length;
    
    skillsCount.textContent = teachCount + learnCount;
}

// Function to update skills in profile directly (fallback when API is unavailable)
function updateProfileSkillsLocally(teachSkills, learnSkills) {
    try {
        // Get current user data from both possible storage locations
        const currentUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            throw new Error('User data not found');
        }
        
        // Update skills in the user object
        if (!currentUser.skills) {
            currentUser.skills = {};
        }
        
        currentUser.skills.teach = teachSkills || [];
        currentUser.skills.learn = learnSkills || [];
        
        // Save back to localStorage (both locations for consistency)
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateProfileModalContent(currentUser);
        updateSkillCount();
        
        return true;
    } catch (error) {
        console.error('Error updating skills locally:', error);
        return false;
    }
}

// Function to save profile changes made in the modal
function saveProfileModalChanges() {
    // Show loading notification
    showNotification('Saving your profile...', 'info');
    
    // Get current user data - check both possible storage keys
    const currentUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');
    
    if (!currentUser) {
        showNotification('User data not found. Please log in again.', 'error');
        return;
    }
    
    if (!token) {
        showNotification('Authentication token not found. Please log in again.', 'error');
        return;
    }
    
    try {
        // Get teach skills
        const teachSkillsContainer = document.getElementById('teachSkills');
        const teachSkills = teachSkillsContainer ? 
            Array.from(teachSkillsContainer.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.replace('×', '').trim()) : 
            [];
        
        // Get learn skills
        const learnSkillsContainer = document.getElementById('learnSkills');
        const learnSkills = learnSkillsContainer ? 
            Array.from(learnSkillsContainer.querySelectorAll('.skill-tag'))
                .map(tag => tag.textContent.replace('×', '').trim()) : 
            [];
        
        // Create updated user data object
        const updatedUser = {
            skills: {
                teach: teachSkills,
                learn: learnSkills
            }
        };
        
        console.log('Updating profile with data:', updatedUser);
        console.log('API URL:', `${API_BASE_URL}/users/profile`);
        console.log('Token available:', !!token);
        
        // First try direct API call with timeout
        const timeoutDuration = 8000; // 8 seconds timeout
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timed out')), timeoutDuration);
        });
        
        // Race the actual API call against the timeout
        Promise.race([
            fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            }),
            timeoutPromise
        ])
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to update profile');
                });
            }
            return response.json();
        })
        .then(data => {
            // API update successful
            console.log('Profile update successful:', data);
            
            // Update localStorage with server response
            if (data && data.skills) {
                currentUser.skills = data.skills;
            } else {
                // If server didn't return skills, use our updated data
                currentUser.skills = updatedUser.skills;
            }
            
            // Update both localStorage keys to ensure consistency
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateProfileModalContent(currentUser);
            updateSkillCount();
            
            // Show success message
            showNotification('Profile updated successfully!', 'success');
        })
        .catch(error => {
            console.error('Error updating profile via API:', error);
            console.log('Falling back to local storage update...');
            
            // Fallback to direct localStorage update
            if (updateProfileSkillsLocally(teachSkills, learnSkills)) {
                showNotification('Profile saved locally. Changes will sync when reconnected.', 'info');
            } else {
                showNotification('Failed to save profile: ' + error.message, 'error');
            }
        });
    } catch (err) {
        console.error('Error processing profile data:', err);
        showNotification('Error processing profile data: ' + err.message, 'error');
    }
}

// Function to update skills section in profile modal
function updateSkillsSection(sectionId, skills) {
    const container = document.getElementById(sectionId);
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Check if there are any skills
    if (!skills || skills.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No skills added yet';
        container.appendChild(emptyState);
        return;
    }
    
    // Add skills as tags with remove functionality
    skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `${skill}<span class="remove-skill">×</span>`;
        
        // Add remove functionality
        const removeBtn = skillTag.querySelector('.remove-skill');
        if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                container.removeChild(skillTag);
                
                // Check if we need to show empty state
                if (container.querySelectorAll('.skill-tag').length === 0) {
                    const emptyMsg = document.createElement('p');
                    emptyMsg.className = 'empty-state';
                    emptyMsg.textContent = 'No skills added yet';
                    container.appendChild(emptyMsg);
                }
                
                // Update skill count
                updateSkillCount();
            });
        }
        
        container.appendChild(skillTag);
    });
}

// Profile Dropdown Functions
function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const profileIcon = document.querySelector('.profile-icon');
    
    if (!profileIcon.contains(event.target) && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    }
});

function logout() {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset UI
    const profileDropdown = document.querySelector('.profile-dropdown');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (profileDropdown) profileDropdown.style.display = 'none';
    if (authButtons) authButtons.style.display = 'flex';
    
    // Close dropdown
    document.getElementById('profileDropdown').style.display = 'none';
    
    // Show success message
    showNotification('Logged out successfully', 'success');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check login state when page loads
    checkLoginState();
    
    // Add event listener for skills input
    const skillsInput = document.getElementById('editSkills');
    if (skillsInput) {
        skillsInput.addEventListener('keypress', addSkill);
    }
    
    // Add event listener for add experience button
    const addExperienceBtn = document.querySelector('.add-experience-btn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', addExperience);
    }

    // Add scroll functionality to "Get Started" button
    const getStartedBtn = document.querySelector('.hero .cta-button');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            const skillsSection = document.getElementById('available-skills');
            if (skillsSection) {
                skillsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Counting Animation for About Us Section
function animateCount(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for About Us Section
const aboutStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(number => {
                const target = parseInt(number.getAttribute('data-target'));
                animateCount(number, target, 2000); // 2 seconds duration
            });
            aboutStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe the stats container
const statsContainer = document.querySelector('.about-stats');
if (statsContainer) {
    aboutStatsObserver.observe(statsContainer);
}

// Get Started Button Scroll
document.querySelector('.cta-button').addEventListener('click', function() {
    const skillsSection = document.getElementById('available-skills');
    if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimation();
    new SkillsGrid();
    
    // Add event listener for the Learn More button
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'skillform.html';
        });
    }
});

// Handle social login buttons
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', function() {
        const platform = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
        console.log(`${platform} login clicked`);
        // Add your social login logic here
    });
});

// Connect and Chat functionality
function connectAndChat(skillName) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showNotification('Please login to access the chat', 'error');
        setTimeout(() => {
            openLoginModal();
        }, 2000);
        return;
    }
    
    window.location.href = `chat.html?skill=${encodeURIComponent(skillName)}`;
}

// Skill Match Modal Functions
function openSkillMatchModal() {
    const modal = document.getElementById('skillMatchModal');
    modal.style.display = 'block';
    loadAvailableSkills();
}

function closeSkillMatchModal() {
    const modal = document.getElementById('skillMatchModal');
    modal.style.display = 'none';
    
    // Reset the modal
    document.getElementById('matchResults').innerHTML = '';
    document.getElementById('matchLoading').style.display = 'none';
    document.getElementById('noMatchesFound').style.display = 'none';
}

function loadAvailableSkills() {
    // Show loading in the skill select dropdowns
    const wantedSkills = document.getElementById('wantedSkills');
    const offeredSkills = document.getElementById('offeredSkills');
    
    wantedSkills.innerHTML = '<option disabled>Loading skills...</option>';
    offeredSkills.innerHTML = '<option disabled>Loading skills...</option>';
    
    // Fetch skills from the API
    fetch('/api/skills')
        .then(response => response.json())
        .then(data => {
            wantedSkills.innerHTML = '';
            offeredSkills.innerHTML = '';
            
            const skills = data.skills;
            skills.forEach(skill => {
                const wantedOption = document.createElement('option');
                wantedOption.value = skill;
                wantedOption.textContent = skill;
                wantedSkills.appendChild(wantedOption);
                
                const offeredOption = document.createElement('option');
                offeredOption.value = skill;
                offeredOption.textContent = skill;
                offeredSkills.appendChild(offeredOption);
            });
        })
        .catch(error => {
            console.error('Error loading skills:', error);
            wantedSkills.innerHTML = '<option disabled>Error loading skills</option>';
            offeredSkills.innerHTML = '<option disabled>Error loading skills</option>';
        });
}

function findSkillMatches() {
    // Get selected skills
    const wantedSkills = Array.from(document.getElementById('wantedSkills').selectedOptions)
        .map(option => ({ skill: option.value, experience: 'Intermediate' }));
    
    const offeredSkills = Array.from(document.getElementById('offeredSkills').selectedOptions)
        .map(option => ({ skill: option.value, experience: 'Intermediate' }));
    
    const availability = document.getElementById('availability').value;
    
    // Validate
    if (wantedSkills.length === 0) {
        alert('Please select at least one skill you want to learn');
        return;
    }
    
    // Show loading
    document.getElementById('matchLoading').style.display = 'block';
    document.getElementById('matchResults').innerHTML = '';
    document.getElementById('noMatchesFound').style.display = 'none';
    
    // Make API request
    fetch('/api/match', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            wanted_skills: wantedSkills,
            offered_skills: offeredSkills,
            availability: availability
        })
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading
        document.getElementById('matchLoading').style.display = 'none';
        
        // Check if there are matches
        if (data.matches.length === 0) {
            document.getElementById('noMatchesFound').style.display = 'block';
            return;
        }
        
        // Display matches
        displayMatches(data.matches);
    })
    .catch(error => {
        console.error('Error finding matches:', error);
        document.getElementById('matchLoading').style.display = 'none';
        alert('An error occurred while finding matches. Please try again.');
    });
}

function displayMatches(matches) {
    const matchResults = document.getElementById('matchResults');
    matchResults.innerHTML = '';
    
    matches.forEach(match => {
        const user = match.user;
        const matchScore = match.match_score;
        const skillMatch = match.skill_match;
        const availabilityMatch = match.availability_match;
        const certificationScore = match.certification_score;
        const commonSkills = match.common_skills;
        const additionalSkills = match.additional_skills;
        
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        // Create the card content
        matchCard.innerHTML = `
            <div class="match-header">
                <div class="match-avatar">
                    <img src="${user.profile_image || 'https://via.placeholder.com/60'}" alt="${user.name}">
                </div>
                <div class="match-info">
                    <h3>${user.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${user.location || 'Location not specified'}</p>
                    <p><i class="fas fa-clock"></i> ${user.availability || 'Availability not specified'}</p>
                </div>
                <div class="match-score">${matchScore}% Match</div>
            </div>
            <div class="match-body">
                <div class="match-bio">${user.bio || 'No bio available'}</div>
                <h4>Skills:</h4>
                <div class="match-skills">
                    ${commonSkills.map(skill => `<span class="skill-tag common">${skill}</span>`).join('')}
                    ${additionalSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="match-stats">
                    <div class="match-stat">
                        <span class="match-stat-value">${skillMatch}%</span>
                        <span class="match-stat-label">Skills</span>
                    </div>
                    <div class="match-stat">
                        <span class="match-stat-value">${availabilityMatch}%</span>
                        <span class="match-stat-label">Availability</span>
                    </div>
                    <div class="match-stat">
                        <span class="match-stat-value">${certificationScore}%</span>
                        <span class="match-stat-label">Teaching</span>
                    </div>
                </div>
                <div class="match-actions">
                    <button class="match-btn connect-btn" onclick="connectWithUser('${user.user_id}')">Connect</button>
                    <button class="match-btn details-btn" onclick="viewUserDetails('${user.user_id}')">Details</button>
                </div>
            </div>
        `;
        
        matchResults.appendChild(matchCard);
    });
}

function connectWithUser(userId) {
    // Check if the user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to connect with other users');
        closeSkillMatchModal();
        openLoginModal();
        return;
    }
    
    alert(`You've requested to connect with user ID: ${userId}`);
    // In a real app, you would send a request to the server to establish a connection
}

function viewUserDetails(userId) {
    alert(`Viewing details for user ID: ${userId}`);
    // In a real app, you would navigate to a user profile page or show a detailed modal
}

// Initialize event listeners for skill matching
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to the "Find Skill Match" button
    const exploreSkillsBtn = document.getElementById('exploreSkillsBtn');
    if (exploreSkillsBtn) {
        exploreSkillsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSkillMatchModal();
        });
    }
    
    // Attach event listener to the "Find Matches" button in the modal
    const findMatchesBtn = document.getElementById('findMatchesBtn');
    if (findMatchesBtn) {
        findMatchesBtn.addEventListener('click', findSkillMatches);
    }
}); 