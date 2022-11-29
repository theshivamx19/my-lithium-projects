const express = require('express')
const router = express.Router()

const UserCtrl = require("../controller/usercontrol")
const BookCtrl = require("../controller/bookcontrol")
const ReviewCtrl = require("../controller/reviewcontrol")
const MiddleWare = require("../middleware/validware")


router.get("/servertest", (req, res) => res.send("Server is working fine !"))


router.post("/register", UserCtrl.createUser)
router.post("/login", UserCtrl.userLogin)


router.post("/books", BookCtrl.createBook)
router.get("/books", BookCtrl.filterBookByQuery)
router.get("/books/:bookId", BookCtrl.getBookById)
// router.put("/books/:bookId", BookCtrl)
// router.delete("/books/:bookId", BookCtrl)


router.post("/books/:bookId/review", ReviewCtrl.createReview)
// router.put("/books/:bookId/review/:reviewId", ReviewCtrl)
// router.delete("/books/:bookId/review/:reviewId", ReviewCtrl)


module.exports = router