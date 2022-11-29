
exports.checkBody = (req, res, next) => {

    try {
        let bodyData = req.body

        

        next()
    }
    catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }
}
