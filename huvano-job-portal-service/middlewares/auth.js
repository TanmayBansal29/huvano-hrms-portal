const jwt = require("jsonwebtoken")

// auth middleware that verifies whether the jwt token is valid or not
exports.auth = async (req, res) => {
    try {
        // Extract the token
        const token = res.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "")

        // Check - 1 If token is missing or not
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token in Missing"
            })
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Token is Invalid"
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}