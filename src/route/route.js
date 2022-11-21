const express= require('express')
const router = express.Router();
const collegeController=require("../controller/collegeController")

router.get('/test', function (req, res){
    console.log("hi I'm sweta")
    res.status(201).send({message:"welcome"})
})
router.post('/functionup/colleges', collegeController.createCollegeData) 

module.exports = router;
