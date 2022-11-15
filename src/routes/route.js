const express = require('express');
const router = express.Router();
 
const authorController = require("../controller/authorController")
const BlogController=require("../controller/blogController")
 




// router.post("/authors",authorController.authorData)

// // router.post("/blogs",BlogController.createNewBlog)

// router.get("/getAllBlogs",BlogController.getAllBlogs)

// router.get("/blogs/:blogId",BlogController.deleteBlog)

//put
router.put("/blogs/:blogId",BlogController.updateAllBlogs)

// router.post("/blogs",BlogController.deleteAllBlogs)

module.exports=router