import app from "./src/app.js";
import dotenv from 'dotenv'
dotenv.config()
import connectToDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {

    connectToDB()
    console.log(`server is running on ${PORT}`);
})