const authorModel = require("../models/authorModel")


const isValid = function (value) {

   if (typeof value == undefined || value == null || typeof value != String || value.trim().length == 0) return false

   else {
      return true;
   }
}

const authorData = async function (req, res) {

   try {
      let { email, fname, lname, title, password } = req.body

      // if any part is missing then 
      if (!fname || !lname || !title || !email || !password) {
         return res.status(400).send({ msg: "somthing is missing" })
      }

// validation performing
if (!isValid(fname) || !isValid(lname) || !isValid(title) || !isValid(email) ||!isValid(password)) {
         return res.status(400).send({ msg: "somthing is invalid" })
      }

      // we are implimenting REGEX for email id validation


      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!reg.test(email)) { return res.status(400).send({ msg: "emailid is not valid" }) }


  // cheking emailid in data base   
      let emailCheck = await authorModel.findOne({ email: email })

 // if email is present then       
      if (emailCheck) return res.status(400).send({ msg: "emailid is used" })


      // email is not present then    
      let createdAuther = await authorModel.create({ email, fname, lname, title, password })

      return res.send({ data: createdAuther })
   }


   // for server error   
   catch (error) {
      return res.status(500).send({ msg: error.massage })
   }

}

module.exports.authorData = authorData