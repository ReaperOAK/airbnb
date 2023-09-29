const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl ="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongoUrl);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data was initialised");
};
initDB();