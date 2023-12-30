const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingControllers = require("../controllers/listing.js");

router
.route("/")
.get(wrapAsync(listingControllers.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.createListing)
    );

router.get("/new", isLoggedIn, listingControllers.newListingForm);

router
.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControllers.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

router.get("/:id/edit",isLoggedIn,wrapAsync(listingControllers.editListing));

module.exports = router;