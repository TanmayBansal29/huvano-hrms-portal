

exports.candidateProfile = async (req, res) => {
    try {
        const user = req.user

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthroized: No user data found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Profile Fetched Successfully",
            user
        })
    } catch (error) {
        console.log("Error while fetching the candidate profile: ", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong fetching the candidate Profile"
        })
    }
}