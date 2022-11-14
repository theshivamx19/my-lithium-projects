const express = require('express');
const router = express.Router();
 
const authorController = require("../controller/authorController")
const BlogController=require("../controller/blogController")
// const blogModel = require("../models/blogModel")



//api's

//1
router.post("/authors",authorController.authorData)
router.post('/createBlog', aut)
router.post("/createNewBlog",BlogController.createNewBlog)

 

//2
// router.post("/blogs", async function(req,res){

//     let data= req.body

//  let createdAuther= await blogModel.create(data)

//  res.send({data:createdAuther})
// })


module.exports = router;

// modified
