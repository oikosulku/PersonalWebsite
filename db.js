/*
/* SET UP ADMIN USER FOR YOUR LOCAL DATABASE
**/

const User = require('./models/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/oikkisdb')
.then(()=> {
    console.log("MONGO CONNECTION OPEN");
})
.catch(err => {
    console.log("OH NO MONGO ERROR!!!")
    console.log(err)
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const addAdmin = async () => {
    // CHANGE THIS USER ID 
    const id = "<YOUR USER ID>";
    await User.findByIdAndUpdate(id, {role: "Admin"});
     //await User.save();
}

addAdmin().then(() => {
    mongoose.connection.close();
})