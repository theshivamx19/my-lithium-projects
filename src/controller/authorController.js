const jwt = require("jsonwebtoken");

const authorModel = require("../models/authorModel")



// CREATING AUTHER
const authorData = async function (req, res) {

  try {

    const data = req.body;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "All Field are Mandatory" });
    }

    if (data.length > 5) { return res.status(400).send({ msg: "lenth can not exide by 5" }) }


    const { email, fname, lname, title, password } = data

    if (fname.trim().length == 0 || lname.trim().length == 0) return res.send({ msg: "fullName or lastName is not present" })

    const firstName = /^[a-zA-Z]+$/.test(fname)
    const lastName = /^[a-zA-Z]+$/.test(lname)

    if (firstName == false || lastName == false) { return res.status(400).send({ msg: "do do not enter special carrector" }) }

    if (data.title != "Mr" || data.title != "Miss" || data.title != "Mrs") { return res.status(400).send({ msg: "title can not be onther than this" }) }

    const isEmailAlreadyUsed = await authorModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, msg: "Oooh...this Email already Registered. Please try Login..." });
    }


    const createdAuther = await authorModel.create(data)

    return res.status(201).send({msg: "Author Created successfully....", data: createdAuther })

  }

  // for server error   
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


module.exports = { authorData, login }