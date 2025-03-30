from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)

db = SQLAlchemy(app)

def generate_token(user_id):
    token = jwt.encode(
        {'user_id': user_id, 'exp': datetime.utcnow() + timedelta(days=1)},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return token

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    bio = db.Column(db.Text)
    rating = db.Column(db.Float, default=0.0)
    completed_sessions = db.Column(db.Integer, default=0)
    skills = db.relationship('Skill', backref='user', lazy=True)
    experience = db.relationship('Experience', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401

        # Verify password
        if not user.check_password(password):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Generate token
        token = generate_token(user.id)

        # Prepare user data
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'bio': user.bio,
            'skills': [{'name': skill.name} for skill in user.skills],
            'experience': [{
                'position': exp.position,
                'company': exp.company,
                'duration': exp.duration,
                'description': exp.description
            } for exp in user.experience],
            'rating': user.rating,
            'completedSessions': user.completed_sessions
        }

        return jsonify({
            'token': token,
            'user': user_data,
            'message': 'Login successful'
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'An error occurred during login'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 