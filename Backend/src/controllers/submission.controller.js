import Submission from '../models/submission.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Save a test submission result
export const saveSubmission = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            testId,
            testTitle,
            examType,
            totalQuestions,
            correctCount,
            incorrectCount,
            unattemptedCount,
            score,
            maxScore,
            accuracy,
            timeSpentSeconds
        } = req.body;

        if (!testId || !testTitle || !examType) {
            return res.status(400).json({
                success: false,
                message: "testId, testTitle, and examType are required."
            });
        }

        const submission = await Submission.create({
            userId,
            testId,
            testTitle,
            examType,
            totalQuestions,
            correctCount,
            incorrectCount,
            unattemptedCount,
            score,
            maxScore,
            accuracy,
            timeSpentSeconds
        });

        res.status(201).json({
            success: true,
            message: "Submission saved successfully",
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error saving submission",
            error: error.message
        });
    }
};

// Retrieve dynamic user statistics
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch User to ensure it exists and get details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 1. Calculate testsTaken, avgScore, avgAccuracy using aggregation
        const userStats = await Submission.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$userId",
                    testsTaken: { $sum: 1 },
                    avgScore: { $avg: { $multiply: [ { $divide: ["$score", "$maxScore"] }, 100 ] } },
                    avgAccuracy: { $avg: "$accuracy" }
                }
            }
        ]);

        const testsTaken = userStats[0]?.testsTaken || 0;
        const avgScore = userStats[0]?.avgScore !== undefined ? Math.round(userStats[0].avgScore * 10) / 10 : 0;
        const accuracy = userStats[0]?.avgAccuracy !== undefined ? Math.round(userStats[0].avgAccuracy * 10) / 10 : 0;

        // 2. Calculate Tests Taken in the last week for trend
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const testsThisWeek = await Submission.countDocuments({
            userId,
            createdAt: { $gte: oneWeekAgo }
        });

        // 3. Calculate Global Rank relative to other users based on avg score percentage
        const rankings = await Submission.aggregate([
            {
                $group: {
                    _id: "$userId",
                    avgScore: { $avg: { $multiply: [ { $divide: ["$score", "$maxScore"] }, 100 ] } }
                }
            },
            { $sort: { avgScore: -1 } }
        ]);

        const userRankIndex = rankings.findIndex(r => r._id.toString() === userId.toString());
        const globalRank = userRankIndex !== -1 ? userRankIndex + 1 : rankings.length + 1;

        // 4. Retrieve recent submissions for activity feed
        const recentSubmissions = await Submission.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentActivity = recentSubmissions.map(sub => {
            const diffTime = Math.abs(new Date() - sub.createdAt);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            let dateStr = "Just now";
            
            if (diffDays === 1) {
                dateStr = "Yesterday";
            } else if (diffDays > 1) {
                dateStr = `${diffDays} days ago`;
            } else {
                const diffHrs = Math.floor(diffTime / (1000 * 60 * 60));
                if (diffHrs >= 1) {
                    dateStr = `${diffHrs} hours ago`;
                } else {
                    const diffMins = Math.floor(diffTime / (1000 * 60));
                    if (diffMins >= 1) {
                        dateStr = `${diffMins} minutes ago`;
                    }
                }
            }

            return {
                id: sub._id,
                type: "test",
                title: sub.testTitle,
                date: dateStr,
                score: `${Math.round(sub.accuracy)}%`,
                status: "completed"
            };
        });

        // 5. Subject accuracy mapping
        const subjectStats = await Submission.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$testId", // extract subject from prefix e.g. "quant-1" -> "quant"
                    avgAccuracy: { $avg: "$accuracy" }
                }
            }
        ]);

        // Default subject accuracy
        const subjectAccuracy = {
            quant: 0,
            reasoning: 0,
            english: 0,
            general: 0
        };

        // Populate subject accuracy mapping based on testId prefixes
        subjectStats.forEach(stat => {
            const testIdLower = stat._id.toLowerCase();
            if (testIdLower.startsWith("quant")) {
                subjectAccuracy.quant = Math.round(stat.avgAccuracy * 10) / 10;
            } else if (testIdLower.startsWith("reasoning")) {
                subjectAccuracy.reasoning = Math.round(stat.avgAccuracy * 10) / 10;
            } else if (testIdLower.startsWith("english")) {
                subjectAccuracy.english = Math.round(stat.avgAccuracy * 10) / 10;
            } else if (testIdLower.startsWith("general")) {
                subjectAccuracy.general = Math.round(stat.avgAccuracy * 10) / 10;
            }
        });

        res.status(200).json({
            success: true,
            user: {
                username: user.username,
                targetExam: user.targetExam,
                daysLeft: 47, // target date math can be added if desired
                overallProgress: testsTaken > 0 ? Math.min(100, Math.round(testsTaken * 2.5)) : 0
            },
            stats: {
                testsTaken,
                avgScore,
                accuracy,
                globalRank,
                testsThisWeek
            },
            subjectAccuracy,
            recentActivity
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error calculating user statistics",
            error: error.message
        });
    }
};
