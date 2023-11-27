const express = require("express");
const router = express.Router({mergeParams : true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

//review
//post review route
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(req.params.id);
    if(!listing){
        req.flash("error","Requested Listing does not exist!");
        res.redirect("/listings");
    };
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);

}));

//delete review route
router.delete(
    "/:reviewId", wrapAsync(async(req,res)=>{
        let {id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");
        res.redirect(`/listings/${id}`);
    })
)
;

module.exports = router;