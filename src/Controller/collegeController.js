const collegeModel = require('../Model/collegeModel')
const validation = require('../validation/validation')

const createCollegeData = async function (req, res) {
    try {
        let data = req.body
        let { name, fullName, logoLink } = data

        if (!name) return res.status(400).send({ status: false, message: "name required" })
        if (!fullName) return res.status(400).send({ status: false, message: "fullName required" })
        if (!logoLink) return res.status(400).send({ status: false, message: "logoLink required" })

        if (!validation.Name(data.Name)) return res.status(400).send({ status: false, message: "invalid Name" })
        if (!validation.fullName(data.fullName)) return res.status(400).send({ status: false, message: "invalid fullName" })
        if (!validation.logoLink(data.logoLink)) return res.status(400).send({ status: false, message: "invalid logoLink" })

        let checkDuplicate = await collegeModel.findOne({ name: data.name })
        if (checkDuplicate) { return res.status(400).send({ status: false, msg: "name is already exist. Please provide another College Name."}) }

        let createData = await collegeModel.create(data)
        res.status(201).send({ status: true, data: createData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message, message: " server error" })
    }
}

module.exports.createCollegeData=createCollegeData