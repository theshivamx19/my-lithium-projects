const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        require: true,
        trim: true,
        ref: "book"
    },
    reviewedBy: {
        type: String,
        require: true,
        trim: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        require: true,
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    review: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('review', reviewSchema)