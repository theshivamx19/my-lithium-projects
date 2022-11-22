const express= require('express')
const router = express.Router();
const collegeController=require("../controller/collegeController")
const internController=require("../controller/internController")

router.get('/test', function (req, res){
    console.log("hi I'm sweta")
    res.status(201).send({message:"welcome"})
})
router.post('/functionup/colleges', collegeController.createCollege ) 
router.post('/functionup/interns', internController.createIntern) 
router.get('/functionup/collegeDetails', collegeController.getDetails) 

module.exports = router;
