const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookmodel')
const userModel = require('../models/usermodel')



exports.authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        // console.log(token)
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

        jwt.verify(token, "SecretKey", function (err, decodedToken) {
            if (err) {
                return res.status(400).send({ status: false, msg: "token invalid" })
            } else {
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
        let token = req.headers["x-api-key"]

        let decodedToken = jwt.verify(token, "SecretKey")

        let tokenUserId = decodedToken.userId

        let pathBlogId = req.params.blogId

        if (pathBlogId) {
            let findBlog = await blogModel.findOne({ _id: pathBlogId })
            let blogUserId = findBlog.UserId

            if (tokenUserId != blogUserId) {
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