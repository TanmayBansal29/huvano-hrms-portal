const jwt = require("jsonwebtoken")

// Auth Middleware for verifying the token after employee login into system
exports.auth = async(req, res, next) => {
    try {
        // Extracting the token
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")

        // Checking whether token exists or not
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is Missing"
            })
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            next()
        } catch {
            return res.status(401).json({
                success: false,
                message: "Invalid / Expired Token"
            })
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong validating the token"
        })
    }
}

// Middlewares for validating the roles of employees
exports.isAdmin = async(req, res, next) => {
    if(req.user?.role !== "Admin") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized Access: Only for Admins"
        })
    }
    next()
}

exports.isHR = async (req, res, next) => {
    if(req.user?.role !== "HR") {
        return res.status(403).json({
            success: false,
            message: "Unauthorized Access: Only for HR"
        })
    }
}