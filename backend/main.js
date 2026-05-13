const express = require('express');
const app = express();
const cors = require('cors')
const router = require("./route/rout");
const mongoose = require('mongoose');
require('dotenv').config();



const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!mongoUri) {
    console.error("MONGO_URI is not defined in your .env file!");
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use("/api", router);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 