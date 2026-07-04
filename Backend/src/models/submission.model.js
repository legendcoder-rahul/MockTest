import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testId: {
        type: String,
        required: true
    },
    testTitle: {
        type: String,
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctCount: {
        type: Number,
        required: true
    },
    incorrectCount: {
        type: Number,
        required: true
    },
    unattemptedCount: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    timeSpentSeconds: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const SubmissionModel = mongoose.model('Submission', submissionSchema);

export default SubmissionModel;
