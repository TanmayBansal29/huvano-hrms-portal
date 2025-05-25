const express = require("express")
const { auth, isCandidate } = require("../middlewares/auth")
const { getOfferLetters, getRevokedOffers, fetchParticularOffer, statusUpdate } = require("../controllers/OfferLetterCandidate")
const router = express.Router()


// Route for fetching all the offer letters
router.get("/fetch/offerLetters", auth, isCandidate, getOfferLetters)

// Route for fetching revoked/declined offer letters
router.get("/fetch/revoked/offerLetters", auth, isCandidate, getRevokedOffers)

// Route for fetching a particular offer letter
router.get("/fetch/offerLetter/:offerLetterId", auth, isCandidate, fetchParticularOffer)

// Route for changing the status - Accepting/Declining
router.patch("/updateStatus/:offerLetterId", auth, isCandidate, statusUpdate)

module.exports = router