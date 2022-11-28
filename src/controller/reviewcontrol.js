const ReviewModel = require("../models/reviewmodel")
const BookModel = require("../models/bookmodel")

exports.createReview = async (req, res) => {
    try {

        let data = req.body

        let reviewData = await ReviewModel.create(data)

        return res.status(201).send({ status: true, message: 'Success', data: reviewData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}