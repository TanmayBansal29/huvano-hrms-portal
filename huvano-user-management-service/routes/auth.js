const express = require("express")
const { login, logout } = require("../controllers/Auth")
const router = express.Router()

// Created the routes for login and logout
router.post("/login", login)
router.post("/logout", logout)

module.exports = router
