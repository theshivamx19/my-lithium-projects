 const authorModel = require("../models/authorModel")



 const authorData= async function(req,res){


    // distructuring from body
 try  { let {email,fname,lname,title,password} = req.body


 // if any part is missing then 

    if(!fname ||!lname || !title ||!email||!password ){
        res.status(401).send({msg:"somthing is missing"})
    }


// we are implimenting REGEX for email id validation

    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (! reg.test(email)){ res.status(400).send({msg:"emailid is not valid"})}


 // cheking emailid in data base   
   let emailCheck= await authorModel.findOne({email:email})
         
 // if email is present then       
    if (emailCheck) res.status(400).send({msg:"emailid is used"})
                       

 // email is not present then    
let createdAuther= await authorModel.create({email,fname,lname,title,password})

    res.send({data:createdAuther})}


 // for server error   
    catch(error){
        res.status(500).send({msg : error.massage})
    }

 }


 module.exports.authorData=authorData