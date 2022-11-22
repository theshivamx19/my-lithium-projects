const internModel = require('../Model/internModel')
const vfy = require('../validation/valid')

const createIntern = async function(req, res){
    try{
    const data = req.body
    const {name , email, mobile, collegeId} = data
    if(!name){
        return res.status(400).send({status : false, message : 'Name is required'})
    }
    if(!vfy.nameReg(name)){
        return res.status(400).send({status : false, message : 'Numbers & Special characters are not allowed in Name'})
    }
    if(!email){
        return res.status(400).send({status : false, message : 'Email Id is required'})
    }
    if(!vfy.emailReg(email)){
        return res.status(400).send({status : false, message : 'Please enter a valid email id'})
    }
    if(!mobile){
        return res.status(400).send({status : false, message : 'Mobile no. is required'})
    }
    if(!vfy.mobileValid(mobile)){
        return res.status(400).send({status : false, message : 'Enter valid mobile no.'})
    }
    if(!collegeId){
        return res.status(400).send({status : false, message : 'College Id is required'})
    }
    if(!vfy.validObjectId(collegeId)){
        return res.status(400).send({status : false, message : 'Please enter valid object Id'})
    }
    const checkEmail = await internModel.findOne({email : email})
    if(checkEmail){
        return res.status(400).send({status : false, message : 'Email Id already exists'})
    }
    const checkMobile = await internModel.findOne({mobile : mobile})
    if(checkMobile){
        return res.status(400).send({status : false, message : 'Mobile no. is already exists'})
    }
    const interns = await internModel.create(data)
    return res.status(201).send({status : true, data : interns})
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}
module.exports.createIntern = createIntern