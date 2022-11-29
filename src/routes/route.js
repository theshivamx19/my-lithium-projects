const express = require('express')
const router = express.Router()

const userCtrl = require("../controller/usercontrol")
const bookCtrl = require("../controller/bookcontrol")
const reviewCtrl = require("../controller/reviewcontrol")
const authWare = require("../middleware/authware")



router.get("/servertest", (req, res) => res.send("Server is working fine !"))


router.post("/register",  userCtrl.createUser)
router.post("/login", userCtrl.userLogin)


router.post("/books",authWare.authentication, authWare.authorization, bookCtrl.createBook)
router.get("/books", authWare.authentication, bookCtrl.filterBookByQuery)
router.get("/books/:bookId", authWare.authentication, bookCtrl.getBookById)
// router.put("/books/:bookId", bookCtrl)
router.delete("/books/:bookId", authWare.authentication, authWare.authorization, bookCtrl.deleteBookById)


router.post("/books/:bookId/review", reviewCtrl.createReview)
// router.put("/books/:bookId/review/:reviewId", reviewCtrl)
// router.delete("/books/:bookId/review/:reviewId", reviewCtrl)


module.exports = router