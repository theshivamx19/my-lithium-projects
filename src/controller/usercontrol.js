const jwt = require('jsonwebtoken')
const UserModel = require("../models/usermodel")


exports.createUser = async (req, res) => {
    try {

        let data = req.body

        let userData = await UserModel.create(data)

        return res.status(201).send({ status: true, message: 'Success', data: userData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.userLogin = async (req, res) => {
    try {
        let mailId = req.body.email
        let pwd = req.body.password

        let user = await UserModel.findOne({ email: mailId, password: pwd })

        if (!user)
            return res.status(401).send({ status: false, warning: "Wrong email-id or password !" })

        let token = jwt.sign(
            {
                userId: user._id,
                email: mailId,
                password: pwd
            },
            "fake password",
            {
                expiresIn: '24h'
            }
        )

        let date = new Date();
        // let iat = `Token Generated at:- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        res.setHeader("x-api-key", token)

        res.status(200).send({ status: true, token: token, ExpiresIn: "Next 24 hours", IssuedAt: date })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}