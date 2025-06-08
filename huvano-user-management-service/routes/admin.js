const express = require("express")
const { registeringCore } = require("../controllers/Admin")
const router = express.Router()


// Route for admins to register the core team and HRs
router.post("/register-core", registeringCore)

module.exports = router