const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true,
        unique: true,
        trim :true
    },
    excerpt: {
        type: String,
        require: true,
        trim :true
    },
    userId: {
        type: ObjectId,
        require: true,
        trim :true,
        ref: "user"
    },
    ISBN: {
        type: String,
        require: true,
        unique: true,
        trim :true
    },
    category: {
        type: String,
        require: true,
        trim :true
    },
    subcategory: {
        type: String,
        require: true,
        trim :true
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    bookCover: {
        type: String
    },
    releasedAt: {
        type: Date,
        require: true,
        trim :true
    }

}, { timestamps: true })

module.exports = mongoose.model('book', bookSchema)