const express = require('express');
const app = express();
const cors = require('cors')
const router = require("./route/rout");
const mongoose = require('mongoose');
require('dotenv').config();



const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!mongoUri) {
    console.warn("MONGO_URI is not defined in your .env file! Running without MongoDB connection.");
} else {
    mongoose.connect(mongoUri)
        .then(() => {
            console.log("MongoDB Connected Successfully");
        })
        .catch((error) => {
            console.error("MongoDB Connection Error Details:");
            console.error(error);
            console.warn("Continuing server execution without MongoDB connection.");
        });
}


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use("/api", router);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 