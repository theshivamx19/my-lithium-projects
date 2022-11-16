const express = require('express');
const router = express.Router();


const authorController = require("../controller/authorController")

const BlogController=require("../controller/blogController")
 
const middilewares = require('../middlewares/auth')


// CREATING AUTHER
 router.post("/authors",authorController.authorData)

// CREATING NEW BLOGS 
 router.post("/blogs",middilewares.authenticate,BlogController.createNewBlog)

//GET ALL BLOG BY { isDeleted: false, isPublished: true }
 router.get("/getAllBlogs",middilewares.authenticate,BlogController.getAllBlogs)

//GET ALL BLOG BY QUERY PARAMS {authorId,category,tags,subcategory}=req.query
 router.get("/getBlogs",middilewares.authenticate,BlogController.getTBlogs)

// UPDATING BLOG BY TAGS  CATEGORY SUB-COTEGORY ETC 
 router.put("/updateBlogs/blogs/:blogId",middilewares.authenticate,BlogController.updateBlog)

// DELETING BOLOG BY PATH PARAMS
router.delete("/blogs/:blogId",middilewares.authenticate,BlogController.deleteBlog)

// DELETING BOLOG BY  QUERY PARAMS AND BY QWERY PARAMS WE HAVE TO DELETE BLOGS
router.delete("/deleteBlogs/",middilewares.authenticate,BlogController.deleteAllBlogs)


//login 
router.post("/login",authorController.login)
 


 

module.exports=router  
