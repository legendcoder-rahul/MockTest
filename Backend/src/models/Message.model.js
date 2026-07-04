import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    sender: {
        type: String,
        enum: ['user', 'bot'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    conceptCard: {
        title: { type: String },
        content: { type: String }
    },
    actionChips: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;
