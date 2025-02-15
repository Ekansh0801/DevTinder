const mongoose = require("mongoose");

const connectDB = async() => {
        await mongoose.connect('mongodb+srv://ekanshaggarwal11103:d12EcD2JZcxfGcdE@cluster0.epv26.mongodb.net/devTinder')
}

module.exports = connectDB;