const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path =require("path");
const methodOverride=require("method-override");

const mongoUrl ="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongoUrl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
    res.send("Hi! I am root.");
});
// index route
app.get("/listings", async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
});

//new route
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs") ;
});

//show route
app.get("/listings/:id", async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

// create route
app.post("/listings",async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Update Route
app.put("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "my new Villa",
//         description : "by the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfful testing");
// });

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});