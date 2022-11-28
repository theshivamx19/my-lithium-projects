const express= require('express')
const router = express.Router();
const collegeController=require("../controller/collegeController")
const internController=require("../controller/internController")

//--------------------------------------API's--------------------------------------------------------------------------

router.post('/functionup/colleges', collegeController.createCollege ) 
router.post('/functionup/interns', internController.createIntern) 
router.get('/functionup/collegeDetails', collegeController.getDetails) 

//----------------------------------------EndPoint Error for all API's--------------------------------------------------
router.all("/*", function (req, res) {
    res.status(404).send({ status: false, msg: "make sure your endpont is correct" })
})

module.exports = router;
