
exports.checkBody = (req, res, next) => {

    try {
        let bodyData = req.body

        if (Object.keys(bodyData).length == 0) {

            return res.status(400).send({ status: false, message: "Body can not be empty" })
        }

        next()
    }
    catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }
}
