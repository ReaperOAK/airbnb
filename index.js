const express = require("express");
const app =express();
const mongoose = require("mongoose");

const mongoUrl ="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongoUrl);
};

app.get("/",(req,res)=>{
    res.send("Hi! I am root.");
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});