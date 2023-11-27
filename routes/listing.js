const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};


// index route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Requested Listing does not exist!");
        res.redirect("/listings");
    };
    res.render("./listings/edit.ejs",{listing});
}));

//new route
router.get("/new", (req,res)=>{
    res.render("./listings/new.ejs") ;
});

//show route
router.get("/:id", wrapAsync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Requested Listing does not exist!");
        res.redirect("/listings");
    };
    res.render("./listings/show.ejs",{listing});
}));

// create route
router.post("/",wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);    
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

//Update Route
router.put("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;