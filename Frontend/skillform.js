document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initializeTagInputs();
    initializeAdvancedFilters();
    initializeFormSubmission();
    initializeViewToggle();
    initializePagination();
    initializeModalHandlers();
    initializeFieldSelector();
    initializeSortButtons();
});

// Global variables
let currentMatches = [];
let currentPage = 1;
const matchesPerPage = 9;
let currentView = 'grid';
let currentField = 'all'; // Default field is all

// Skill categories mapping
const skillCategories = {
    technology: [
        "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go",
        "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET",
        "HTML", "CSS", "SASS", "Bootstrap", "Tailwind CSS", "Material UI", "Web Design", "Responsive Design",
        "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "DevOps", "CI/CD", "Git", "GitHub", "GitLab",
        "SQL", "MongoDB", "PostgreSQL", "MySQL", "Oracle", "Firebase", "Redis", "ElasticSearch",
        "Machine Learning", "Data Science", "TensorFlow", "PyTorch", "Natural Language Processing", "Computer Vision",
        "Blockchain", "Smart Contracts", "Solidity", "Ethereum", "Web3",
        "Mobile Development", "iOS Development", "Android Development", "React Native", "Flutter"
    ],
    creative: [
        "Game Development", "Unity", "Unreal Engine", "3D Modeling", "Animation",
        "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign",
        "Photography", "Portrait Photography", "Landscape Photography", "Product Photography", "Lightroom",
        "Videography", "Video Editing", "After Effects", "Premiere Pro", "Final Cut Pro", "DaVinci Resolve",
        "Graphic Design", "Logo Design", "Brand Identity", "Typography", "Illustration", "Animation",
        "Drawing", "Painting", "Sculpture", "Pottery", "Printmaking", "Calligraphy", "Watercolor"
    ],
    business: [
        "SEO", "Digital Marketing", "Content Marketing", "Social Media Marketing", "Email Marketing", "Google Analytics",
        "Project Management", "Agile", "Scrum", "Kanban", "Product Management", "Business Strategy",
        "Marketing", "Branding", "Public Relations", "Customer Service", "Sales", "Negotiation", 
        "Financial Analysis", "Accounting", "Bookkeeping", "Tax Preparation", "Investment", "Stock Trading",
        "Business Development", "Entrepreneurship", "Startup", "E-commerce", "Business Planning",
        "Leadership", "Team Management", "Conflict Resolution", "Communication", "Public Speaking", "Presentation"
    ],
    language: [
        "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Russian", "Italian", "Portuguese",
        "Arabic", "Hindi", "Bengali", "Urdu", "Turkish", "Dutch", "Swedish", "Polish", "Greek", "Hebrew"
    ],
    music: [
        "Music Production", "Sound Design", "Audio Engineering", "Ableton Live", "Logic Pro", "FL Studio",
        "Guitar", "Piano", "Drums", "Singing", "Music Theory", "Songwriting", "Mixing", "Mastering",
        "Violin", "Cello", "Bass Guitar", "Saxophone", "Trumpet", "Flute",
        "DJ Skills", "Electronic Music Production", "Classical Music", "Jazz", "Rock", "Hip Hop", "Musical Theater"
    ],
    cooking: [
        "Cooking", "Baking", "Pastry", "Cake Decorating", "Wine Tasting", "Cocktail Making", "Barista Skills",
        "Nutrition", "Diet Planning", "Meal Prep", "Vegan Cooking", "Gluten-Free Cooking",
        "Italian Cuisine", "French Cuisine", "Asian Cuisine", "Mediterranean Cuisine", "Latin American Cuisine",
        "Bread Making", "Desserts", "Grilling", "Slow Cooking", "Knife Skills", "Food Photography"
    ],
    fitness: [
        "Fitness Training", "Yoga", "Pilates", "Meditation", "Weight Training", "Crossfit", "Calisthenics",
        "Running", "Cycling", "Swimming", "Martial Arts", "Boxing", "Kickboxing", "Dance",
        "Nutrition Coaching", "Personal Training", "Group Fitness Instruction", "Stretching", "Mobility"
    ],
    outdoor: [
        "Hiking", "Camping", "Backpacking", "Rock Climbing", "Mountaineering", "Survival Skills",
        "Swimming", "Surfing", "Scuba Diving", "Sailing", "Kayaking", "Fishing", "Hunting",
        "Cycling", "Mountain Biking", "Skateboarding", "Snowboarding", "Skiing", "Ice Skating",
        "Gardening", "Plant Care", "Landscape Design", "Beekeeping", "Foraging"
    ]
};

// Initialize field selector functionality
function initializeFieldSelector() {
    const fieldSelector = document.getElementById('fieldSelector');
    const skillSuggestions = document.getElementById('skillSuggestions');
    const offeredSkillSuggestions = document.getElementById('offeredSkillSuggestions');
    
    if (!fieldSelector) return;
    
    // Initial load of skill suggestions
    updateSkillSuggestions(fieldSelector.value);
    
    // Add change event listener
    fieldSelector.addEventListener('change', function() {
        currentField = this.value;
        updateSkillSuggestions(currentField);
    });
    
    // Function to handle clicking on wanted skill suggestions
    if (skillSuggestions) {
        skillSuggestions.addEventListener('click', function(e) {
            if (e.target.classList.contains('skill-suggestion')) {
                const skill = e.target.textContent;
                const selectedSkillsWanted = document.getElementById('selectedSkillsWanted');
                addTag(skill, selectedSkillsWanted, 'wanted');
            }
        });
    }
    
    // Function to handle clicking on offered skill suggestions
    if (offeredSkillSuggestions) {
        offeredSkillSuggestions.addEventListener('click', function(e) {
            if (e.target.classList.contains('skill-suggestion')) {
                const skill = e.target.textContent;
                const selectedSkillsOffered = document.getElementById('selectedSkillsOffered');
                addTag(skill, selectedSkillsOffered, 'offered');
            }
        });
    }
}

// Update skill suggestions based on selected field
function updateSkillSuggestions(field) {
    // Update wanted skills suggestions
    updateSuggestionContainer('skillSuggestions', field);
    
    // Update offered skills suggestions
    updateSuggestionContainer('offeredSkillSuggestions', field);
}

// Update a specific suggestion container
function updateSuggestionContainer(containerId, field) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (field === 'all') {
        // Show a selection of skills from each category
        Object.keys(skillCategories).forEach(category => {
            // Create category title
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'skill-category-title';
            categoryTitle.textContent = formatCategoryName(category);
            container.appendChild(categoryTitle);
            
            // Show top 5 skills from each category (less to save space)
            const topSkills = skillCategories[category].slice(0, 5);
            topSkills.forEach(skill => {
                const skillElement = createSkillSuggestion(skill);
                container.appendChild(skillElement);
            });
        });
    } else if (skillCategories[field]) {
        // Show skills from the selected category
        skillCategories[field].forEach(skill => {
            const skillElement = createSkillSuggestion(skill);
            container.appendChild(skillElement);
        });
    }
}

// Create a skill suggestion element
function createSkillSuggestion(skill) {
    const element = document.createElement('div');
    element.className = 'skill-suggestion';
    element.textContent = skill;
    return element;
}

// Format category name for display
function formatCategoryName(category) {
    const formatted = category.charAt(0).toUpperCase() + category.slice(1);
    return formatted.replace(/([A-Z])/g, ' $1').trim();
}

// Initialize tag input functionality
function initializeTagInputs() {
    const skillsWantedInput = document.getElementById('skillsWantedInput');
    const skillsOfferedInput = document.getElementById('skillsOfferedInput');
    const selectedSkillsWanted = document.getElementById('selectedSkillsWanted');
    const selectedSkillsOffered = document.getElementById('selectedSkillsOffered');
    
    // Populate autocomplete data 
    const autocompleteSkills = getAllSkills();
    
    // Skills wanted input
    if (skillsWantedInput) {
        skillsWantedInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                addTag(this.value.trim(), selectedSkillsWanted, 'wanted');
                this.value = '';
            }
        });
    }
    
    // Skills offered input
    if (skillsOfferedInput) {
        skillsOfferedInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                e.preventDefault();
                addTag(this.value.trim(), selectedSkillsOffered, 'offered');
                this.value = '';
            }
        });
    }
    
    // Initialize autocomplete 
    if (autocompleteSkills.length > 0) {
        if (skillsWantedInput) setupAutocomplete(skillsWantedInput, autocompleteSkills);
        if (skillsOfferedInput) setupAutocomplete(skillsOfferedInput, autocompleteSkills);
    }
}

// Get all skills from all categories
function getAllSkills() {
    // First try to get skills from the mock dataset
    if (window.skillSwapAllSkills && window.skillSwapAllSkills.length > 0) {
        return window.skillSwapAllSkills;
    }
    
    // Fallback to our local categories
    let allSkills = [];
    Object.values(skillCategories).forEach(categorySkills => {
        allSkills = [...allSkills, ...categorySkills];
    });
    
    return allSkills;
}

// Basic autocomplete functionality
function setupAutocomplete(inputElement, items) {
    // This is a simplified implementation - in production, you might want to use a library like select2 or autocomplete.js
    inputElement.addEventListener('input', function(e) {
        const val = this.value.trim().toLowerCase();
        if (!val) return;
        
        // Find matching skills
        const matches = items.filter(item => 
            item.toLowerCase().includes(val)
        ).slice(0, 5); // Limit to 5 suggestions
        
        // For a real implementation, you would create a dropdown with these matches
        console.log('Autocomplete suggestions:', matches);
    });
}

// Add a tag to the selected tags container
function addTag(text, container, type) {
    // Check if tag already exists
    const existingTags = container.querySelectorAll('.tag');
    for (let tag of existingTags) {
        if (tag.textContent.replace('×', '').trim() === text) {
            return;
        }
    }
    
    // Create tag element
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `${text} <span class="remove-tag">×</span>`;
    
    // Add click event to remove tag
    tag.querySelector('.remove-tag').addEventListener('click', function() {
        container.removeChild(tag);
    });
    
    container.appendChild(tag);
}

// Toggle advanced filters
function initializeAdvancedFilters() {
    const toggleBtn = document.getElementById('toggleAdvancedFilters');
    const filtersSection = document.getElementById('advancedFilters');
    
    toggleBtn.addEventListener('click', function() {
        const isVisible = filtersSection.style.display !== 'none';
        filtersSection.style.display = isVisible ? 'none' : 'block';
        toggleBtn.innerHTML = isVisible ? 
            '<i class="fas fa-sliders-h"></i> Advanced Filters' : 
            '<i class="fas fa-sliders-h"></i> Hide Advanced Filters';
    });
}

// Handle form submission and match finding
function initializeFormSubmission() {
    const form = document.getElementById('skillMatchForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form - make sure at least one skill is selected
        const wantedSkills = getSelectedTags('selectedSkillsWanted');
        if (wantedSkills.length === 0) {
            alert('Please select at least one skill you want to learn.');
            return;
        }
        
        // Show loading screen
        showLoadingScreen();
        
        // Simulate AI processing time
        setTimeout(() => {
            // Get form data
            const formData = getFormData();
            
            // Find matches using the AI algorithm
            findMatches(formData);
            
            // If no matches found or no user data, create dummy users
            if (currentMatches.length === 0) {
                createDummyUserMatches(formData);
            }
            
            // Hide loading screen after processing
            hideLoadingScreen();
            
            // Show results section
            showResultsSection();
        }, 2500); // Simulated processing time
    });
}

// Get all selected tags from a container
function getSelectedTags(containerId) {
    const container = document.getElementById(containerId);
    const tags = container.querySelectorAll('.tag');
    return Array.from(tags).map(tag => tag.textContent.replace('×', '').trim());
}

// Get all form data
function getFormData() {
    return {
        wantedSkills: getSelectedTags('selectedSkillsWanted'),
        offeredSkills: getSelectedTags('selectedSkillsOffered'),
        availability: document.getElementById('availabilityPreference').value,
        experienceLevel: document.getElementById('experienceLevel').value,
        certification: document.getElementById('certificationPreference').value,
        matchCount: parseInt(document.getElementById('matchCount').value),
        teachingStyle: document.getElementById('teachingStylePreference')?.value || '',
        location: document.getElementById('locationPreference')?.value || '',
        language: document.getElementById('languagePreference')?.value || ''
    };
}

// Show loading animation
function showLoadingScreen() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'flex';
    
    // Animate the loading steps
    const steps = document.querySelectorAll('.loading-steps .step');
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
        } else {
            clearInterval(progressInterval);
        }
    }, 600);
}

// Hide loading animation
function hideLoadingScreen() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

// Show results section
function showResultsSection() {
    document.getElementById('matchResults').style.display = 'block';
    // Scroll to results
    document.getElementById('matchResults').scrollIntoView({behavior: 'smooth'});
}

// AI Matching Algorithm
function findMatches(formData) {
    // Get users from the mock dataset
    const users = window.skillSwapUsers || [];
    if (users.length === 0) {
        console.error('User data not available');
        return;
    }
    
    // Calculate match scores for each user
    const scoredMatches = users.map(user => {
        const score = calculateMatchScore(user, formData);
        return { user, score };
    });
    
    // Sort by score (descending)
    scoredMatches.sort((a, b) => b.score - a.score);
    
    // Filter out users with zero score
    const validMatches = scoredMatches.filter(match => match.score > 0);
    
    // Limit to requested number of matches
    const topMatches = validMatches.slice(0, formData.matchCount || 10);
    
    // Save matches and display
    currentMatches = topMatches;
    currentPage = 1;
    displayMatches();
    
    // Update count in the results summary
    document.querySelector('.results-summary #matchCount').textContent = topMatches.length;
    
    // Show no results message if needed
    if (topMatches.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('matchesList').style.display = 'none';
        document.querySelector('.pagination').style.display = 'none';
    } else {
        document.getElementById('noResults').style.display = 'none';
        document.getElementById('matchesList').style.display = 'grid';
        document.querySelector('.pagination').style.display = 'flex';
    }
}

// Calculate match score between user and form data
function calculateMatchScore(user, formData) {
    if (!user || !formData) return 0;
    
    let score = 0;
    const weights = {
        skillMatch: 40,       // 40% of score - most important
        availability: 15,     // 15% of score
        experienceLevel: 10,  // 10% of score
        certification: 5,     // 5% of score
        teachingStyle: 5,     // 5% of score
        location: 5,          // 5% of score
        language: 5,          // 5% of score
        rating: 10,           // 10% of score
        skillExchange: 5      // 5% bonus for skill exchange potential
    };
    
    // 1. Skill Match (most important factor)
    const wantedSkills = formData.wantedSkills;
    if (wantedSkills.length === 0) return 0; // Must have at least one wanted skill
    
    const matchingSkills = user.skills.teach.filter(skill => 
        wantedSkills.some(wantedSkill => 
            wantedSkill.toLowerCase() === skill.toLowerCase()
        )
    );
    
    if (matchingSkills.length === 0) return 0; // No matching skills, no match
    
    // Calculate skill match score (percentage of wanted skills the user can teach)
    const skillMatchPercentage = matchingSkills.length / wantedSkills.length;
    score += skillMatchPercentage * weights.skillMatch;
    
    // 2. Availability Match
    if (formData.availability && user.availability) {
        if (formData.availability === '') {
            // No preference, give full points
            score += weights.availability;
        } else if (user.availability.includes(formData.availability)) {
            score += weights.availability;
        }
    } else {
        // No availability preference, give full points
        score += weights.availability;
    }
    
    // 3. Experience Level
    if (formData.experienceLevel && user.experienceLevel) {
        if (formData.experienceLevel === '') {
            // No preference, give full points
            score += weights.experienceLevel;
        } else if (user.experienceLevel === formData.experienceLevel) {
            score += weights.experienceLevel;
        } else {
            // Partial points for nearby experience levels
            const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
            const userIndex = levels.indexOf(user.experienceLevel);
            const requestedIndex = levels.indexOf(formData.experienceLevel);
            
            if (userIndex !== -1 && requestedIndex !== -1) {
                const distance = Math.abs(userIndex - requestedIndex);
                if (distance === 1) {
                    score += weights.experienceLevel * 0.5; // Half points for adjacent level
                }
            }
        }
    } else {
        // No experience level preference, give full points
        score += weights.experienceLevel;
    }
    
    // 4. Certification
    if (formData.certification) {
        if (formData.certification === '') {
            // No preference, give full points
            score += weights.certification;
        } else if (formData.certification === 'certified' && user.isCertified) {
            score += weights.certification;
        } else if (formData.certification === 'non_certified' && !user.isCertified) {
            score += weights.certification;
        }
    } else {
        // No certification preference, give full points
        score += weights.certification;
    }
    
    // 5. Teaching Style
    if (formData.teachingStyle && user.teachingStyle) {
        if (formData.teachingStyle === '') {
            // No preference, give full points
            score += weights.teachingStyle;
        } else if (user.teachingStyle === formData.teachingStyle) {
            score += weights.teachingStyle;
        }
    } else {
        // No teaching style preference, give full points
        score += weights.teachingStyle;
    }
    
    // 6. Location preference
    if (formData.location && user.locationPreference) {
        if (formData.location === '') {
            // No preference, give full points
            score += weights.location;
        } else if (user.locationPreference === formData.location) {
            score += weights.location;
        } else if (user.locationPreference === 'hybrid') {
            // Hybrid users can accommodate either preference
            score += weights.location * 0.7; // 70% points for hybrid
        }
    } else {
        // No location preference, give full points
        score += weights.location;
    }
    
    // 7. Language
    if (formData.language && user.languages) {
        if (formData.language === '') {
            // No preference, give full points
            score += weights.language;
        } else if (user.languages.includes(formData.language)) {
            score += weights.language;
        }
    } else {
        // No language preference, give full points
        score += weights.language;
    }
    
    // 8. Rating
    if (user.rating > 0) {
        // Rating is on a scale of 0-5, normalize to 0-1
        const ratingNormalized = user.rating / 5;
        score += ratingNormalized * weights.rating;
    } else {
        // No rating yet, give partial points
        score += weights.rating * 0.5;
    }
    
    // 9. Skill Exchange Potential (bonus)
    if (formData.offeredSkills.length > 0 && user.skills.learn) {
        const exchangeableSkills = user.skills.learn.filter(skill =>
            formData.offeredSkills.some(offeredSkill =>
                offeredSkill.toLowerCase() === skill.toLowerCase()
            )
        );
        
        if (exchangeableSkills.length > 0) {
            // Bonus for potential skill exchange
            const exchangeBonus = (exchangeableSkills.length / user.skills.learn.length) * weights.skillExchange;
            score += exchangeBonus;
        }
    }
    
    return Math.min(score / 100, 1); // Normalize to 0-1 range
}

// Display matches in the UI
function displayMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';
    matchesList.className = currentView === 'grid' ? 'matches-grid' : 'matches-list';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * matchesPerPage;
    const endIndex = Math.min(startIndex + matchesPerPage, currentMatches.length);
    const visibleMatches = currentMatches.slice(startIndex, endIndex);
    
    // Update pagination controls
    updatePagination();
    
    if (visibleMatches.length === 0) {
        matchesList.innerHTML = '<p class="no-matches-text">No matches found. Try adjusting your criteria.</p>';
        return;
    }
    
    // Create and append match cards
    visibleMatches.forEach(match => {
        const matchCard = createMatchCard(match);
        matchesList.appendChild(matchCard);
    });
}

// Function to create a match card 
function createMatchCard(match) {
    const { user, score } = match;
    const initial = user.name.charAt(0);
    
    // Format score as percentage
    const scorePercentage = Math.round(score * 100) + '%';
    
    const card = document.createElement('div');
    card.className = 'match-card';
    
    // Add hover effect and animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'match-card-header';
    
    // Create avatar with initial
    const avatar = document.createElement('div');
    avatar.className = 'match-avatar';
    avatar.innerHTML = `<span>${initial}</span>`;
    
    // Create percentage display
    const percentage = document.createElement('div');
    percentage.className = 'match-percentage';
    percentage.textContent = scorePercentage;
    
    // Create name
    const name = document.createElement('h3');
    name.className = 'match-name';
    name.textContent = user.name;
    name.title = user.name; // Add tooltip for long names
    
    // Create location
    const location = document.createElement('div');
    location.className = 'match-location';
    location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${user.location}`;
    location.title = user.location; // Add tooltip for long locations
    
    // Add all elements to header
    header.appendChild(avatar);
    header.appendChild(name);
    header.appendChild(location);
    header.appendChild(percentage);
    
    // Create body
    const body = document.createElement('div');
    body.className = 'match-card-body';
    
    // Create skills section
    const skillsSection = document.createElement('div');
    skillsSection.className = 'match-skills';
    
    // Skills heading
    const skillsHeading = document.createElement('h4');
    skillsHeading.textContent = 'Skills:';
    skillsHeading.style.marginBottom = '10px';
    
    const skillTags = document.createElement('div');
    skillTags.className = 'skill-tags';
    
    // Add skills tags (max 3 for display)
    const skillsToShow = user.skills.teach.slice(0, 3);
    skillsToShow.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        tag.title = skill; // Add tooltip for long skill names
        skillTags.appendChild(tag);
    });
    
    // If there are more skills than we're showing
    if (user.skills.teach.length > 3) {
        const moreTag = document.createElement('span');
        moreTag.className = 'skill-tag';
        moreTag.textContent = `+${user.skills.teach.length - 3} more`;
        moreTag.style.backgroundColor = 'rgba(78, 66, 212, 0.04)';
        skillTags.appendChild(moreTag);
    }
    
    skillsSection.appendChild(skillsHeading);
    skillsSection.appendChild(skillTags);
    
    // Create bio section
    const bioSection = document.createElement('div');
    bioSection.className = 'match-bio-section';
    
    // About heading
    const bioHeading = document.createElement('h4');
    bioHeading.textContent = 'About:';
    bioHeading.style.marginBottom = '10px';
    
    const bio = document.createElement('div');
    bio.className = 'match-bio';
    const truncatedBio = user.bio.length > 100 ? user.bio.substring(0, 100) + '...' : user.bio;
    bio.textContent = truncatedBio;
    bio.title = user.bio; // Add tooltip for full bio text
    
    bioSection.appendChild(bioHeading);
    bioSection.appendChild(bio);
    
    // Create stats
    const stats = document.createElement('div');
    stats.className = 'match-stats';
    
    // Experience stat
    const expStat = document.createElement('div');
    expStat.className = 'match-stat';
    expStat.innerHTML = `
        <span class="match-stat-value">${user.experience}+</span>
        <span class="match-stat-label">Years Exp</span>
    `;
    
    // Rating stat
    const ratingStat = document.createElement('div');
    ratingStat.className = 'match-stat';
    ratingStat.innerHTML = `
        <span class="match-stat-value">${user.rating}</span>
        <span class="match-stat-label">Rating</span>
    `;
    
    // Sessions stat
    const sessionsStat = document.createElement('div');
    sessionsStat.className = 'match-stat';
    sessionsStat.innerHTML = `
        <span class="match-stat-value">${user.sessions || '0'}</span>
        <span class="match-stat-label">Sessions</span>
    `;
    
    stats.appendChild(expStat);
    stats.appendChild(ratingStat);
    stats.appendChild(sessionsStat);
    
    // Add all elements to body
    body.appendChild(skillsSection);
    body.appendChild(bioSection);
    body.appendChild(stats);
    
    // Create actions
    const actions = document.createElement('div');
    actions.className = 'match-actions';
    
    // View profile button
    const viewBtn = document.createElement('button');
    viewBtn.className = 'view-profile-btn';
    viewBtn.innerHTML = '<i class="fas fa-user"></i> View Profile';
    viewBtn.addEventListener('click', () => openMatchDetail(match));
    
    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-match-btn';
    saveBtn.innerHTML = '<i class="far fa-bookmark"></i>';
    saveBtn.title = "Save Profile";
    
    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        saveBtn.style.color = 'var(--primary-color)';
    });
    
    actions.appendChild(viewBtn);
    actions.appendChild(saveBtn);
    
    // Add all sections to card
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(actions);
    
    // Add staggered animation effect when cards appear
    setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 50);
    
    return card;
}

// Initialize view toggle (grid/list)
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current view
            currentView = this.dataset.view;
            
            // Redisplay matches
            displayMatches();
        });
    });
}

// Initialize pagination controls
function initializePagination() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayMatches();
        }
    });
    
    nextButton.addEventListener('click', function() {
        const totalPages = Math.ceil(currentMatches.length / matchesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayMatches();
        }
    });
}

// Update pagination controls and info
function updatePagination() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageIndicator = document.getElementById('pageIndicator');
    
    const totalPages = Math.ceil(currentMatches.length / matchesPerPage);
    
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages || 1}`;
}

// Initialize modal handlers
function initializeModalHandlers() {
    // Close buttons for all modals
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Open match detail modal
function openMatchDetail(match) {
    const { user, score } = match;
    const modal = document.getElementById('matchDetailModal');
    
    // Populate modal with user data
    document.getElementById('matchInitial').textContent = user.name.charAt(0);
    document.getElementById('matchName').textContent = user.name;
    document.getElementById('matchRating').textContent = user.rating > 0 ? user.rating : 'New';
    document.getElementById('matchReviewCount').textContent = user.reviewCount > 0 ? `(${user.reviewCount} reviews)` : '';
    document.getElementById('matchLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${user.location}`;
    document.getElementById('matchExperience').innerHTML = `<i class="fas fa-briefcase"></i> ${user.experience} years experience`;
    document.getElementById('compatibilityScore').textContent = `${Math.round(score * 100)}%`;
    document.getElementById('matchBio').textContent = user.bio;
    
    // Populate skills
    const teachSkills = document.getElementById('teachSkills');
    teachSkills.innerHTML = '';
    user.skills.teach.forEach(skill => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        teachSkills.appendChild(tag);
    });
    
    const learnSkills = document.getElementById('learnSkills');
    learnSkills.innerHTML = '';
    user.skills.learn.forEach(skill => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        learnSkills.appendChild(tag);
    });
    
    // Populate availability grid
    const availabilityData = document.getElementById('availabilityData');
    availabilityData.innerHTML = '';
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-label';
        dayLabel.textContent = day;
        dayColumn.appendChild(dayLabel);
        
        const timeSlots = [
            { id: 'morning', label: 'Morning', available: user.availability.includes('weekday_mornings') && day !== 'Sat' && day !== 'Sun' || user.availability.includes('weekend_mornings') && (day === 'Sat' || day === 'Sun') },
            { id: 'afternoon', label: 'Afternoon', available: user.availability.includes('weekday_afternoons') && day !== 'Sat' && day !== 'Sun' || user.availability.includes('weekend_afternoons') && (day === 'Sat' || day === 'Sun') },
            { id: 'evening', label: 'Evening', available: user.availability.includes('weekday_evenings') && day !== 'Sat' && day !== 'Sun' || user.availability.includes('weekend_evenings') && (day === 'Sat' || day === 'Sun') }
        ];
        
        timeSlots.forEach(slot => {
            const timeSlot = document.createElement('div');
            timeSlot.className = `time-slot${slot.available ? ' available' : ''}`;
            timeSlot.textContent = slot.label;
            dayColumn.appendChild(timeSlot);
        });
        
        availabilityData.appendChild(dayColumn);
    });
    
    // Populate certifications
    const certificationsList = document.getElementById('certificationsList');
    certificationsList.innerHTML = '';
    
    if (user.certifications && user.certifications.length > 0) {
        user.certifications.forEach(cert => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="certification-name">${cert.name}</span>
                <span class="certification-year">${cert.year}</span>
            `;
            certificationsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No certifications listed';
        certificationsList.appendChild(li);
    }
    
    // Populate reviews
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';
    
    if (user.reviews && user.reviews.length > 0) {
        user.reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            // Create stars
            const stars = Array(5).fill('').map((_, i) => {
                if (review.rating >= i + 1) {
                    return '<i class="fas fa-star"></i>'; // Full star
                } else if (review.rating >= i + 0.5) {
                    return '<i class="fas fa-star-half-alt"></i>'; // Half star
                } else {
                    return '<i class="far fa-star"></i>'; // Empty star
                }
            }).join('');
            
            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="reviewer">${review.reviewer}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">${stars}</div>
                <p class="review-text">${review.text}</p>
            `;
            
            reviewsList.appendChild(reviewItem);
        });
    } else {
        reviewsList.innerHTML = '<p>No reviews yet</p>';
    }
    
    // Show modal
    modal.style.display = 'flex';
}

// Handle sort option buttons
function initializeSortButtons() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    if (!sortButtons.length) return;
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sortButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get sort value from data attribute
            const sortValue = this.getAttribute('data-sort');
            
            // Sort the matches
            sortMatches(sortValue);
            
            // Display the matches with the new sort order
            displayMatches();
        });
    });
}

// Sort matches based on the selected criteria
function sortMatches(sortBy) {
    switch(sortBy) {
        case 'experience':
            currentMatches.sort((a, b) => b.user.experience - a.user.experience);
            break;
        case 'rating':
            currentMatches.sort((a, b) => b.user.rating - a.user.rating);
            break;
        case 'availability':
            currentMatches.sort((a, b) => b.user.availability.length - a.user.availability.length);
            break;
        case 'match_score':
        default:
            currentMatches.sort((a, b) => b.score - a.score);
            break;
    }
}

// Create dummy user matches if no real matches are found
function createDummyUserMatches(formData) {
    const dummyUsers = [
        {
            id: 1001,
            name: "Sarah Johnson",
            location: "New York, USA",
            experience: 6,
            rating: 4.8,
            reviewCount: 32,
            sessions: 47,
            bio: "Full-stack developer specialized in React and Node.js. I enjoy mentoring and have helped many beginners become professional developers.",
            skills: {
                teach: formData.wantedSkills.slice(0, 3),
                learn: formData.offeredSkills.length > 0 ? formData.offeredSkills.slice(0, 3) : ["UX Design", "Graphic Design", "Adobe XD"]
            },
            availability: ["weekday_evenings", "weekend_mornings"],
            experienceLevel: "advanced",
            isCertified: true,
            teachingStyle: "hands_on",
            locationPreference: "hybrid",
            languages: ["english", "spanish"],
            certifications: [
                { name: "React Developer Certification", year: "2022" },
                { name: "AWS Solutions Architect", year: "2021" }
            ],
            reviews: [
                { reviewer: "Michael P.", date: "June 2023", rating: 5, text: "Sarah is an amazing teacher! She explained complex concepts in a way that was easy to understand." },
                { reviewer: "Alex T.", date: "May 2023", rating: 4.5, text: "Great mentor who really cares about her students' progress." }
            ]
        },
        {
            id: 1002,
            name: "David Chen",
            location: "Boston, USA",
            experience: 8,
            rating: 4.9,
            reviewCount: 45,
            sessions: 68,
            bio: "Software engineer with expertise in machine learning and data science. I focus on project-based learning to help students build real-world applications.",
            skills: {
                teach: formData.wantedSkills.slice(0, 3),
                learn: formData.offeredSkills.length > 0 ? formData.offeredSkills.slice(0, 2) : ["JavaScript", "Web Development"]
            },
            availability: ["weekday_mornings", "weekend_afternoons"],
            experienceLevel: "expert",
            isCertified: true,
            teachingStyle: "project_based",
            locationPreference: "remote",
            languages: ["english", "chinese"],
            certifications: [
                { name: "TensorFlow Developer Certificate", year: "2022" },
                { name: "Google Data Analytics Professional", year: "2021" }
            ],
            reviews: [
                { reviewer: "Jennifer L.", date: "July 2023", rating: 5, text: "David's project-based approach helped me build a real portfolio while learning." },
                { reviewer: "Thomas K.", date: "April 2023", rating: 5, text: "Excellent mentor with deep knowledge. Always takes time to explain concepts thoroughly." }
            ]
        },
        {
            id: 1003,
            name: "Priya Patel",
            location: "Seattle, USA",
            experience: 5,
            rating: 4.7,
            reviewCount: 28,
            sessions: 35,
            bio: "UI/UX designer with a background in psychology. I help students understand the principles of user-centered design through practical examples.",
            skills: {
                teach: formData.wantedSkills.slice(0, 3),
                learn: formData.offeredSkills.length > 0 ? formData.offeredSkills.slice(0, 2) : ["Python", "Data Analysis"]
            },
            availability: ["weekday_afternoons", "weekend_evenings"],
            experienceLevel: "intermediate",
            isCertified: false,
            teachingStyle: "theoretical",
            locationPreference: "local",
            languages: ["english", "hindi"],
            certifications: [
                { name: "Certified UX Designer", year: "2021" }
            ],
            reviews: [
                { reviewer: "Kevin M.", date: "August 2023", rating: 4.5, text: "Priya's insights on user psychology transformed how I approach design problems." },
                { reviewer: "Sophia R.", date: "May 2023", rating: 5, text: "Great at explaining design principles and providing constructive feedback." }
            ]
        },
        {
            id: 1004,
            name: "Marco Rivera",
            location: "Austin, USA",
            experience: 7,
            rating: 4.6,
            reviewCount: 36,
            sessions: 51,
            bio: "Game developer and 3D modeler with a passion for teaching. I believe in learning by doing and creating fun projects together.",
            skills: {
                teach: formData.wantedSkills.slice(0, 3),
                learn: formData.offeredSkills.length > 0 ? formData.offeredSkills.slice(0, 2) : ["Spanish", "Digital Marketing"]
            },
            availability: ["weekday_evenings", "weekend_mornings", "weekend_afternoons"],
            experienceLevel: "advanced",
            isCertified: true,
            teachingStyle: "mentor_style",
            locationPreference: "hybrid",
            languages: ["english", "spanish"],
            certifications: [
                { name: "Unity Certified Developer", year: "2022" },
                { name: "Autodesk Maya Certification", year: "2020" }
            ],
            reviews: [
                { reviewer: "Linda W.", date: "June 2023", rating: 5, text: "Marco made learning game development fun and achievable. Great mentor!" },
                { reviewer: "Ryan B.", date: "March 2023", rating: 4, text: "Good at breaking down complex concepts into manageable steps." }
            ]
        },
        {
            id: 1005,
            name: "Emma Wilson",
            location: "Portland, USA",
            experience: 4,
            rating: 4.8,
            reviewCount: 22,
            sessions: 30,
            bio: "Digital marketer specializing in SEO and content strategy. I focus on practical skills that you can immediately apply to grow your business.",
            skills: {
                teach: formData.wantedSkills.slice(0, 3),
                learn: formData.offeredSkills.length > 0 ? formData.offeredSkills.slice(0, 2) : ["Photography", "Video Editing"]
            },
            availability: ["weekday_mornings", "weekday_afternoons"],
            experienceLevel: "intermediate",
            isCertified: true,
            teachingStyle: "hands_on",
            locationPreference: "remote",
            languages: ["english", "french"],
            certifications: [
                { name: "Google Analytics Certification", year: "2023" },
                { name: "HubSpot Content Marketing", year: "2022" }
            ],
            reviews: [
                { reviewer: "Daniel P.", date: "July 2023", rating: 5, text: "Emma's strategies helped me double my website traffic in just two months." },
                { reviewer: "Natalie S.", date: "April 2023", rating: 4.5, text: "Great at explaining SEO concepts in a way that's easy to understand and implement." }
            ]
        }
    ];
    
    // Calculate match scores for dummy users
    const scoredMatches = dummyUsers.map(user => {
        // Generate random score between 0.75 and 0.98
        const score = (Math.floor(Math.random() * 23) + 75) / 100;
        return { user, score };
    });
    
    // Sort by score (descending)
    scoredMatches.sort((a, b) => b.score - a.score);
    
    // Take only as many as requested in form
    const requestedCount = formData.matchCount || 10;
    currentMatches = scoredMatches.slice(0, requestedCount);
} 