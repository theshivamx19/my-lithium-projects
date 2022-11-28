const jwt = require('jsonwebtoken')
const UserModel = require('../models/usermodel')

let phoneValid = /^[6-9]\d{9}$/
let emailValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
let nameValid = /^[a-zA-Z\ ]{2,15}$/


exports.createUser = async (req, res) => {
    try {
        let data = req.body

        let { title, name, phone, email, password } = data

        if (!title) { return res.status(400).send({ status: false, message: "Title is mandatory" }) }
        if (!["Mr", "Mrs", "Miss"].includes(title)) { return res.status(400).send({ status: false, message: "Please provide a valid title - Mr , Mrs , Miss" }) }

        if (!name) { return res.status(400).send({ status: false, message: "Name is mandatory" }) }
        if (!name.match(nameValid)) { return res.status(400).send({ status: false, message: "Please provide a Valid name" }) }
        if (!phone) { return res.status(400).send({ status: false, message: "Phone number is mandatory" }) }

        phone = String(phone)
        phone = phone.trim()

        if (!phone.match(phoneValid)) { return res.status(400).send({ status: false, message: "Please provide a valid phone" }) }
        let uniquePhone = await UserModel.findOne({ phone })
        if (uniquePhone) { return res.status(400).send({ status: false, message: "Please provide a Unique phone" }) }

        if (!email) { return res.status(400).send({ status: false, message: "Email is mandatory" }) }
        if (!email.match(emailValid)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }

        req.body.email = email.toLowerCase()

        let uniqueEmail = await UserModel.findOne({ email })
        if (uniqueEmail) { return res.status(400).send({ status: false, message: "Please provide a unique email" }) }

        if (!password) { return res.status(400).send({ status: false, message: "Password is mandatory" }) }
        if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, message: "Password length must be between 8-15" }) }

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

        res.status(200).send({ status: true, token: token, ExpiresIn: "Token valid for 24 hours from time of creation", IssuedAt: date })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}