import mongoose from 'mongoose'
import Question from './src/models/Question.model.js'
import fs from 'fs';
import dotenv from 'dotenv'
dotenv.config()


const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");

    const rawData = fs.readFileSync('./Question.json', 'utf-8');
    const questions = JSON.parse(rawData);

    await Question.insertMany(questions);
    
    console.log("Data successfully imported into MongoDB!");
    process.exit(); 

  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();