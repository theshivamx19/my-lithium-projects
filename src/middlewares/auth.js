const jwt = require("jsonwebtoken");
const BlogModel = require('../models/blogModel')
 
const {isValidObjectId} = require('mongoose')


let authenticate=async function(req,res,next){
  try{ let token =req.headers["x-api-key"]

   if(!token)
   return res.status(400).send({status:false,msg:"Token must be present."})

   let decodeToken= jwt.verify(token,"Blog project")
   if(!decodeToken){
   return res.status(401).send({status:false,msg:"Token is invalid."})
 }else{
    req.decodeToken=decodeToken.authorId
     
    next()
 }
  }catch(error){
    return res.status(500).send({status : false , msg : error.message})
  }
}



 const Authorisation= async function(req,res,next){

try{const blogId = req.params.blogId;

   if (!isValidObjectId(blogId)) {
    return res.status(400).send({ status: false, msg: 'Invalid Object Id' })
  }

   let blog = await BlogModel.findById(blogId)
   if (!blog) return res.status(400).send({ status: false, msg: "Blog does not exist." })


   if(blog.authorId!=req.decodeToken) return res.status(403).send({ status: false, msg: "Oooh you are not authorised." })

   if(blog.isDeleted) return res.status(400).send({ status: false, msg: "Oooh BLOG ALREDY DELETED so, you can not UPDATE it." })
                  
   next()
}catch(error){
  return res.status(500).send({status:false,msg:error.message})
}
 }

 
module.exports={authenticate,Authorisation}
