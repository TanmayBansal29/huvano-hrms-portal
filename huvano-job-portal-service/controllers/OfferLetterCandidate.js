const OfferLetter = require("../models/OfferLetter.model")


// Controller to fetch all the offer letters
exports.getOfferLetters = async (req, res) => {
    try {
        const user = req.user
        if(!user || user.role !== "Candidate") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized Access: Only candidates can access"
            })
        }

        const offerLetters = await OfferLetter.find({candidateId: user._id, status: "Sent"}).populate("jobId", "title").populate("issuedBy", "firstname email")
        if(offerLetters === 0) {
            return res.status(404).json({
                success: false,
                message: "No Offer Letter Found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Offer Letters fetched successfully",
            data: offerLetters
        })

    } catch (error) {
        console.log("Error while fetching the offer letters: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the offer letters. Please try again"
        })
    }
}

// Controllers to fetch the revoked or rejected offers
exports.getRevokedOffers = async (req, res) => {
    try {
        const user = req.user
        if(!user || user.role !== "Candidate") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access: Only candidates are allowed"
            })
        }

        const revokedOffers = await OfferLetter.find({candidateId: user._id, status: "Revoked"}).populate("jobId", "title").populate("issuedBy", "firstName email")
        const declinedOffers = await OfferLetter.find({candidateId: user._id, status: "Declined"}).populate("jobId", "title").populate("issuedBy", "firstName email")

        if(revokedOffers.length === 0 || declinedOffers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Revoked or Declined Offers Found'
            })
        }

        return res.status(200).json({
            success: true,
            message: "Revoked or Declined Offers Fetched Successfully",
            data: {
                dataRevoked: revokedOffers,
                dataDeclined: declinedOffers
            }
        })

    } catch (error) {
        console.log("Error while fetching the revoked/declined offers", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the revoked offers"
        })
    }
}

// Controller for fetching a particular offer letter
exports.fetchParticularOffer = async (req, res) => {
    try{
        const user = req.user
        if(!user || user.role !== "Candidate") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized  Access: Only Candidates can access it"
            })
        }

        const offerLetterId = req.params.offerLetterId
        const offer = await OfferLetter.findById(offerLetterId)
            .populate({
                path: "candidateId",
                select: "firstName lastName emailAddress"
            })
            .populate({
                path: "jobId",
                select: "title"
            })
            .populate({
                path: "issuedBy",
                select: "firstName email"
            })

        if(!offer) {
            return res.status(404).json({
                success: false,
                message: "Offer Letter not found for candidate"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Offer Letter Fetched Successfully",
            status: offer.status,
            data: offer
        })

    } catch (error) {
        console.log("Error while fetching the particular offer letter")
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the particular offer"
        })
    }
}

// Controller for Accepting/Declining the offer letter
exports.statusUpdate = async(req, res) => {
    try {
        const user = req.user
        if(!user || user.role !== "Candidate"){
            return res.status(403).json({
                success: false,
                message: "Unauthorized access: Only Candidates allowed to change the status"
            })
        }

        const offerLetterId = req.params.offerLetterId
        const offer = await OfferLetter.findById(offerLetterId)

        if(!offer) {
            return res.status(404).json({
                success: false,
                message: "No Offer Letter Found"
            })
        }

        const {status} = req.body
        const allowedStatus = ["Accepted", "Declined"]

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid option"
            })
        }

        if(offer.status === "Revoked" || offer.status === "Declined") {
            return res.status(400).json({
                success: false,
                message: "Status cannot be changed. Already revoked or declined"
            })
        } 

        offer.status = status
        await offer.save()

        return res.status(200).json({
            success: true,
            message: `Offer Letter: ${offer.status}`
        })

    } catch (error) {
        console.log("Error while changing the status of offer letter: ", error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong changing the status. Please try again"
        })
    }
}