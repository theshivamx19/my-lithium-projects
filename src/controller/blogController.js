const blogModel = require('../controllers/blogModel')

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