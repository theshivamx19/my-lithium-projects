const blogModel = require('../controllers/blogModel')
const ObjectId = require('mongoose').Types.ObjectId


// Author Creation
let createNewBlog=async function(req,res){
    try{  
    let data=req.body
    let { title, body, authorId, tags, category, subcategory, isPublished }=data
  
    
    if(!title || !body || !authorId || !tags || !category || !subcategory || !isPublished)
     return res.status(400).send("All fields are required.") 
  
   
    if(!data.authorId)
    return res.status(400).send("AuthorId is required.")
   
    if(!ObjectId.isValid(data.authorId))
    return res.status(400).send({status:false,msg:"auhtorId is invalid."})
  
    let findAuthor=await AuthorModel.findById(data.authorId)
    if(!findAuthor)
    return res.status(404).send("Author with the given AuthorId does not exists.")
  
  
     let saveData=await BlogModel.create(data)
     res.status(201).send({status:true,msg:saveData})
  }catch(error){
      return res.status(500).send({msg:error.message})
  }
  }
  

const createBlog = async function(req, res){
    try{
    const data = req.body
    const blogData = await blogModel.create(data)
    return res.status(201).send({status : true, data : blogData})
    }
    catch(err){
        return res.status(500).send({status : false, error : err.message})
    }

}

const getAllBlogs = async function (req, res) {
    try {
        const blogs = await blogModel.find()
        if(!blogs){
            return res.status(404).send({status : false, msg : 'No data exists'})
        }
        return res.status(200).send({ status: true, data: blogs })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}

const getBlogs = async function (req, res) {
    try {
        const data = req.query
        const {authorId, category, tag, subCategory} = data
        if(!data){
            return res.status(400).send({status : false, msg : 'Data is required to find blog'})
        }
        const findBlog = await blogModel.findOne({ _id: authorId } || { category: category } || { tag: tag } || { subCategory: subCategory })
        return res.status(200).send({ status: true, data: findBlog })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.getAllBlogs = getAllBlogs
module.exports.getBlogs = getBlogs
module.exports.createBlog = createBlog
module.exports.createNewBlog=createNewBlog