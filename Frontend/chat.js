// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login state
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showNotification('Please login to access the chat', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const skillName = urlParams.get('skill');
    const partnerName = urlParams.get('partner');

    // Update UI with skill name and partner
    if (skillName) {
        document.getElementById('currentSkill').textContent = skillName;
    }
    if (partnerName) {
        document.getElementById('partnerName').textContent = partnerName;
        document.getElementById('partnerInitial').textContent = partnerName.charAt(0).toUpperCase();
    }

    // Update current user data
    document.getElementById('currentUserName').textContent = user.name;
    document.getElementById('currentUserInitial').textContent = user.name.charAt(0).toUpperCase();

    // Initialize chat
    initializeChat();

    // Check login state and update UI
    checkLoginState();
});

// Function to check login state and update UI
function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('user'));
    const profileDropdown = document.getElementById('profileDropdown');
    const userInitial = document.getElementById('userInitial');

    if (user) {
        // User is logged in
        profileDropdown.style.display = 'block';
        userInitial.textContent = user.name.charAt(0).toUpperCase();
    } else {
        // User is not logged in
        showNotification('Please login to access the chat', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Function to toggle profile dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Function to open profile modal
function openProfileModal() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Update profile modal with user data
        document.getElementById('profileModalName').textContent = user.name;
        document.getElementById('profileModalEmail').textContent = user.email;
        document.getElementById('profileModalInitial').textContent = user.name.charAt(0).toUpperCase();
        
        // Load user's skills
        loadUserSkills();
        
        // Show the modal
        document.getElementById('profileModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Function to show add skill form
function showAddSkillForm() {
    document.getElementById('addSkillForm').style.display = 'block';
}

// Function to hide add skill form
function hideAddSkillForm() {
    document.getElementById('addSkillForm').style.display = 'none';
    // Reset form
    document.getElementById('skillName').value = '';
    document.getElementById('experienceLevel').value = '';
    document.getElementById('yearsExperience').value = '';
}

// Function to save new skill
function saveSkill() {
    const skillName = document.getElementById('skillName').value.trim();
    const experienceLevel = document.getElementById('experienceLevel').value;
    const yearsExperience = document.getElementById('yearsExperience').value;

    if (!skillName || !experienceLevel || !yearsExperience) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Get existing skills or initialize empty array
    const user = JSON.parse(localStorage.getItem('user'));
    user.skills = user.skills || [];
    
    // Add new skill
    user.skills.push({
        name: skillName,
        level: experienceLevel,
        years: yearsExperience
    });

    // Save updated user data
    localStorage.setItem('user', JSON.stringify(user));

    // Update UI
    loadUserSkills();
    hideAddSkillForm();
    showNotification('Skill added successfully!', 'success');
}

// Function to delete skill
function deleteSkill(skillIndex) {
    const user = JSON.parse(localStorage.getItem('user'));
    user.skills.splice(skillIndex, 1);
    localStorage.setItem('user', JSON.stringify(user));
    loadUserSkills();
    showNotification('Skill deleted successfully!', 'success');
}

// Function to load user's skills
function loadUserSkills() {
    const user = JSON.parse(localStorage.getItem('user'));
    const skillsList = document.getElementById('userSkillsList');
    skillsList.innerHTML = '';

    if (user.skills && user.skills.length > 0) {
        user.skills.forEach((skill, index) => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                ${skill.name}
                <span class="experience">${skill.level} (${skill.years} years)</span>
                <span class="delete-skill" onclick="deleteSkill(${index})">
                    <i class="fas fa-times"></i>
                </span>
            `;
            skillsList.appendChild(skillTag);
        });
    } else {
        skillsList.innerHTML = '<p class="no-skills">No skills added yet. Click "Add Skill" to get started!</p>';
    }
}

// Function to close profile modal
function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Function to edit profile
function editProfile() {
    showNotification('Profile editing coming soon!', 'info');
}

// Function to change password
function changePassword() {
    showNotification('Password change coming soon!', 'info');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const profileModal = document.getElementById('profileModal');
    if (event.target === profileModal) {
        closeProfileModal();
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

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

// Initialize chat functionality
function initializeChat() {
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');

    // Add welcome message
    addMessage("Welcome to the chat! You can start learning now.", 'received');

    // Handle message input
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Send message function
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        addMessage(message, 'sent');
        messageInput.value = '';

        // Simulate partner response (replace with actual API call)
        setTimeout(() => {
            addMessage("I'll help you learn this skill. What would you like to know first?", 'received');
        }, 1000);
    }
}

// Add message to chat
function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageText = document.createElement('div');
    messageText.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(messageText);
    messageDiv.appendChild(timeDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Call functionality
function startVideoCall() {
    const videoCallBtn = document.querySelector('.video-call');
    
    if (videoCallBtn.classList.contains('active')) {
        // End call
        videoCallBtn.classList.remove('active');
        videoCallBtn.innerHTML = '<i class="fas fa-video"></i> Video Call';
        showNotification('Video call ended', 'info');
    } else {
        // Start call
        videoCallBtn.classList.add('active');
        videoCallBtn.innerHTML = '<i class="fas fa-video-slash"></i> End Call';
        showNotification('Starting video call...', 'info');
    }
}

function startVoiceCall() {
    const voiceCallBtn = document.querySelector('.voice-call');
    
    if (voiceCallBtn.classList.contains('active')) {
        // End call
        voiceCallBtn.classList.remove('active');
        voiceCallBtn.innerHTML = '<i class="fas fa-phone"></i> Voice Call';
        showNotification('Voice call ended', 'info');
    } else {
        // Start call
        voiceCallBtn.classList.add('active');
        voiceCallBtn.innerHTML = '<i class="fas fa-phone-slash"></i> End Call';
        showNotification('Starting voice call...', 'info');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const profileIcon = document.querySelector('.profile-icon');
    
    if (!profileIcon.contains(event.target) && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    }
}); 