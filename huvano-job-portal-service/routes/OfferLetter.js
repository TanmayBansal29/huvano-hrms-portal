const express = require("express")
const { auth, isHR } = require("../middlewares/auth")
const { createOfferLetter, fetchingOfferLetters, getParticularOffer, updateOfferLetter, sendOfferLetter, revokeOffer } = require("../controllers/OfferLetterHR")
const router = express.Router()

// Route for creating the offer letter
router.post("/create/:applicationId", auth, isHR, createOfferLetter)

// Route for getting all the offer letters
router.get("/fetchOffers", auth, isHR, fetchingOfferLetters)

// Route for getting a aprticular offer letter
router.get("/letter/:offerLetterId", auth, isHR, getParticularOffer)

// Route for updating the offer letter
router.patch("/update/:offerLetterId", auth, isHR, updateOfferLetter)

// Route for sending the offer letter
router.post("/sendOffer/:offerLetterId", auth, isHR, sendOfferLetter)

// Route for revoking the offer
router.post("/revoke/:offerLetterId", auth, isHR, revokeOffer)

module.exports = router