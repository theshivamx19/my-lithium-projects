const mongoose = require('mongoose')
const BookModel = require('../models/bookmodel')
const UserModel = require("../models/usermodel")


const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/  
                //this regex is used for both 10 & 13 number digit and also including hyphen(-) 

const reviewsRegex = /^\d{10}$/
let releasedAtRegex = /^\d{4}-\d{2}-\d{2}$/


exports.createBook = async (req, res) => {

    try {
        let data = req.body
        let {title, excerpt, ISBN, category ,subcategory, reviews, userId ,releasedAt} = data
        if(Object.keys(data).length === 0){
            return res.status(400).send({status : false, msg : "body can not be empty"})
        }
        if(!title || title == ""){
            return res.status(400).send({status : false , msg : "please enter title"})
        }
        if(!excerpt || excerpt == ""){
            return res.status(400).send({status : false , msg : "please enter excerpt"})
        }
        if(!userId || userId == ""){
            return res.status(400).send({status : false , msg : "please enter userId"})
        }
        if(!mongoose.isValidObjectId(userId)){
            return res.status(400).send({status : false , msg : "invalid userId"})
        }
        let findUserId = await UserModel.findById(userId)
        if(!findUserId){
            return res.status(400).send({status : false , msg : "userId can not exist"})
        }
        if(!ISBN || ISBN == ""){
            return res.status(400).send({status : false , msg : "please enter ISBN "})
        }
        if(!ISBNRegex.test(ISBN)){
            return res.status(400).send({status : false , msg : "ISBN is not valid"})
        }
        if(!category || category == ""){
            return res.status(400).send({status : false , msg : "please enter the category"})
        }
        if(!subcategory || subcategory == ""){
            return res.status(400).send({status : false , msg : "please enter subcategory"})
        }
        if(!releasedAt){
            return res.status(400).send({status : false , msg : "please enter releasedAt date of books"})
        }
        if(!releasedAtRegex.test(releasedAt)){
            return res.status(400).send({status :  false , msg : "invalid date formate"})
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