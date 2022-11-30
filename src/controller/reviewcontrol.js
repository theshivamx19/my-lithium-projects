const mongoose = require('mongoose')
const ReviewModel = require("../models/reviewmodel")
const BookModel = require("../models/bookmodel")

exports.createReview = async (req, res) => {
    try {

        let bookId = req.path.bookId

        let valid = mongoose.isValidObjectId(bookId)
        if (valid == false) {
            return res.status(400).send({ status: false, message: "Enter a valid book id" })
        }

        let bookData = await BookModel.findById(bookId)

        await BookModel.updateOne({isDeleted: false, _id: bookId}, {$set: {reviews: bookData.reviews++}})


        let data = req.body

        let reviewData = await ReviewModel.create(data)

        return res.status(201).send({ status: true, message: 'Success', data: reviewData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}