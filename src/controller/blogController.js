const { findOne, findOneAndUpdate, findById } = require('../models/authorModel')
const AuthorModel = require('../models/authorModel')
const BlogModel = require('../models/blogModel')
const ObjectId = require('mongoose').Types.ObjectId


// Blog Creation...
let createNewBlog = async function (req, res) {
    try {
        let data = req.body
        let { title, body, authorId, tags, category, subcategory, isPublished } = data

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Data is required to create a blog." })

        if (!title || !body || !tags || !category || !subcategory)
            return res.status(400).send("All fields are required.")


        if (!ObjectId.isValid(authorId))
            return res.status(400).send({ status: false, msg: "auhtorId is invalid." })

        let findAuthor = await AuthorModel.findById(authorId)
        if (!findAuthor)
            return res.status(404).send({ status: false, msg: "Author with the given AuthorId does not exists." })


        let saveData = await BlogModel.create(data)
        res.status(201).send({ status: true, msg: saveData })
    } catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}


// Get/blogs 
const getAllBlogs = async function (req, res) {
    try {
        const blogs = await BlogModel.find({ isDeleted: false, isPublished: true })
        if (!blogs) {
            return res.status(404).send({ status: false, msg: 'No data exists' })
        }
        return res.status(200).send({ status: true, data: blogs })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}

    const getTBlogs=async function(req,res){
        try{
    let {authorId,category,tags,subcategory}=req.query
    let findBlogs=await BlogModel.find(req.query).populate('authorId')
    res.send({msg:findBlogs})
 }catch(error){
    res.status(500).send({status:false,msg:error.message})
 }
}

let deleteAllBlogs = async function (req, res) {
    try {
        let data = req.query

        let deleteBlogs = await BlogModel.updateMany(data, { isDeleted: true, deletedAt: new Date() })
        return res.status(200).send({ status: true, msg: "blogs deleted successfully." })
    } catch (error) {
        return res.status(500).send({ msg: error.message })



    }
}

let updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let data = req.body;

        let blog = await BlogModel.findById(blogId)
        if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exist." })

        let updatedBlogs = await BlogModel.findOneAndUpdate({ _id: blogId },
            {
                title: data.title,
                body: data.body,
                category: data.category,
                isPublished: true,
                publishedAt: new Date(),
                $push: { tags: data.tags, subcategory: data.subcategory }
            },
            { new: true })

        return res.status(200).send({ status: true, msg: updatedBlogs })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}










module.exports.getAllBlogs = getAllBlogs
module.exports.createNewBlog = createNewBlog
module.exports.deleteAllBlogs = deleteAllBlogs
module.exports.updateBlog = updateBlog
module.exports.getTBlogs=getTBlogs