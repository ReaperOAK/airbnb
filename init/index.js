const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb+srv://wanderlust:wJXJvdVH5e2aFYOx@cluster0.ejae6dq.mongodb.net/?retryWrites=true&w=majority";

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
    data.data = data.data.map((obj) => ({...obj, owner : "658c33e954e20f600c877f4d"}));
    await Listing.insertMany(data.data);
    console.log("data was initialised");
};
initDB();