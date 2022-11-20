const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")



const nameReg = /^[a-zA-Z]+$/


const authorData = async function (req, res) {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "All Field are Mandatory" });
    }
    const { email, fname, lname, title, password } = data
    if (!fname) {
      return res.status(400).send({ status: false, msg: "First name must be present" })
    }
    if (!lname) {
      return res.status(400).send({ status: false, msg: "Last name must be present" })
    }
    if (!email) {
      return res.status(400).send({ status: false, msg: "Email must be present" })
    }
    if (!title) {
      return res.status(400).send({ status: false, msg: "Title is mandatory" })
    }
    if (!password) {
      return res.status(400).send({ status: false, msg: "Password must be there" })
    }
    const firstName = nameReg.test(fname)
    const lastName = nameReg.test(lname)

    if (firstName == false || lastName == false) {
      return res.status(400).send({ msg: "Special characters are not allowed in firstName and lastName" })
    }
    if (title != "Mr" && title != "Miss" && title != "Mrs") {
      return res.status(400).send({ msg: "title can not be onther than this" })
    }

    const isEmailAlreadyUsed = await authorModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, msg: "Oooh...this Email already Registered. Please try login..." });
    }
    
    const createdAuther = await authorModel.create(data)
    return res.status(201).send({ status : true, msg: "Author Created successfully....", data: createdAuther })
  }
  catch (error) {
    return res.status(500).send({ msg: error.message })

  }
}


//WE ARE GET LOGINED OF USER AND CREATING JWT TOKEN
const login = async function (req, res) {
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
    return res.status(400).send({
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



module.exports = { authorData, login }