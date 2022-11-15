const AuthorModel = require('../models/authorModel')
const BlogModel = require('../models/blogModel')
const ObjectId = require('mongoose').Types.ObjectId


// CREATING NEW BLOGS
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


 //GET ALL BLOG BY { isDeleted: false, isPublished: true }
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


//GET ALL BLOG BY QUERY PARAMS {authorId,category,tags,subcategory}=req.query
const getTBlogs = async function (req, res) {
    try {
        // let { authorId, category, tags, subcategory } = req.query
        let findBlogs = await BlogModel.find(req.query).populate('authorId')
        res.send({ msg: findBlogs })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


// UPDATING BLOG BY TAGS  CATEGORY SUB-COTEGORY ETC 
let updateBlog = async function (req, res) {
    try {
            const blogId = req.params.blogId;
            let data = req.body;

        if (!mongoose.isValidObjectId(blogId)) {
              return res.status(400).send({ status: false, msg: 'Invalid Object Id' })
            }
       
         
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



// DELETING BOLOG BY PATH PARAMS
const deleteBlog = async function (req, res) {
    try {

        const blogId = req.params.blogId
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: 'Invalid Object Id' })
        }

        const findBlog = await BlogModel.findById(blogId)
        if (!findBlog) { return res.status(404).send({ status: true, msg: "" }) }


        const blogData = await BlogModel.findByIdAndUpdate(blogId, {
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



// DELETING BOLOG BY  QUERY PARAMS AND BY QWERY PARAMS WE HAVE TO DELETE BLOGS
let deleteAllBlogs = async function (req, res) {
    try {
        let data = req.query
        data.isDeleted=false
        
        let deleteBlogs = await BlogModel.updateMany(data,{ isDeleted: true, deletedAt: new Date() })
        return res.status(200).send({ status: true, deleteBlogs, msg: "blogs deleted successfully." })
    } catch (error) {
        return res.status(500).send({ msg: error.message })

    }
}


// WRITE AND WORKING CODE==>

// const updateAllBlogs = async function (req, res) {

//     const { title, body, tags, subCategory } = req.body
//     const blogId = req.params.blogId

//     if (!mongoose.isValidObjectId(blogId)) {
//         return res.status(400).send({ status: false, msg: 'Invalid Object Id' })
//     }
//     const findBlog1 = await BlogModel.findById(blogId)
//     if (!findBlog1) { return res.status(404).send({ status: true, msg: "" }) }



//     const findBlog = await BlogModel.findById(blogId1)
//     const tagsData = findBlog.tags
//     const subcategryData = findBlog.subCategory
//     tagsData.push(tags)
//     subcategryData.push(subCategory)

//     const blogData = await blogModel.findByIdAndUpdate(blogId, {
//         $set: {
//             title: title,
//             body: body,
//             tags: tagsData,
//             isPublished: true,
//             publishedAt: new Date(),
//             subCategory: subcategryData

//         }
//     }, { new: true })
//     return res.status(200).send({ msg: blogData })

// }




//1
module.exports.createNewBlog = createNewBlog

//2
module.exports.getAllBlogs = getAllBlogs

//3
module.exports.getTBlogs = getTBlogs

//4
module.exports.updateBlog = updateBlog

//5
module.exports.deleteAllBlogs = deleteAllBlogs

//6
module.exports.deleteBlog = deleteBlog


// module.exports.updateAllBlogs = updateAllBlogs



