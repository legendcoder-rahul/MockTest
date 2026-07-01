import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
    },
    targetExam: {
        type: String,
        required: true,
        enum: ['SSC CGL', 'UPSC CSE', 'Banking (SBI/IBPS)', 'Railway (RRB)']
    }
}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema)

export default UserModel