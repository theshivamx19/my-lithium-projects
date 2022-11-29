const mongoose = require('mongoose')
const ReviewModel = require("../models/reviewmodel")
const BookModel = require("../models/bookmodel")

exports.createReview = async (req, res) => {
    try {

        let bookIDinPath = req.params.bookId
        
        let valid = mongoose.Types.ObjectId.isValid(bookIDinPath)
        if (valid == false) {
            return res.status(400).send({ status: false, message: "Enter a valid book id" })
        }

        let bookData = await BookModel.findOne({isDeleted: false, _id: bookIDinPath})

        if (!bookData) return res.status(404).send({ status: false, message: "Book not found" })
        
        if (!bookIDinPath || bookIDinPath.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter bookId" })
        }
        if (!userId || userId == "") {
            return res.status(400).send({ status: false, message: "Please enter user id" })
        }

        let data = req.body
        
        let reviewData = await ReviewModel.create(data)
        
        await BookModel.updateOne({isDeleted: false, _id: bookIDinPath}, {$set: {reviews: bookData.reviews+1}})

        return res.status(201).send({ status: true, message: 'Success', data: reviewData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}