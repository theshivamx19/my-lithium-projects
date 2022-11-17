const express = require('express');
const router = express.Router();


const authorController = require("../controller/authorController")

const BlogController=require("../controller/blogController")
 
const middilewares = require('../middlewares/auth')


 //public APIs
 router.post("/authors",authorController.authorData)
 router.post("/login",authorController.login)

//protected APIs
router.post("/blogs",middilewares.authenticate,BlogController.createNewBlog)
router.get("/blogs",middilewares.authenticate,BlogController.getAllBlogs)
router.get("/getBlogs",middilewares.authenticate,BlogController.getBlogs)
router.put("/blogs/:blogId",middilewares.authenticate,middilewares.Authorisation,BlogController.updateBlog)
router.delete("/blogs/:blogId",middilewares.authenticate,middilewares.Authorisation,BlogController.deleteBlog)
router.delete("/deleteBlogs",middilewares.authenticate,BlogController.deleteAllBlogs)


 
 
 
  
router.all("/*",function(req,res){
    res.status(404).send({status:false,msg:"make sure your endpont is correct"})
})
 

module.exports=router  
