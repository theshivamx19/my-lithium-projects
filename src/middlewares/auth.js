const jwt = require("jsonwebtoken");
const BlogModel = require('../models/blogModel')
const ObjectId = require('mongoose').Types.ObjectId
 


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

   const blogId = req.params.blogId;
   
   if (!ObjectId.isValid(blogId))
   return res.status(400).send({ status: false, msg: "blogId is invalid." })


   let blog = await BlogModel.findById(blogId)
   if (!blog) return res.status(400).send({ status: false, msg: "Blog does not exist." })


  if(blog.authorId!=req.decodeToken) return res.status(401).send({ status: false, msg: "author is not matching." })
  
   next()

 }

 
module.exports={authenticate,Authorisation}
