const express = require('express');
const router = express.Router();
 
const authorModel = require("../controller/authorController")
// const blogModel = require("../models/blogModel")



//api's

//1
router.post("/authors",authorModel.authorData)
 


 

//2
// router.post("/blogs", async function(req,res){

//     let data= req.body

//  let createdAuther= await blogModel.create(data)

//  res.send({data:createdAuther})
// })


module.exports = router;