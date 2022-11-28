const mongoose = require('mongoose')
const BookModel = require("../models/bookmodel")
const UserModel = require("../models/usermodel")


//this regex is used for both 10 & 13 number digit and also including hyphen(-) 
let ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

let releasedAtRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/


exports.createBook = async (req, res) => {

    try {
        let data = req.body
        let { title, excerpt, ISBN, category, subcategory, userId, releasedAt } = data

        if (data) {
            let arr = Object.keys(data)

            if (arr.length > 7) return res.status(400).send({ status: false, message: "Key names must be within these: ('title', 'excerpt', 'ISBN', 'category', 'subcategory', 'userId', 'releasedAt')" })

            for (let i = 0; i < arr.length; i++) {

                if (!['title', 'excerpt', 'ISBN', 'category', 'subcategory', 'userId', 'releasedAt'].includes(arr[i]))

                    return res.status(400).send({ status: false, message: "Key names must be within these: ('title', 'excerpt', 'ISBN', 'category', 'subcategory', 'userId', 'releasedAt')" })
            }
        }
        

        if (!title || title == "") {
            return res.status(400).send({ status: false, message: "Please enter title" })
        }
        if (!excerpt || excerpt == "") {
            return res.status(400).send({ status: false, message: "Please enter excerpt" })
        }
        if (!userId || userId == "") {
            return res.status(400).send({ status: false, message: "Please enter user id" })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user id" })
        }
        let findUserId = await UserModel.findById(userId)
        if (!findUserId) {
            return res.status(400).send({ status: false, message: "User id do not exist" })
        }
        if (!ISBN || ISBN == "") {
            return res.status(400).send({ status: false, message: "Please enter ISBN" })
        }
        if (!ISBNRegex.test(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is not valid" })
        }
        if (!category || category == "") {
            return res.status(400).send({ status: false, message: "Please enter the category of the book" })
        }
        if (!subcategory || subcategory == "") {
            return res.status(400).send({ status: false, message: "Please enter subcategory" })
        }
        if (!releasedAt || releasedAt == "") {
            return res.status(400).send({ status: false, message: "Please enter release date of the book" })
        }
        if (!releasedAtRegex.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "Invalid date formate. (YYYY-MM-DD)" })
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

            if (queryArr.length > 3) return res.status(400).send({ status: false, message: "Queries must be within these: ('userId', 'category', 'subcategory')" })

            for (let i = 0; i < queryArr.length; i++) {

                if (!['userId', 'category', 'subcategory'].includes(queryArr[i])) {
                    
                    return res.status(400).send({ status: false, message: "Queries must be within these: ('userId', 'category', 'subcategory')" })
                }
            }
        }

        let filteredBook = await BookModel.find({ isDeleted: false, ...filterBy }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

        if (Object.keys(filteredBook).length == 0) {
            return res.status(404).send({ status: false, message: "No data found !" })
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

        let filteredBook = await BookModel.findOne({ isDeleted: false, _id: bookId })

        if (Object.keys(filteredBook).length == 0) {
            return res.status(404).send({ status: false, message: "No data found !" })
        }

        res.status(200).send({ status: true, books: filteredBook })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}