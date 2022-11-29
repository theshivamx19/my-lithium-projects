const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookmodel')
const userModel = require('../models/usermodel')



exports.authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        // console.log(token)
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

         jwt.verify(token, "SecretKey",function(err,decodedToken){
            if(err){
                return res.status(400).send({status : false, msg : "token invalid"})
            }else{
                req.token = decodedToken
                 next()
            }
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, key: error.message });
    }
}