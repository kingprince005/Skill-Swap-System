const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Set larger document size limit for MongoDB
mongoose.set('bufferCommands', false);

// Skill Schema
const SkillSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    experience: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    }
});

// User Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    location: {
        type: String,
        trim: true
    },
    skills: {
        teach: [String],
        learn: [String]
    },
    profileImage: {
        type: String,
        maxlength: 5000000 // 5MB maximum size for base64 image
    },
    availability: [String],
    experience: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    sessions: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add error handling middleware for User model
UserSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 16819) {
        next(new Error('Document exceeds size limit. Profile image too large.'));
    } else if (error.name === 'ValidationError') {
        let errorMessage = 'Validation Error: ';
        for (let field in error.errors) {
            errorMessage += `${field}: ${error.errors[field].message}, `;
        }
        next(new Error(errorMessage));
    } else {
        next(error);
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 