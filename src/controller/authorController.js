const authorModel = require("../models/authorModel")




const authorData = async function (req, res) {

   try {

      let { email, fname, lname, title, password } = req.body
  
    let createdAuther = await authorModel.create({ email, fname, lname, title, password })

      return res.status(201).send({ data: createdAuther })

   }


   // for server error   
   catch (error) {

      return res.status(500).send({ msg: error.message })

   }

}

module.exports.authorData = authorData