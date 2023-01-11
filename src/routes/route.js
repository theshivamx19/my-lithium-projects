const express = require('express')
const router = express.Router()


const { createUser, userLogin } = require("../controller/usercontrol")
const { createBook, filterBookByQuery, getBookById, updateBookById, deleteBookById } = require("../controller/bookcontrol")
const { createReview, deleteReview } = require("../controller/reviewcontrol")
const { authentication, authorization } = require("../middleware/authware")


router.get("/servertest", (req, res) => res.send("Server is working fine !"))


router.post("/register", createUser)
router.post("/login", userLogin)


router.post("/books",  createBook) //authentication, authorization,
router.get("/books", authentication, filterBookByQuery)
router.get("/books/:bookId", authentication, getBookById)
router.put("/books/:bookId", authentication, authorization, updateBookById)
router.delete("/books/:bookId", authentication, authorization, deleteBookById)


router.post("/books/:bookId/review", createReview)
router.delete("/books/:bookId/review/:reviewId", deleteReview)



module.exports = router