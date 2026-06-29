import mongoose from 'mongoose';

// Schema define karein (Data ka structure)
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], 
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  
  // Categorization (Taki baad mein search/filter aasan ho)
  subject: { type: String, required: true },
  section: { type: String, required: true },
  chapter: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  
  createdAt: { type: Date, default: Date.now }
});


questionSchema.index({ subject: 1, section: 1, chapter: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;