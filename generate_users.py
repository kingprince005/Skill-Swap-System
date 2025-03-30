import json
import random
from datetime import datetime, timedelta

# List of sample names
first_names = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
               'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen']
last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
              'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']

# Skill categories and skills (using the same as defined in app.py)
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

# Flatten skills list
all_skills = [skill for skills in skill_categories.values() for skill in skills]

# Experience levels and availability times
experience_levels = ['Beginner', 'Intermediate', 'Advanced']
availability_times = [
    'weekday_morning', 'weekday_afternoon', 'weekday_evening',
    'weekend_morning', 'weekend_afternoon', 'weekend_evening'
]

def generate_user(user_id):
    """Generate a random user with skills and availability"""
    # Basic user info
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    join_date = datetime.now() - timedelta(days=random.randint(1, 730))  # Up to 2 years ago
    
    # Generate random skills
    num_offered_skills = random.randint(2, 6)
    num_wanted_skills = random.randint(2, 6)
    
    # Ensure offered and wanted skills don't overlap
    available_skills = all_skills.copy()
    random.shuffle(available_skills)
    
    offered_skills = []
    for skill in available_skills[:num_offered_skills]:
        skill_obj = {
            'skill': skill,
            'experience': random.choice(experience_levels),
            'certification': random.random() < 0.3  # 30% chance of having certification
        }
        offered_skills.append(skill_obj)
    
    wanted_skills = []
    for skill in available_skills[num_offered_skills:num_offered_skills + num_wanted_skills]:
        skill_obj = {
            'skill': skill,
            'experience': 'Beginner'  # People typically want to learn from beginner level
        }
        wanted_skills.append(skill_obj)
    
    # Generate user availability
    num_available_times = random.randint(2, 4)
    availability = random.sample(availability_times, num_available_times)
    
    # Generate random ratings and stats
    rating = round(random.uniform(3.5, 5.0), 1)
    completed_swaps = random.randint(0, 50)
    
    return {
        'id': user_id,
        'name': f'{first_name} {last_name}',
        'email': f'{first_name.lower()}.{last_name.lower()}@example.com',
        'bio': f'Hi, I\'m {first_name}! I love learning and teaching.',
        'skills_offered': offered_skills,
        'skills_wanted': wanted_skills,
        'availability': availability,
        'rating': rating,
        'completed_swaps': completed_swaps,
        'member_since': join_date.strftime('%Y-%m-%d'),
        'teaching_style': random.choice(['Visual', 'Auditory', 'Kinesthetic', 'Mixed']),
        'preferred_learning_method': random.choice(['One-on-one', 'Group', 'Project-based', 'Self-paced'])
    }

def generate_users_dataset(num_users=1000):
    """Generate a dataset of users"""
    users = [generate_user(i+1) for i in range(num_users)]
    
    # Save to JSON file
    with open('users.json', 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2)
    
    print(f'Generated {num_users} users and saved to users.json')

if __name__ == '__main__':
    generate_users_dataset(1000) 