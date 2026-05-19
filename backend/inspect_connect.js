const mongoose = require('mongoose');
const originalConnect = mongoose.connect;
mongoose.connect = function (uri, options) {
    console.log("Mongoose Connect Called with:");
    console.log("URI:", uri.replace(/:([^@]+)@/, ":****@"));
    console.log("Options:", JSON.stringify(options, null, 2));
    return originalConnect.apply(this, arguments);
};

require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
console.log("Process ENV MONGO_URI:", mongoUri.replace(/:([^@]+)@/, ":****@"));

mongoose.connect(mongoUri)
    .then(() => console.log("Connected"))
    .catch(err => {
        console.error("Connection Error:", err.message);
        process.exit(1);
    });
