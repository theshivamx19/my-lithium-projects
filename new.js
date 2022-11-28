const internModel = require('../Model/interModel')
const { create } = require('./src/Model/internModel')

const createInter = async function(req, res){
    try{
    const data = req.body
    const {name, email, mobile, collegeId} = data
    if(Object.keys(data).length==0){
        return res.status(400).send({status : false, message : 'Data is required'})
    }
    if(!name){
        return res.status(400).send({status : false, message : 'Name is reuqired'})
    }
    
    const college = await internModel.create(data)
    return res.status(201).send({status : true, data : college})
}
catch(err){
    return res.status(500).send({status : false, message : err.message})
}
}
module.exports.createInter = createInter