const internModel = require('../Model/internModel')
const collegeModel = require('../Model/collegeModel')
const vfy = require('../validation/valid')

const createIntern = async function (req, res) {
    try {
        const data = req.body
        let { name, email, mobile, collegeName, collegeId } = data
        if (!name) {
            return res.status(400).send({ status: false, message: 'Name is required' })
        }
        if (!vfy.nameReg(name)) {
            return res.status(400).send({ status: false, message: 'Numbers & Special characters are not allowed in Name' })
        }
        if (!email) {
            return res.status(400).send({ status: false, message: 'Email Id is required' })
        }
        if (!vfy.emailReg(email)) {
            return res.status(400).send({ status: false, message: 'Please enter a valid email id' })
        }
        if (!mobile) {
            return res.status(400).send({ status: false, message: 'Mobile no. is required' })
        }
        if (!vfy.mobileValid(mobile)) {
            return res.status(400).send({ status: false, message: 'Enter valid mobile no.' })
        }
        const checkEmail = await internModel.findOne({ email: email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: 'Email Id already exists' })
        }
        const checkMobile = await internModel.findOne({ mobile: mobile })
        if (checkMobile) {
            return res.status(400).send({ status: false, message: 'Mobile no. is already exists' })
        }
        const college = await collegeModel.findOne({ name: collegeName })
        if (!college) {
            return res.status(404).send({ status: false, message: 'This college does not exists' })
        }
        collegeId = college._id
        let finalData = {name, email, mobile, collegeId}
        const interns = await internModel.create(finalData)
        return res.status(201).send({ status: true, data: interns })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.createIntern = createIntern