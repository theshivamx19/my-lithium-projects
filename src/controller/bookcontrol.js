const mongoose = require('mongoose')
const bookModel = require("../models/bookmodel")
const userModel = require("../models/usermodel")
const reviewModel = require("../models/reviewmodel")
const { isValidObjectId } = mongoose


//this regex is used for both 10 & 13 number digit and also including hyphen(-) 
let ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

let releasedAtRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/


exports.createBook = async (req, res) => {

    try {
        let data = req.body
        let { title, excerpt, ISBN, category, subcategory, userId, releasedAt } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can not be empty" })
        }


        if (!title || title.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter title" })
        }

        let unique = await userModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })
        if (unique) {
            if (unique.title == title) return res.status(400).send({ status: false, message: "title is already present" })
        }

        if (!ISBN || ISBN.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter ISBN" })
        }
        if (!ISBNRegex.test(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is not valid" })
        }

        if (unique) {
            if (unique.ISBN == ISBN) return res.status(400).send({ status: false, message: "ISBN already exists" })
        }


        if (!excerpt || excerpt.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter excerpt" })
        }
        if (!userId || userId == "") {
            return res.status(400).send({ status: false, message: "Please enter user id" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user id" })
        }
        let findUserId = await userModel.findById(userId)
        if (!findUserId) {
            return res.status(400).send({ status: false, message: "User id do not exist" })
        }



        if (!category || category.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter the category of the book" })
        }
        if (!subcategory || subcategory.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter subcategory" })
        }
        if (!releasedAt || releasedAt.trim() == "") {
            return res.status(400).send({ status: false, message: "Please enter release date of the book" })
        }
        if (!releasedAtRegex.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "Invalid date formate. (YYYY-MM-DD)" })
        }

        let bookData = await bookModel.create(data)

        return res.status(201).send({ status: true, message: 'Success', data: bookData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.filterBookByQuery = async (req, res) => {

    try {
        let filterBy = req.query

        if (filterBy) {
            let queryArr = Object.keys(filterBy)

            if (queryArr.length > 3) return res.status(400).send({ status: false, message: "Queries must be within these: ('userId', 'category', 'subcategory')" })

            for (let i = 0; i < queryArr.length; i++) {

                if (!['userId', 'category', 'subcategory'].includes(queryArr[i])) {

                    return res.status(400).send({ status: false, message: "Queries must be within these: ('userId', 'category', 'subcategory')" })
                }
            }
        }

        let filteredBook = await bookModel.find({ isDeleted: false, ...filterBy }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (Object.keys(filteredBook).length == 0) {
            return res.status(404).send({ status: false, message: "No data found !" })
        }

        let sortedBook = filteredBook.sort((a, b) => a.title.localeCompare(b.title))

        res.status(200).send({ status: true, message: 'Books list', data: sortedBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.getBookById = async (req, res) => {

    try {
        let bookId = req.params.bookId

        let book = await bookModel.findOne({ isDeleted: false, _id: bookId }).lean()


        if (!book) {
            return res.status(404).send({ status: false, message: "No data found !" })
        }

        let review = await reviewModel.find({ isDeleted: false, bookId: bookId }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        book.reviewsData = review

        res.status(200).send({ status: true, message: 'Books list', data: book })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.updateBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please provide a valid BookId" }) }

        let bookExists = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!bookExists) { return res.status(404).send({ status: false, message: "No book exist with this bookId" }) }

        let data = req.body

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please provide data in Body" }) }

        let { title, ISBN, excerpt, releasedAt } = data


        let unique = await bookModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })

        if (unique) {
            if (unique.title == title) { return res.status(400).send({ status: false, message: "Please provide a Unique title" }) }

            if (unique.ISBN == ISBN) { return res.status(400).send({ status: false, message: "Please provide a Unique ISBN" }) }
        }


        let updateBookById = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },
            { $set: { title, ISBN, excerpt, releasedAt } }, { new: true })

        return res.status(200).send({ status: true, message: 'Success', data: updateBookById })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.deleteBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please provide a valid book Id" }) }

        let checkbook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!checkbook) { return res.status(404).send({ status: false, message: "No book exists with this BookId" }) }

        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },
            { $set: { isDeleted: true, reviews: 0 } })

        await reviewModel.updateMany({ isDeleted: false, bookId: bookId }, { $set: { isDeleted: true } })

        return res.status(200).send({ status: true, message: "Successfully Deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}