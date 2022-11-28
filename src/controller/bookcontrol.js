const mongoose = require('mongoose')
const BookModel = require('../models/bookmodel')
const UserModel = require("../models/usermodel")


exports.createBook = async (req, res) => {

    try {
        let data = req.body
        let userId = data.userId

        let validId = mongoose.isValidObjectId(userId)
        if (validId == false) {
            return res.status(400).send({ status: false, message: "Invalid user id !" })
        }

        let Id = await UserModel.findById(userId)

        if (!Id) return res.status(404).send({ status: false, message: "User Id not found" })

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