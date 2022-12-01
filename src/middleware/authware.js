const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookmodel')



exports.authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        // console.log(token)
        if (!token) return res.status(400).send({ status: false, message: "token must be present" });

        jwt.verify(token, "SecretKey", function (err, decodedToken) {
            if (err) {
                return res.status(401).send({ status: false, message: "token invalid" })
            }
            else {
                req.token = decodedToken
                next()
            }
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, key: error.message });
    }
}


exports.authorization = async (req, res, next) => {

    try {
        //let token = req.headers["x-api-key"]
        //let decodedToken = jwt.verify(token, "SecretKey") 
        let tokenUserId = req.token.userId

        let pathBookId = req.params.bookId

        if (pathBookId) {

            let findBook = await bookModel.findOne({ _id: pathBookId })

            if (Object.keys(findBook).length == 0) {
                return res.status(404).send({ status: false, message: 'Book not found !' })
            }

            let bookUserId = findBook.userId

            if (tokenUserId != bookUserId) {
                return res.status(403).send({ status: false, message: 'You are not authorized !' })
            }
            next()
        }
        else if (req.body.userId) {

            if (tokenUserId != req.body.userId) {
                return res.status(403).send({ status: false, message: 'You are not authorized !' })
            }
            next()
        }
        else {
            return res.status(400).send({ status: false, message: "Id must be present !" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}