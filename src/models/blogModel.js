const mongoose=require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


blogSchema=new mongoose.Schema({

    title: {
        type : String, 
        require: true
    },

    body: {
        type : String, 
        require: true
    },

    authorId: {
        type : ObjectId, 
        require: true,
         ref : "author"
        },

    tags: [ String ],

    category: {
        type : String, 
        require: true
    },

    subCategory:  [ String ],

    isDeleted: {
        type:Boolean, 
        default: false
    },

    deleteddAt:  { 
        type : Date,
        default:null
     },

    publishedAt:  { 
        type : Date,
        default:null
     },
     deletedAt:  { 
        type: Date , 
        default: null
             },

    isPublished: {
        type : Boolean,
         default: false
        }
},{timeStamps:true})


module.exports=mongoose.model("blog",blogSchema);

 