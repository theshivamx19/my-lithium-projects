const AuthorModel=require('../models/authorModel')
const ObjectId = require('mongoose').Types.ObjectId
    try{  
    let data=req.body
    let { title, body, authorId, tags, category, subcategory, isPublished }=data

    if(Object.keys(data).length==0)
    return res.status(400).send({status:false,msg:"Data is required to create a blog."})
    
    if(!title || !body || !tags || !category || !subcategory )
     return res.status(400).send("All fields are required.") 
  

    if(!ObjectId.isValid(authorId))
    return res.status(400).send({status:false,msg:"auhtorId is invalid."})
  
    let findAuthor=await AuthorModel.findById(authorId)
    if(!findAuthor)
    return res.status(404).send({status:false,msg:"Author with the given AuthorId does not exists."})
  
  
     let saveData=await BlogModel.create(data)
     res.status(201).send({status:true,msg:saveData})
  }catch(error){
      return res.status(500).send({msg:error.message})
  }
  
  

  const getAllBlogs = async function (req, res) {
    try {
        const blogs = await blogModel.find({isDeleted : false, isPublished : true})
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
        let data = req.query
        let {authorId, category, tags, subcategory} = data
        if(Object.keys(data).length==0){
            return res.status(400).send({status : false, msg : 'Data is required to find blog'})
        }
        let findBlog = await blogModel.find({$or : [{_id : authorId}, {category : category}, {subcategory : subcategory}, {tags : tags}]} )
        if(!findBlog){
            return res.status(404).send({status : false, msg : 'No such blog exists'})
        }
        return res.status(200).send({ status: true, data: findBlog })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports.getAllBlogs = getAllBlogs
module.exports.getBlogs = getBlogs
module.exports.createNewBlog=createNewBlog