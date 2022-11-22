const collegeModel = require('../Model/collegeModel')
const internModel = require('../Model/internModel')
const vfy = require('../validation/valid')

const createCollege = async function (req, res) {
    try {
        let data = req.body
        let { name, fullName, logoLink } = data
        if (!name) return res.status(400).send({ status: false, message: "Name required" })
        if (!fullName) return res.status(400).send({ status: false, message: "FullName required" })
        if (!logoLink) return res.status(400).send({ status: false, message: "LogoLink required" })
        if (!vfy.Name(data.Name)) return res.status(400).send({ status: false, message: "Invalid Name" })
        if (!vfy.fullName(data.fullName)) return res.status(400).send({ status: false, message: "Invalid fullName" })
        if (!vfy.logoLink(data.logoLink)) return res.status(400).send({ status: false, message: "Invalid logoLink" })
        let checkDuplicate = await collegeModel.findOne({ name: data.name })
        if (checkDuplicate) return res.status(400).send({ status: false, message: "College name already exist. Please provide another College Name." })
        let createData = await collegeModel.create(data)
        res.status(201).send({ status: true, data: createData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message, message: " server error" })
    }
}
const getDetails = async function (req, res) {
    try {
        const collegeName = req.query.collegeName
        if (vfy.checkObjKeys(req.query)) {
            return res.status(400).send({ status: false, message: 'Data is required to filter' })
        }
        const college = await collegeModel.findOne({ name: collegeName })
        if (!college) {
            return res.status(400).send({ status: false, message: 'College name does not exists' })
        }
        const { name, fullName, logoLink } = college
        const interns = await internModel.find({ collegeId: college._id }).select({ name: 1, email: 1, mobile: 1 })
        return res.status(200).send({ status: true, data: { name, fullName, logoLink, interns } })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createCollege = createCollege
module.exports.getDetails = getDetails