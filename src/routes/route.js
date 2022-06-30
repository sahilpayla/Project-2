const express =require("express");
const router = express.Router();
const collegeController = require('../controller/collegeController')
const internController = require('../controller/internController')

//CREATE COLLEGE DETAILS
router.post('/functionup/colleges',collegeController.createCollege)

//CREATE INTERN DETAILS
router.post('/functionup/interns',internController.createIntern)

//INTERNS OF THE SPECIFIC COLLEGE
router.get('/functionup/collegeDetails',collegeController.getCollegeDetails)


module.exports = router