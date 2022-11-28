const mongoose = require('mongoose')
const BookModel = require('../models/bookmodel')
const UserModel = require("../models/usermodel")


const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
//this regex is used for both 10 & 13 number digit and also including hyphen(-) 

// const reviewsRegex = /^\d{10}$/
let releasedAtRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/


exports.createBook = async (req, res) => {

    try {
        let data = req.body
        let { title, excerpt, ISBN, category, subcategory, userId, releasedAt } = data
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "body can not be empty" })
        }
        if (!title || title == "") {
            return res.status(400).send({ status: false, message: "please enter title" })
        }
        if (!excerpt || excerpt == "") {
            return res.status(400).send({ status: false, message: "please enter excerpt" })
        }
        if (!userId || userId == "") {
            return res.status(400).send({ status: false, message: "please enter userId" })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "invalid userId" })
        }
        let findUserId = await UserModel.findById(userId)
        if (!findUserId) {
            return res.status(400).send({ status: false, message: "userId can not exist" })
        }
        if (!ISBN || ISBN == "") {
            return res.status(400).send({ status: false, message: "please enter ISBN " })
        }
        if (!ISBNRegex.test(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is not valid" })
        }
        if (!category || category == "") {
            return res.status(400).send({ status: false, message: "please enter the category" })
        }
        if (!subcategory || subcategory == "") {
            return res.status(400).send({ status: false, message: "please enter subcategory" })
        }
        if (!releasedAt || releasedAt == "") {
            return res.status(400).send({ status: false, message: "please enter releasedAt date of books" })
        }
        if (!releasedAtRegex.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "invalid date formate" })
        }

        let bookData = await BookModel.create(data)

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

            if (queryArr.length > 3) return res.status(400).send({ status: false, message: "Invalid query detected !" })

            for (let i = 0; i < queryArr.length; i++) {

                if (!['userId', 'category', 'subcategory'].includes(queryArr[i])) {
                    return res.status(400).send({ status: false, message: "Invalid query detected !" })
                }
            }
        }

        let filteredBook = await BookModel.find({ isDeleted: false, ...filterBy }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (Object.keys(filteredBook).length == 0) {
            return res.status(404).send({ status: false, message: "No data matched !" })
        }

        res.status(200).send({ status: true, message: 'Books list', data: filteredBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.getBookById = async (req, res) => {

    try {
        let bookId = req.params.bookId

        let filteredBook = await BookModel.find({ isDeleted: false, ...filterBy }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (Object.keys(filteredBook).length == 0) {
            return res.status(404).send({ status: false, message: "No data matched !" })
        }

        res.status(200).send({ status: true, books: filteredBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}