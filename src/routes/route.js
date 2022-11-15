const express = require('express');
const router = express.Router();
 

const authorController = require("../controller/authorController")

const BlogController=require("../controller/blogController")
 


// CREATING AUTHER
 router.post("/authors",authorController.authorData)

// CREATING NEW BLOGS 
 router.post("/blogs",BlogController.createNewBlog)

//GET ALL BLOG BY { isDeleted: false, isPublished: true }
 router.get("/getAllBlogs",BlogController.getAllBlogs)

//GET ALL BLOG BY QUERY PARAMS {authorId,category,tags,subcategory}=req.query
 router.get("/getBlogs",BlogController.getTBlogs)

// UPDATING BLOG BY TAGS  CATEGORY SUB-COTEGORY ETC 
 router.put("/updateBlogs/blogs/:blogId",BlogController.updateBlog)

// DELETING BOLOG BY PATH PARAMS
router.delete("/blogs/:blogId",BlogController.deleteBlog)

// DELETING BOLOG BY  QUERY PARAMS AND BY QWERY PARAMS WE HAVE TO DELETE BLOGS
router.delete("/deleteBlogs",BlogController.deleteAllBlogs)
 

 


//put
// router.put("/blogs/:blogId",BlogController.updateAllBlogs)

 



module.exports=router  
