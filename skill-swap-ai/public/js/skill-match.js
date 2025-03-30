document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const skillCategory = document.getElementById('skill-category');
    const skillsContainer = document.getElementById('skills-container');
    const teachSkillsContainer = document.getElementById('teach-skills-container');
    const availabilitySelect = document.getElementById('availability');
    const searchForm = document.getElementById('skill-search-form');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    const loadingOverlay = document.getElementById('loading-overlay');
    const matchModal = document.getElementById('match-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Store matches for filtering
    let currentMatches = [];

    // Error display function
    const showError = (message, container) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        container.innerHTML = '';
        container.appendChild(errorDiv);
    };

    // Load skills for a category
    const loadSkills = async (category, container, isTeachContainer = false) => {
        try {
            const response = await fetch(`/api/skills/${category}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch skills for ${category}`);
            }
            
            const skills = await response.json();
            
            if (!Array.isArray(skills) || skills.length === 0) {
                showError(`No skills found for ${category}`, container);
                return;
            }
            
            // Clear container
            container.innerHTML = '';
            
            // Create skills list
            const skillsList = document.createElement('div');
            skillsList.className = 'skills-list';
            
            // Sort skills alphabetically
            skills.sort();
            
            // Create checkbox for each skill
            skills.forEach(skill => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                
                const id = `${isTeachContainer ? 'teach-' : ''}skill-${skill.replace(/\s+/g, '-').toLowerCase()}`;
                
                skillItem.innerHTML = `
                    <input type="checkbox" id="${id}" name="${isTeachContainer ? 'teach-skills' : 'learn-skills'}" value="${skill}">
                    <label for="${id}">${skill}</label>
                `;
                
                skillsList.appendChild(skillItem);
            });
            
            container.appendChild(skillsList);
            
        } catch (error) {
            console.error('Error loading skills:', error);
            showError(error.message, container);
        }
    };

    // Handle category selection
    skillCategory.addEventListener('change', async () => {
        const category = skillCategory.value;
        
        if (!category) {
            skillsContainer.innerHTML = '<div class="empty-skills-message">Select a field first to see available skills</div>';
            teachSkillsContainer.innerHTML = '<div class="empty-skills-message">Select a field first to see available skills</div>';
            return;
        }
        
        loadingOverlay.style.display = 'flex';
        
        try {
            await Promise.all([
                loadSkills(category, skillsContainer),
                loadSkills(category, teachSkillsContainer, true)
            ]);
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });

    // Handle form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get selected skills
        const learnSkills = Array.from(document.querySelectorAll('input[name="learn-skills"]:checked'))
            .map(input => input.value);
        
        const teachSkills = Array.from(document.querySelectorAll('input[name="teach-skills"]:checked'))
            .map(input => input.value);
        
        const availability = Array.from(availabilitySelect.selectedOptions)
            .map(option => option.value);
        
        if (learnSkills.length === 0) {
            showError('Please select at least one skill you want to learn', skillsContainer);
            return;
        }
        
        loadingOverlay.style.display = 'flex';
        
        try {
            const response = await fetch('/api/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wanted_skills: learnSkills.map(skill => ({ skill, experience: 'Beginner' })),
                    offered_skills: teachSkills.map(skill => ({ skill, experience: 'Intermediate' })),
                    availability: availability
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to find matches');
            }
            
            const { matches } = await response.json();
            currentMatches = matches;
            
            displayMatches(matches);
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error finding matches:', error);
            showError(error.message, resultsContainer);
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });

    // Display matches
    const displayMatches = (matches) => {
        resultsContainer.innerHTML = '';
        
        if (!matches || matches.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        matches.forEach(match => {
            const { user, match_score, skill_match, availability_match, certification_score } = match;
            
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            
            const commonSkills = match.common_skills.map(skill => `
                <div class="match-skill-item common">
                    <span class="skill-name">${skill}</span>
                    <span class="skill-badge">Common</span>
                </div>
            `).join('');
            
            const additionalSkills = match.additional_skills.map(skill => `
                <div class="match-skill-item">
                    <span class="skill-name">${skill}</span>
                </div>
            `).join('');
            
            matchCard.innerHTML = `
                <div class="match-header">
                    <div class="match-score">${Math.round(match_score)}% Match</div>
                    <h3 class="match-name">${user.name}</h3>
                    <div class="match-scores">
                        <div class="score-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Skills: ${Math.round(skill_match)}%</span>
                        </div>
                        <div class="score-item">
                            <i class="fas fa-clock"></i>
                            <span>Availability: ${Math.round(availability_match)}%</span>
                        </div>
                        <div class="score-item">
                            <i class="fas fa-certificate"></i>
                            <span>Teaching: ${Math.round(certification_score)}%</span>
                        </div>
                    </div>
                </div>
                <div class="match-body">
                    <div class="match-skills">
                        <h4>Skills Match</h4>
                        <div class="skills-container">
                            ${commonSkills}
                            ${additionalSkills}
                        </div>
                    </div>
                    <div class="match-info">
                        <div class="info-item">
                            <i class="fas fa-calendar"></i>
                            <span>Available: ${user.availability.join(', ').replace(/_/g, ' ')}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-star"></i>
                            <span>Rating: ${user.rating}/5</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-award"></i>
                            <span>Completed: ${user.completed_swaps} swaps</span>
                        </div>
                    </div>
                    <div class="match-actions">
                        <button class="view-profile-btn" onclick="viewProfile(${user.id})">
                            View Profile
                        </button>
                        <button class="primary-btn contact-btn" onclick="contactUser(${user.id})">
                            <i class="fas fa-comments"></i> Contact
                        </button>
                    </div>
                </div>
            `;
            
            resultsContainer.appendChild(matchCard);
        });
    };

    // Handle match filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Sort matches based on filter
            let sortedMatches = [...currentMatches];
            switch (filter) {
                case 'availability':
                    sortedMatches.sort((a, b) => b.availability_match - a.availability_match);
                    break;
                case 'rating':
                    sortedMatches.sort((a, b) => b.user.rating - a.user.rating);
                    break;
                case 'experience':
                    sortedMatches.sort((a, b) => b.certification_score - a.certification_score);
                    break;
                default: // 'best'
                    sortedMatches.sort((a, b) => b.match_score - a.match_score);
            }
            
            displayMatches(sortedMatches);
        });
    });

    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', () => {
        matchModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === matchModal) {
            matchModal.style.display = 'none';
        }
    });
});

// View user profile
function viewProfile(userId) {
    // TODO: Implement profile viewing functionality
    alert(`Viewing profile of user ${userId}`);
}

// Contact user
function contactUser(userId) {
    // TODO: Implement contact functionality
    alert(`Contacting user ${userId}`);
} 