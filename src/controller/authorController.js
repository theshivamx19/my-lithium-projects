const jwt = require("jsonwebtoken");

const authorModel = require("../models/authorModel")



// CREATING AUTHER
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



//WE ARE GET LOGINED OF USER AND CREATING JWT TOKEN
const login =  async function (req, res) {
   let userName = req.body.email;
   let password = req.body.password;
 
   if (!userName || !password) {
     return res.send({
       status: false,
       msg: "username or the password is not present",
     });
   }

   let user = await authorModel.findOne({ email: userName, password: password });
   if (!user)
     return res.send({
       status: false,
       msg: "username or the password is not corerct",
     });

     let token = jwt.sign(
       {
         authorId: user._id,
        },
       "Blog project"
     );
      
     res.status(200).send({ status: true, data: token });
   };

  
module.exports ={ authorData,login}