const express = require("express")
const { registeringCore } = require("../controllers/Admin")
const { isAdmin, auth } = require("../middlewares/authMiddleware")
const router = express.Router()


// Route for admins to register the core team and HRs
router.post("/register-core", auth, isAdmin, registeringCore)

module.exports = router