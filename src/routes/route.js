const express = require('express');
const router = express.Router();
 
const authorController = require("../controller/authorController")
const BlogController=require("../controller/blogController")
// const blogModel = require("../models/blogModel")




router.post("/blogs",BlogController.createNewBlog)
router.get("/getAllBlogs",BlogController.getAllBlogs)
router.get("/getBlogs",BlogController.getTBlogs)
router.delete("/deleteBlogs",BlogController.deleteAllBlogs)
router.put("/updateBlogs/blogs/:blogId",BlogController.updateBlog)

module.exports=router  