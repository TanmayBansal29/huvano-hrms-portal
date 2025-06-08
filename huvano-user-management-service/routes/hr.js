const express = require("express")
const { registerEmployees } = require("../controllers/HR")
const { isHR, auth } = require("../middlewares/authMiddleware")
const router = express.Router()


// Route for hr to add/register the employee into database
router.post("/register-employee", auth, isHR, registerEmployees)

module.exports = router 