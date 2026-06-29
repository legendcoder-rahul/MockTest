import Question from '../models/Question.model.js';

export const getquestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json({
            success: true,
            message: "Questions fetched successfully",
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions",
            error: error.message
        });
    }
}

export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Question fetched successfully",
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching question",
            error: error.message
        });
    }
}

export const getQuestionBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        const questions = await Question.find({ subject: { $regex: new RegExp(subject, 'i') } });        
        if (!questions || questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Questions not found for the given subject"
            });
        }

        res.status(200).json({
            success: true,
            message: "Questions fetched successfully",
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions by subject",
            error: error.message
        });
    }
}

export const getChaptersBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        const chapters = await Question.aggregate([
            { $match: { subject: { $regex: new RegExp(subject, 'i') } } },
            { $group: { 
                _id: "$chapter", 
                count: { $sum: 1 },
                difficulties: { $addToSet: "$difficulty" }
            }},
            { $sort: { _id: 1 } }
        ]);

        if (!chapters || chapters.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No chapters found for the given subject"
            });
        }

        const formattedChapters = chapters.map(ch => ({
            name: ch._id,
            questionCount: ch.count,
            difficulties: ch.difficulties
        }));

        res.status(200).json({
            success: true,
            message: "Chapters fetched successfully",
            data: formattedChapters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching chapters",
            error: error.message
        });
    }
}

export const getQuestionsByChapter = async (req, res) => {
    try {
        const { subject, chapter } = req.params;
        const filter = { 
            subject: { $regex: new RegExp(subject, 'i') },
            chapter: { $regex: new RegExp(chapter, 'i') }
        };

        if (req.query.difficulty && req.query.difficulty !== 'All') {
            filter.difficulty = req.query.difficulty;
        }

        const questions = await Question.find(filter);

        if (!questions || questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No questions found for this chapter"
            });
        }

        res.status(200).json({
            success: true,
            message: "Questions fetched successfully",
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching questions by chapter",
            error: error.message
        });
    }
}