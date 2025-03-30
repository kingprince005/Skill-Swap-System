document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize UI
    initializeProfileUI();
    
    // Check if this is a first-time setup
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('setup') === 'true') {
        openEditProfileModal();
    }
    
    // Add event listeners
    document.getElementById('editProfileBtn').addEventListener('click', openEditProfileModal);
    document.getElementById('closeEditProfile').addEventListener('click', closeEditProfileModal);
    document.getElementById('profileEditForm').addEventListener('submit', saveProfileChanges);
    document.getElementById('avatarUpload').addEventListener('change', handleAvatarUpload);
    
    // Setup tag inputs for skills
    setupTagInputs();
});

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Function to initialize the profile UI with user data
function initializeProfileUI() {
    try {
        // Get user data from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
        
        if (!currentUser) {
            console.error('No user data found in localStorage');
            return;
        }
        
        console.log('Updating UI with user data:', currentUser);
        
        // Set user initial in avatar
        const profileAvatar = document.getElementById('profileAvatar');
        const userInitial = document.getElementById('userInitial');
        
        // Handle profile image or avatar (supporting both naming conventions)
        if (profileAvatar) {
            if (currentUser.profileImage || currentUser.avatar) {
                profileAvatar.textContent = '';
                profileAvatar.style.background = `url(${currentUser.profileImage || currentUser.avatar}) center/cover`;
            } else {
                profileAvatar.textContent = currentUser.name?.charAt(0).toUpperCase() || 'U';
                profileAvatar.style.background = '';
            }
        }
        
        if (userInitial) {
            userInitial.textContent = currentUser.name?.charAt(0).toUpperCase() || 'U';
        }
        
        // Set user name and other basic info
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileLocation = document.getElementById('profileLocation');
        const profileBio = document.getElementById('profileBio');
        const experienceYears = document.getElementById('experienceYears');
        
        if (profileName) profileName.textContent = currentUser.name || 'User Name';
        if (profileEmail) profileEmail.textContent = currentUser.email || 'user@example.com';
        
        // Set location if available
        if (profileLocation) {
            if (currentUser.location) {
                profileLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentUser.location}`;
            } else {
                profileLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>Add your location</span>`;
            }
        }
        
        // Set bio if available
        if (profileBio) {
            if (currentUser.bio) {
                profileBio.textContent = currentUser.bio;
                profileBio.classList.remove('empty-state');
            } else {
                profileBio.textContent = 'No bio available. Click "Edit Profile" to add a bio.';
                profileBio.classList.add('empty-state');
            }
        }
        
        // Set experience years
        if (experienceYears) {
            experienceYears.textContent = currentUser.experience || 0;
        }
        
        // Set stats
        const skillsCount = document.getElementById('skillsCount');
        const sessionsCount = document.getElementById('sessionsCount');
        const ratingValue = document.getElementById('ratingValue');
        
        let totalSkills = 0;
        if (currentUser.skills) {
            if (currentUser.skills.teach) totalSkills += currentUser.skills.teach.length;
            if (currentUser.skills.learn) totalSkills += currentUser.skills.learn.length;
        }
        
        if (skillsCount) skillsCount.textContent = totalSkills;
        if (sessionsCount) sessionsCount.textContent = currentUser.sessions || 0;
        if (ratingValue) ratingValue.textContent = currentUser.rating || 0;
        
        // Populate skills sections
        populateSkillsSection('teachSkills', currentUser.skills?.teach || []);
        populateSkillsSection('learnSkills', currentUser.skills?.learn || []);
        
        // Populate availability
        populateAvailability(currentUser.availability || []);
        
        console.log('Profile UI updated successfully');
    } catch (error) {
        console.error('Error updating profile UI:', error);
        showNotification('Error updating profile display', 'error');
    }
}

// Function to populate skills section
function populateSkillsSection(sectionId, skills) {
    console.log(`Populating skills section ${sectionId} with:`, skills);
    const container = document.getElementById(sectionId);
    if (!container) {
        console.error(`Skills container ${sectionId} not found in the DOM`);
        return;
    }
    
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
    
    // Log skills for debugging
    console.log(`Adding ${skills.length} skills to ${sectionId}`);
    
    // Add skill tags
    skills.forEach(skill => {
        if (!skill || typeof skill !== 'string') {
            console.warn('Invalid skill found:', skill);
            return;
        }
        
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        
        // Add a remove button for profile view (optional)
        skillTag.innerHTML = `${skill}<span class="remove-skill" style="display:none;">×</span>`;
        
        // Add title for long skill names
        skillTag.title = skill;
        
        container.appendChild(skillTag);
        console.log(`Added skill: ${skill} to ${sectionId}`);
    });
}

// Function to populate availability section
function populateAvailability(availability) {
    const container = document.getElementById('availabilityContainer');
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Check if there is any availability
    if (availability.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No availability set';
        container.appendChild(emptyState);
        return;
    }
    
    // Create availability list
    const list = document.createElement('ul');
    list.className = 'availability-list';
    
    // Map availability values to readable text
    const availabilityMap = {
        'weekday_mornings': 'Weekday Mornings',
        'weekday_afternoons': 'Weekday Afternoons',
        'weekday_evenings': 'Weekday Evenings',
        'weekend_mornings': 'Weekend Mornings',
        'weekend_afternoons': 'Weekend Afternoons',
        'weekend_evenings': 'Weekend Evenings'
    };
    
    // Add list items
    availability.forEach(avail => {
        if (availabilityMap[avail]) {
            const item = document.createElement('li');
            item.textContent = availabilityMap[avail];
            list.appendChild(item);
        }
    });
    
    container.appendChild(list);
}

// Function to open edit profile modal
function openEditProfileModal() {
    console.log('Opening edit profile modal');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
        console.error('No user data found when opening edit modal');
        showNotification('User data not found. Please reload the page.', 'error');
        return;
    }
    
    console.log('User data for edit form:', currentUser);
    
    const modal = document.getElementById('editProfileModal');
    if (!modal) {
        console.error('Edit profile modal not found');
        return;
    }
    
    // Populate form fields with current user data
    const editName = document.getElementById('editName');
    const editLocation = document.getElementById('editLocation');
    const editBio = document.getElementById('editBio');
    const editExperience = document.getElementById('editExperience');
    
    if (editName) editName.value = currentUser.name || '';
    if (editLocation) editLocation.value = currentUser.location || '';
    if (editBio) editBio.value = currentUser.bio || '';
    if (editExperience) editExperience.value = currentUser.experience || 0;
    
    // Clear skill tags
    const teachContainer = document.getElementById('selectedTeachSkills');
    const learnContainer = document.getElementById('selectedLearnSkills');
    
    if (teachContainer) teachContainer.innerHTML = '';
    if (learnContainer) learnContainer.innerHTML = '';
    
    console.log('Skills from user data:', currentUser.skills);
    
    // Add existing teach skills as tags
    if (currentUser.skills && currentUser.skills.teach && Array.isArray(currentUser.skills.teach)) {
        console.log(`Adding ${currentUser.skills.teach.length} teach skills to form`);
        
        currentUser.skills.teach.forEach(skill => {
            if (skill && teachContainer) {
                console.log(`Adding teach skill to form: ${skill}`);
                addTag(skill, teachContainer, 'teach');
            }
        });
    } else {
        console.warn('No teach skills found or not in expected format');
    }
    
    // Add existing learn skills as tags
    if (currentUser.skills && currentUser.skills.learn && Array.isArray(currentUser.skills.learn)) {
        console.log(`Adding ${currentUser.skills.learn.length} learn skills to form`);
        
        currentUser.skills.learn.forEach(skill => {
            if (skill && learnContainer) {
                console.log(`Adding learn skill to form: ${skill}`);
                addTag(skill, learnContainer, 'learn');
            }
        });
    } else {
        console.warn('No learn skills found or not in expected format');
    }
    
    // Set availability checkboxes
    const availabilityOptions = [
        'availWeekdayMornings', 'availWeekdayAfternoons', 'availWeekdayEvenings',
        'availWeekendMornings', 'availWeekendAfternoons', 'availWeekendEvenings'
    ];
    
    availabilityOptions.forEach(optionId => {
        const checkbox = document.getElementById(optionId);
        if (!checkbox) {
            console.warn(`Availability checkbox ${optionId} not found`);
            return;
        }
        
        const value = checkbox.value;
        
        // Check the box if user has this availability
        checkbox.checked = currentUser.availability && Array.isArray(currentUser.availability) && 
                            currentUser.availability.includes(value);
    });
    
    // Display the modal
    modal.style.display = 'flex';
    
    // Log the current state after loading everything
    setTimeout(logSkillContainers, 100);
}

// Function to close edit profile modal
function closeEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

// Function to save user data to database
async function saveUserToDatabase(userData, token) {
    try {
        // Log the request details to help diagnose
        console.log('Sending request to:', `${API_BASE_URL}/users/profile`);
        console.log('Request data:', JSON.stringify(userData, null, 2));
        
        // Check if the data size might be too large
        const dataSize = JSON.stringify(userData).length;
        if (dataSize > 1000000) { // 1MB
            console.warn('Data payload is very large:', dataSize, 'bytes');
            // Compress images if needed
            if (userData.profileImage && userData.profileImage.length > 500000) {
                userData.profileImage = await compressImage(userData.profileImage);
            }
        }
        
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            let errorMessage = 'Error updating profile';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error('Server returned error:', errorData);
            } catch (e) {
                console.error('Unable to parse error response:', e);
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API error:', error);
        
        // Save data locally anyway as fallback
        saveProfileLocally(userData);
        
        throw error;
    }
}

// Function to compress image data URL
async function compressImage(dataUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions (reduce by 50%)
            const width = img.width * 0.5;
            const height = img.height * 0.5;
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw image at reduced size
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get compressed data URL at 80% quality
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = dataUrl;
    });
}

// Function to save profile locally as fallback
function saveProfileLocally(userData) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
        if (!currentUser) return;
        
        // Update user data with the new values
        Object.assign(currentUser, userData);
        
        // Save to both localStorage keys for consistency
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        console.log('Profile saved locally as fallback');
    } catch (error) {
        console.error('Error saving locally:', error);
    }
}

// Function to save profile changes
function saveProfileChanges() {
    console.log('Saving profile changes...');
    
    // Get user data from localStorage
    let userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Get form elements
    const nameInput = document.getElementById('edit-name');
    const locationInput = document.getElementById('edit-location');
    const bioInput = document.getElementById('edit-bio');
    const experienceInput = document.getElementById('edit-experience');
    
    // Get skills containers
    const teachSkillsContainer = document.getElementById('teach-skills-container');
    const learnSkillsContainer = document.getElementById('learn-skills-container');
    
    console.log('Collecting skills from teach container:', teachSkillsContainer);
    console.log('Collecting skills from learn container:', learnSkillsContainer);
    
    // Get teach skills - check for both tag classes
    const teachSkillElements = teachSkillsContainer ? 
        teachSkillsContainer.querySelectorAll('.tag, .skill-tag') : [];
    console.log(`Found ${teachSkillElements.length} teach skill elements`);
    
    const teachSkills = Array.from(teachSkillElements)
        .map(tag => tag.textContent.replace('×', '').trim())
        .filter(skill => skill !== ''); // Filter out any empty strings
    
    console.log('Collected teach skills:', teachSkills);
    
    // Get learn skills - check for both tag classes
    const learnSkillElements = learnSkillsContainer ? 
        learnSkillsContainer.querySelectorAll('.tag, .skill-tag') : [];
    console.log(`Found ${learnSkillElements.length} learn skill elements`);
    
    const learnSkills = Array.from(learnSkillElements)
        .map(tag => tag.textContent.replace('×', '').trim())
        .filter(skill => skill !== ''); // Filter out any empty strings
    
    console.log('Collected learn skills:', learnSkills);
    
    // Create skills object
    const skills = {
        teach: teachSkills,
        learn: learnSkills
    };
    
    // Get availability
    const availability = {};
    availabilityOptions.forEach(option => {
        const checkbox = document.getElementById(option);
        if (checkbox) {
            availability[option] = checkbox.checked;
        }
    });
    
    // Update user data
    userData.name = nameInput ? nameInput.value : userData.name;
    userData.location = locationInput ? locationInput.value : userData.location;
    userData.bio = bioInput ? bioInput.value : userData.bio;
    userData.experience = experienceInput ? experienceInput.value : userData.experience;
    userData.skills = skills;
    userData.availability = availability;
    
    // Save updated user data
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Saved user data:', userData);
    
    // Close modal
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Refresh profile view
    loadUserProfile();
}

// Function to handle avatar upload
function handleAvatarUpload(e) {
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
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            
            if (!currentUser) {
                showNotification('User data not found. Please log in again.', 'error');
                return;
            }
            
            if (!token) {
                showNotification('Authentication token not found. Please log in again.', 'error');
                return;
            }
            
            // Update avatar locally first for immediate UI feedback
            currentUser.avatar = imageData;
            currentUser.profileImage = imageData; // Update both fields for consistency
            
            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) {
                profileAvatar.innerHTML = '';
                profileAvatar.style.background = `url(${imageData}) center/cover`;
            } else {
                console.warn('Profile avatar element not found in the DOM');
            }
            
            // Prepare data for server update
            const userData = {
                profileImage: imageData
            };
            
            // Save to server
            saveUserToDatabase(userData, token)
                .then(data => {
                    console.log('Profile image update response:', data);
                    
                    // Update localStorage with server response
                    if (data && data.profileImage) {
                        currentUser.profileImage = data.profileImage;
                        currentUser.avatar = data.profileImage; // Keep both in sync
                    }
                    
                    // Update both localStorage keys for consistency
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    
                    // Show success message
                    showNotification('Profile picture updated!');
                })
                .catch(error => {
                    console.error('Error saving profile picture:', error);
                    
                    // Still update localStorage with our local changes
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    
                    showNotification('Profile picture saved locally, but server update failed.', 'warning');
                });
        } catch (error) {
            console.error('Error processing profile image:', error);
            showNotification('Error processing profile image: ' + error.message, 'error');
        }
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        showNotification('Error reading file. Please try again.', 'error');
    };
    
    reader.readAsDataURL(file);
}

// Function to setup tag inputs
function setupTagInputs() {
    console.log('Setting up tag inputs for skills');
    
    // Teach skills input
    const teachInput = document.getElementById('teachSkillInput');
    const teachContainer = document.getElementById('selectedTeachSkills');
    
    if (teachInput && teachContainer) {
        console.log('Found teach skills input and container');
        
        // Remove any previous event listeners to avoid duplicates
        const newTeachInput = teachInput.cloneNode(true);
        teachInput.parentNode.replaceChild(newTeachInput, teachInput);
        
        // Add new event listener
        newTeachInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                console.log('Adding teach skill:', this.value.trim());
                addTag(this.value.trim(), teachContainer, 'teach');
                this.value = '';
            }
        });
    } else {
        console.error('Teach skills input or container not found', {
            teachInput: teachInput?.id,
            teachContainer: teachContainer?.id
        });
    }
    
    // Learn skills input
    const learnInput = document.getElementById('learnSkillInput');
    const learnContainer = document.getElementById('selectedLearnSkills');
    
    if (learnInput && learnContainer) {
        console.log('Found learn skills input and container');
        
        // Remove any previous event listeners to avoid duplicates
        const newLearnInput = learnInput.cloneNode(true);
        learnInput.parentNode.replaceChild(newLearnInput, learnInput);
        
        // Add new event listener
        newLearnInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                console.log('Adding learn skill:', this.value.trim());
                addTag(this.value.trim(), learnContainer, 'learn');
                this.value = '';
            }
        });
    } else {
        console.error('Learn skills input or container not found', {
            learnInput: learnInput?.id,
            learnContainer: learnContainer?.id
        });
    }
    
    // Log the current state of the skills containers
    logSkillContainers();
}

// Helper function to log the current state of skill containers
function logSkillContainers() {
    const teachContainer = document.getElementById('selectedTeachSkills');
    const learnContainer = document.getElementById('selectedLearnSkills');
    
    if (teachContainer) {
        const teachTags = Array.from(teachContainer.querySelectorAll('.tag'))
            .map(tag => tag.textContent.replace('×', '').trim());
        console.log('Current teach skills:', teachTags);
    }
    
    if (learnContainer) {
        const learnTags = Array.from(learnContainer.querySelectorAll('.tag'))
            .map(tag => tag.textContent.replace('×', '').trim());
        console.log('Current learn skills:', learnTags);
    }
}

// Function to add a tag
function addTag(text, container, type) {
    if (!text || !container) {
        console.error(`Unable to add tag: text=${text}, container=${container}, type=${type}`);
        return;
    }
    
    console.log(`Adding tag: ${text} to ${container.id} (type: ${type})`);
    
    // Trim the text
    text = text.trim();
    if (text === '') {
        console.warn('Empty tag text, ignoring');
        return;
    }
    
    // Check if tag already exists (checking both .tag and .skill-tag classes)
    const existingTags = container.querySelectorAll('.tag, .skill-tag');
    for (let tag of existingTags) {
        const tagText = tag.textContent.replace('×', '').trim();
        if (tagText.toLowerCase() === text.toLowerCase()) {
            console.warn(`Tag "${text}" already exists, ignoring`);
            return;
        }
    }
    
    // Create tag element - use both .tag and .skill-tag classes for consistency
    const tag = document.createElement('div');
    tag.className = 'tag skill-tag'; // Use both classes for compatibility
    tag.innerHTML = `${text} <span class="remove-tag">×</span>`;
    
    // Add click event to remove tag
    const removeBtn = tag.querySelector('.remove-tag');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            console.log(`Removing tag: ${text}`);
            container.removeChild(tag);
            
            // Log remaining tags for debugging
            const remainingTags = Array.from(container.querySelectorAll('.tag, .skill-tag'))
                .map(t => t.textContent.replace('×', '').trim());
            console.log(`Remaining tags in ${container.id}:`, remainingTags);
        });
    }
    
    container.appendChild(tag);
    
    // Log success
    console.log(`Tag "${text}" added successfully to ${container.id}`);
    
    // Log all tags for debugging
    const allTags = Array.from(container.querySelectorAll('.tag, .skill-tag'))
        .map(t => t.textContent.replace('×', '').trim());
    console.log(`All tags in ${container.id}:`, allTags);
}

// Function to show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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
    });
}

// Function to logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Define availability options globally so it's accessible in all functions
const availabilityOptions = [
    'availWeekdayMornings', 'availWeekdayAfternoons', 'availWeekdayEvenings',
    'availWeekendMornings', 'availWeekendAfternoons', 'availWeekendEvenings'
]; 