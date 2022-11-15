const AuthorModel = require('../models/authorModel')
const blogModel = require('../models/blogModel')
var mongoose = require('mongoose');


const createNewBlog = async function (req, res) {
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

const getBlogs = async function (req, res) {
    try {
        let data = req.query
        let { authorId, category, tags, subcategory } = data
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: 'Data is required to find blog' })
        }
        let findBlog = await BlogModel.find({ $or: [{ _id: authorId }, { category: category }, { subcategory: subcategory }, { tags: tags }] })
        if (!findBlog) {
            return res.status(404).send({ status: false, msg: 'No such blog exists' })
        }
        return res.status(200).send({ status: true, data: findBlog })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}



const deleteBlog = async function (req, res) {
    try {

        const blogId = req.params.blogId
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: 'Invalid Object Id' })
        }


        const findBlog = await blogModel.findById(blogId)
        if (!findBlog) { return res.status(404).send({ status: true, msg: "" }) }


        const blogData = await blogModel.findByIdAndUpdate(blogId, {
            $set: {
                isDeleted: false,
                deletedAt: new Date()
            }
        }, { new: true })
        return res.status(200).send({ msg: "deleted", blogData })

    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

let deleteAllBlogs = async function (req, res) {
    try {
        let data = req.query

        let deleteBlogs = await blogModel.updateMany(data, { isDeleted: false, deletedAt: new Date() })
        return res.status(200).send({ status: true, deleteBlogs, msg: "blogs deleted successfully." })
    } catch (error) {
        return res.status(500).send({ msg: error.message })

    }
}



const updateAllBlogs = async function (req, res) {


    const { title, body, tags, subCategory } = req.body
    const blogId = req.params.blogId

    if (!mongoose.isValidObjectId(blogId)) {
        return res.status(400).send({ status: false, msg: 'Invalid Object Id' })
    }
    const findBlog1 = await blogModel.findById(blogId)
    if (!findBlog1) { return res.status(404).send({ status: true, msg: "" }) }



    const findBlog = await blogModel.findById(blogId1)
    const tagsData = findBlog.tags
    const subcategryData = findBlog.subCategory
    tagsData.push(tags)
    subcategryData.push(subCategory)

    const blogData = await blogModel.findByIdAndUpdate(blogId, {
        $set: {
            title: title,
            body: body,
            tags: tagsData,
            subCategory: subcategryData

        }
    }, { new: true })
    return res.status(200).send({ msg: blogData })

}





module.exports.getAllBlogs = getAllBlogs
module.exports.getBlogs = getBlogs
module.exports.createNewBlog = createNewBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteAllBlogs = deleteAllBlogs
module.exports.updateAllBlogs = updateAllBlogs