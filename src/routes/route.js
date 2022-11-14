const express = require('express');
const router = express.Router();
 
const authorController = require("../controller/authorController")
const BlogController=require("../controller/blogController")
// const blogModel = require("../models/blogModel")



//api's

//1
// router.post("/authors",authorController.authorData)
router.post("/blogs",BlogController.createNewBlog)
router.get("/getBlogs",BlogController.getAllBlogs)

 




module.exports = router;


