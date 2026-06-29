import mongoose from 'mongoose'

const connectToDB = async () => {
   try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected successfully")
} catch (error) {
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error(error);
}
}

export default connectToDB