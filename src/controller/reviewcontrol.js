const mongoose = require('mongoose')
const reviewModel = require("../models/reviewmodel")
const bookModel = require("../models/bookmodel")

let dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

exports.createReview = async (req, res) => {
    try {

        let bookIDinPath = req.params.bookId

        let valid = mongoose.Types.ObjectId.isValid(bookIDinPath)
        if (valid == false) {
            return res.status(400).send({ status: false, message: "Enter a valid book id" })
        }

        let bookData = await bookModel.findOne({ isDeleted: false, _id: bookIDinPath })

        if (!bookData) return res.status(404).send({ status: false, message: "Book not found" })


        let bodyData = req.body
        let { bookId, reviewedAt, rating } = bodyData

        if (bookIDinPath != bookId) {
            return res.status(400).send({ status: false, message: "Book id must be same inside both path & body" })
        }
        if (Object.keys(bodyData).length == 0) {
            return res.status(400).send({ status: false, message: "Body can not be empty" })
        }
        if (!bookId || bookId == "") {
            return res.status(400).send({ status: false, message: "Please enter bookId" })
        }
        if (!reviewedAt || reviewedAt.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter reviewedAt " })
        }
        if (!reviewedAt.match(dateRegex)) {
            return res.status(400).send({ status: false, message: "Please enter date in YYYY-MM-DD format" })
        }
        if (!rating || rating == "") {
            return res.status(400).send({ status: false, message: "Please give rating" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "Give a rating between 1 to 5" })
        }

        let review = await reviewModel.create(bodyData)

        let updatedBook = await bookModel.findOneAndUpdate({ isDeleted: false, _id: bookIDinPath }, { $inc: { reviews: 1 } }).lean()

        updatedBook.reviewsData = review

        return res.status(201).send({ status: true, message: 'Success', data: updatedBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.updateReview = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        let data = req.body

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Pls provide a valid BookId" })
        }
        let checkbook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!checkbook) {
            return res.status(404).send({ status: false, message: "No book exists with this Book Id" })
        }


        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Pls provide a valid Review Id" })
        }
        let checkReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkReview) {
            return res.status(404).send({ status: false, message: "No review exists with this Review Id" })
        }

        if (bookId != checkReview.bookId) {
            return res.status(400).send({ status: false, message: "No review exists for the given bookId and ReviewId" })
        }


        if (data.rating < 1 || data.rating > 5) {
            return res.status(400).send({ status: false, message: "Give a rating between 1 to 5" })
        }

        let updateReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false },
            { $set: data }, { new: true })

        checkbook.reviewsData = updateReview

        return res.status(200).send({ status: false, message: "Success", data: checkbook })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


exports.deleteReview = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Pls provide a valid BookId" })
        }
        let checkbook = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!checkbook) {
            return res.status(404).send({ status: false, message: "No book exists with this Book Id" })
        }


        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Pls provide a valid Review Id" })
        }
        let checkReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkReview) {
            return res.status(404).send({ status: false, message: "No review exists with this Review Id" })
        }

        if (bookId != checkReview.bookId) {
            return res.status(400).send({ status: false, message: "No review exists for the given bookId and ReviewId" })
        }


        await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: false } })
        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })

        return res.status(200).send({ status: false, message: "Success", data: "Review deleted successfully !" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}