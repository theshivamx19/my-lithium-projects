const jwt = require('jsonwebtoken')
const UserModel = require('../models/usermodel')

let phoneValid = /^[6-9]\d{9}$/
let emailValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
let nameValid = /^[a-zA-Z\ ]{2,15}$/


exports.createUser = async (req, res) => {
    try {
        let data = req.body
        let { title, name, phone, email, password } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body can not be empty" })
        }

        if (title) title = title.trim()
        if (name) name = name.trim()
        if (email) email = email.trim()

        if (!title) { return res.status(400).send({ status: false, message: "Title is mandatory" }) }
        if (!["Mr", "Mrs", "Miss"].includes(title)) { return res.status(400).send({ status: false, message: "Please provide a valid title - Mr , Mrs , Miss" }) }
        if (!name) { return res.status(400).send({ status: false, message: "Name is mandatory" }) }
        if (!name.match(nameValid)) { return res.status(400).send({ status: false, message: "Please provide a Valid name" }) }
        if (!phone) { return res.status(400).send({ status: false, message: "Phone number is mandatory" }) }

        phone = String(phone)
        phone = phone.trim()

        if (!phone.match(phoneValid)) { return res.status(400).send({ status: false, message: "Please provide a valid phone" }) }


        let unique = await UserModel.findOne({ $or: [{ phone: phone }, { email: email }] })
        if (unique) {
            if (unique.phone == phone) return res.status(400).send({ status: false, message: "Please provide a Unique phone" })
        }

       

        if (!email) { return res.status(400).send({ status: false, message: "Email is mandatory" }) }
        if (!email.match(emailValid)) { return res.status(400).send({ status: false, message: "Please provide a valid email" }) }
        data.email = email.toLowerCase()
        if (unique) {
            if (unique.email == email) return res.status(400).send({ status: false, message: "Please provide a unique email" })
        }


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
        let { email, password } = req.body
        if (email) email = email.trim()

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Body can not be empty" })
        }

        if (!email) {
            return res.status(400).send({ status: false, message: 'Email is required' })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }
        if (!emailValid.test(email)) {
            return res.status(400).send({ status: false, message: 'Enter valid email' })
        }

        let checkUser = await UserModel.findOne({ email: email, password: password })
        if (!checkUser) {
            return res.status(401).send({ status: false, message: 'email or password is incorrect' })
        }

        const token = jwt.sign(
            {
                userId: checkUser._id.toString(),
                batch: "Lithium"
            },
            "SecretKey", { expiresIn: '5h' })

        res.setHeader('x-api-key', token)

        return res.status(200).send({ status: true, data: { token: token, ExpiresIn: "Token is valid for 5 hours from time of creation", IssuedAt: new Date() } })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}
