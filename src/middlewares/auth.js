const jwt = require("jsonwebtoken");


 

let authenticate=async function(req,res,next){
   let token =req.headers["x-api-key"]

   if(!token)
   return res.status(400).send({status:false,msg:"Token must be present."})

   let decodeToken= jwt.verify(token,"Blog project")
   if(!decodeToken){
   return res.status(401).send({status:false,msg:"Token is invalid."})
 }else{
    req.decodeToken=decodeToken.authorId
     
    next()
 }

}

 const Authorisation= async function(req,res,next){

     

if ( req.decodeToken==req.params.blogId ) next()


 }
module.exports.authenticate={authenticate,Authorisation}
