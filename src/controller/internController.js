const collegeModel = require("../model/collegeModel")
const internModel = require("../model/internModel")

const nameRegex = /^([a-zA-Z ]+)$/   
//completly not valid find space regex          //hhdgfhhgfsfdghgdfdsxfdgh                     
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const mobileRegex = /^[0]?[6789]\d{9}$/ 
//10 didgit mobile number stating with any(6,7,8,9) and 0 if you want to use in mobile number                                


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) {
        return false
    }
    if (typeof value === 'string' && value.trim().length === 0) {
        return false   
    }
    return true
}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}

// Create Intern
const createIntern = async function (req, res) {
    try {

        const internData = req.body
        const { name, email, mobile, collegeName } = internData

        if (!isValidRequestBody(internData)) return res.status(400).send({ status: false, message: "No input by user please provide" })

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Intern's name is required." })
        if (!nameRegex.test(name)) return res.status(400).send({ status: false, message: "Not a valid name." })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "Intern's email id is required." })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Please provide a valid email." })
        const usedEmail = await internModel.findOne({ email })
        if (usedEmail) return res.status(400).send({ status: false, message: "Email id already exists. Please use another email id." })

        if (!isValid(mobile)) return res.status(400).send({ status: false, message: "Intern's mobile no is required." })
        if (!mobileRegex.test(mobile)) return res.status(400).send({ status: false, message: "Please provide a valid mobile number, it should start 6-9.(you can also use STD code 0)" })
        const usedMobile = await internModel.findOne({ mobile })
        if (usedMobile) return res.status(400).send({ status: false, message: "Mobile no already exists. Please provide another mobile number" })

        const getCollegeDetails = await collegeModel.findOne({name:collegeName , isDeleted: false })
        if (!getCollegeDetails) return res.status(404).send({ status: false, message: "college not found." })

        const collegeIdByCollegeName= getCollegeDetails._id

        const saveData={
            name:name,
            email:email,
            mobile:mobile,
            collegeName:collegeIdByCollegeName
        }

        const newInternData = await internModel.create(saveData)
        res.status(201).send({ status: true, message: " your Internship application successfully accepted", data: newInternData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createIntern = createIntern