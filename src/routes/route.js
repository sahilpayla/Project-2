const express =require("express");
const router = express.Router();
const collegeController = require('../controller/collegeController')
const internController = require('../controller/internController')


router.post('/functionup/colleges',collegeController.createCollege)
router.post('/fuctionup/interns',internController.createIntern)
router.get('/functionup/collegeDetails',collegeController.getCollegeDetails)


module.exports = router