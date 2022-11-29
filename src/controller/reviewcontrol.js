const mongoose = require('mongoose')
const ReviewModel = require("../models/reviewmodel")
const BookModel = require("../models/bookmodel")

let dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

exports.createReview = async (req, res) => {
    try {

        let bookIDinPath = req.params.bookId

        let valid = mongoose.Types.ObjectId.isValid(bookIDinPath)
        if (valid == false) {
            return res.status(400).send({ status: false, message: "Enter a valid book id" })
        }

        let bookData = await BookModel.findOne({ isDeleted: false, _id: bookIDinPath })

        if (!bookData) return res.status(404).send({ status: false, message: "Book not found" })


        let data = req.body
        let { bookId, reviewedAt, rating } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can not be empty" })
        }
        if (!bookId || bookId == "") {
            return res.status(400).send({ status: false, message: "Please enter bookId" })
        }
        if (!reviewedAt || reviewedAt.trim() == "") 
            return res.status(400).send({ status: false, message: "Please enter reviewedAt " })
        
        if (!reviewedAt.match(dateRegex)) {
            return res.status(400).send({ status: false, message: "Please enter date in YYYY-MM-DD format" })
        }
        if (!rating || rating == "") {
            return res.status(400).send({ status: false, message: "Please give rating" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "Give a rating between 1 to 5" })
        }


        let reviewData = await ReviewModel.create(data)

        await BookModel.updateOne({ isDeleted: false, _id: bookIDinPath }, { $set: { reviews: bookData.reviews + 1 } })

        return res.status(201).send({ status: true, message: 'Success', data: reviewData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}