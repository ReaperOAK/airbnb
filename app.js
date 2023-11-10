const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

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
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi! I am root.");
});

const validateListing = (req,res,nest) => {
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

// index route
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

//new route
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs") ;
});

//show route
app.get("/listings/:id", wrapAsync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}));

// create route
app.post("/listings",wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);    
    await newListing.save();
    res.redirect("/listings");
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

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

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});