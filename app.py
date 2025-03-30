from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for
import json
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
import random

app = Flask(__name__, static_folder='skill-swap-ai/public', static_url_path='')

# Define skill categories
skill_categories = {
    'programming': [
        'Python', 'JavaScript', 'Java', 'C++', 'HTML/CSS', 'React', 'Node.js',
        'SQL', 'Machine Learning', 'Data Science', 'Web Development'
    ],
    'languages': [
        'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
        'Korean', 'Italian', 'Portuguese', 'Russian', 'Arabic'
    ],
    'music': [
        'Piano', 'Guitar', 'Violin', 'Drums', 'Singing', 'Music Theory',
        'Music Production', 'DJ', 'Saxophone', 'Flute'
    ],
    'art': [
        'Drawing', 'Painting', 'Digital Art', 'Graphic Design', 'Photography',
        'Animation', 'Illustration', 'Sculpture', 'UI/UX Design'
    ],
    'business': [
        'Marketing', 'Finance', 'Entrepreneurship', 'Project Management',
        'Public Speaking', 'Sales', 'Business Strategy', 'Leadership'
    ],
    'cooking': [
        'Baking', 'Italian Cuisine', 'Asian Cuisine', 'French Cuisine',
        'Pastry Making', 'Wine Pairing', 'Meal Planning', 'Vegan Cooking'
    ],
    'fitness': [
        'Yoga', 'Weight Training', 'Running', 'Dance', 'Martial Arts',
        'Pilates', 'CrossFit', 'Nutrition', 'Personal Training'
    ],
    'crafts': [
        'Knitting', 'Sewing', 'Woodworking', 'Pottery', 'Jewelry Making',
        'Origami', 'Calligraphy', 'DIY', 'Gardening'
    ]
}

# Load user data
with open('users.json', 'r', encoding='utf-8') as f:
    users = json.load(f)

# Create a skill index for faster lookups
all_skills = set()
for user in users:
    for skill in user['skills_offered']:
        all_skills.add(skill['skill'])
    for skill in user['skills_wanted']:
        all_skills.add(skill['skill'])
all_skills = list(all_skills)

def create_skill_vector(user_skills, all_skills):
    """Create a binary vector representing skills"""
    vector = np.zeros(len(all_skills))
    for skill in user_skills:
        try:
            idx = all_skills.index(skill['skill'])
            # Weight based on experience level
            weight = {'Beginner': 0.5, 'Intermediate': 0.75, 'Advanced': 1.0}
            vector[idx] = weight[skill['experience']]
        except ValueError:
            continue
    return vector

@app.route('/')
def home():
    """Serve the main page"""
    return send_from_directory('Frontend', 'index.html')

@app.route('/Image/<path:filename>')
def serve_image(filename):
    """Serve images from the Image directory"""
    return send_from_directory('Image', filename)

@app.route('/skillform')
def skill_form():
    """Serve the skill form page"""
    try:
        return send_from_directory('Frontend', 'skill-form.html')
    except:
        return redirect(url_for('home'))

@app.route('/skill-match')
def skill_match_page():
    """Serve the skill matching page"""
    return send_from_directory('Frontend', 'skill-match.html')

@app.route('/all-skills')
def all_skills_page():
    """Serve the all skills page"""
    return send_from_directory('Frontend', 'skill-match.html')

@app.route('/api/match', methods=['POST'])
def match_users():
    """Find matching users based on skills"""
    data = request.json
    wanted_skills = data.get('wanted_skills', [])
    offered_skills = data.get('offered_skills', [])
    availability = data.get('availability', None)
    
    # Create skill vectors
    user_offered_vector = create_skill_vector(offered_skills, all_skills)
    user_wanted_vector = create_skill_vector(wanted_skills, all_skills)
    
    # Find matches
    matches = []
    for user in users:
        # Create vectors for the potential match
        match_offered_vector = create_skill_vector(user['skills_offered'], all_skills)
        match_wanted_vector = create_skill_vector(user['skills_wanted'], all_skills)
        
        # Calculate similarity scores
        # How well the user's wanted skills match the other user's offered skills
        wanted_score = cosine_similarity([user_wanted_vector], [match_offered_vector])[0][0]
        # How well the user's offered skills match the other user's wanted skills
        offered_score = cosine_similarity([user_offered_vector], [match_wanted_vector])[0][0]
        
        # Calculate availability match (if specified)
        availability_score = 1.0
        if availability and 'availability' in user:
            if availability == user['availability']:
                availability_score = 1.0
            else:
                availability_score = 0.5
        
        # Check if user has certifications for better teaching (random for demo)
        certification_score = random.random() * 0.5 + 0.5  # Random score between 0.5 and 1.0
        
        # Calculate overall match score with weighted components
        skill_match_score = (wanted_score + offered_score) / 2
        match_score = skill_match_score * 0.6 + availability_score * 0.2 + certification_score * 0.2
        
        # Check if there's at least a minimal skill match
        if skill_match_score > 0:
            # Add user to matches with detailed scoring
            matches.append({
                'user': user,
                'match_score': round(match_score * 100, 2),
                'skill_match': round(skill_match_score * 100, 2),
                'availability_match': round(availability_score * 100, 2),
                'certification_score': round(certification_score * 100, 2),
                'common_skills': get_common_skills(wanted_skills, user['skills_offered']),
                'additional_skills': get_additional_skills(wanted_skills, user['skills_offered'])
            })
    
    # Sort matches by score
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    
    return jsonify({'matches': matches[:20]})  # Return top 20 matches

def get_common_skills(wanted_skills, offered_skills):
    """Get the common skills between what the user wants and what the match offers"""
    wanted_skill_names = [skill['skill'] for skill in wanted_skills]
    offered_skill_names = [skill['skill'] for skill in offered_skills]
    return list(set(wanted_skill_names) & set(offered_skill_names))

def get_additional_skills(wanted_skills, offered_skills):
    """Get additional skills that the match offers beyond what was requested"""
    wanted_skill_names = [skill['skill'] for skill in wanted_skills]
    offered_skill_names = [skill['skill'] for skill in offered_skills]
    return list(set(offered_skill_names) - set(wanted_skill_names))

@app.route('/api/skills')
def get_skills():
    """Get all available skills"""
    return jsonify({'skills': sorted(list(all_skills))})

@app.route('/api/skills/<category>')
def get_skills_by_category(category):
    """Get skills for a specific category"""
    if category not in skill_categories:
        return jsonify({'error': f'Category "{category}" not found'}), 404
    return jsonify(skill_categories[category])

@app.route('/api/categories')
def get_categories():
    """Get all skill categories"""
    categories = [
        {'id': key, 'name': key.title()} 
        for key in skill_categories.keys()
    ]
    return jsonify(categories)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 