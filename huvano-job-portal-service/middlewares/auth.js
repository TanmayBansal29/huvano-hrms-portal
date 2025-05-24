const jwt = require("jsonwebtoken")

// auth middleware that verifies whether the jwt token is valid or not
exports.auth = async (req, res, next) => {
    try {
        // Extract the token
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")

        // Check - 1 If token is missing or not
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token in Missing"
            })
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid or Expired"
            })
        }
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
    }
}

// Middleware to check whether the login data is of HR or candidate as per the route
exports.isHR = (req, res, next) => {
    if(req.user?.role != "HR"){
        return res.status(403).json({
            success: false,
            message: "Access Denied: HR Only"
        })
    }
    next();
}

exports.isCandidate = (req, res, next) => {
    if(req.user?.role != "Candidate"){
        return res.status(403).json({
            success: false,
            message: "Access Denied: Candidate Only"
        })
    }
    next();
}