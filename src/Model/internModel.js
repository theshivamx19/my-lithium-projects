const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        valid: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        valid: true,
        unique: true,
        trime: true
    },
    collegeId: {
        type: ObjectId,
        ref: 'College',
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Intern', internSchema)