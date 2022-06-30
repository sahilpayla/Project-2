const collegeModel = require('../model/collegeModel')
const internModel = require('../model/internModel')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) {
        return false
    }
    if (typeof value === 'string' && value.trim().length == 0) {
        return false
    }
    return true
}

const isValidRequestBody = function (request) {
    return Object.keys(request).length > 0
}

const nameRegex = /^([a-zA-Z]+)$/

// iind regex for the url
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w -]*)?\??(?:[-\+=&;%@.\w]*)#?(?:[\w]*))?)/

// TA REGEX
// const urlRegex = 

const createCollege = async function (req, res) {
    try {
        const collegeData = req.body

        if (!isValidRequestBody(collegeData)) {
            return res.status(400).send({
                status: false,
                message: "No data is provided"
            })}

        // extracting here

        const { name, fullName, logoLink } = collegeData

        if (!isValid(name)) return res.status(400).send({
            status: false,
            message: "college name is required"
        })

        if (!nameRegex.test(name)) return res.status(400).send({
            status: false,
            message: "college name should be in alphabets only"
        })

        if (!isValid(fullName)) return res.status(400).send({
            status: false,
            message: "college full name is required"
        })

        // if (!nameRegex.test(fullName)) return res.status(400).send({ 
        //     status: false, 
        //     message: "college full name should be in alphabets only" 
        // })

        if (!isValid(logoLink)) return res.status(400).send({
            status: false,
            message: "logo link is required"
        })

        // if (!urlRegex(logoLink)) return res.status(400).send({ 
        //     status: false, 
        //     message: "logo link is invalid" 
        // })

        const findCollegeName = await collegeModel.findOne({ name })
        if (findCollegeName) return res.status(400).send({
            status: false,
            message: `${name} is already registered`
        })

        // CREATING THE COLLEGE FORM 
        const newCollege = await collegeModel.create(collegeData)
        res.status(201).send({
            status: true,
            message: "college created succesfully",
            data: newCollege
        })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}


// GET COLLEGE DETAILS   ===============>
const getCollegeDetails = async function (req, res) {
    try {
        let data = req.query

        if (!isValidRequestBody(data)) {
            return res.status(400).send({
                status: false,
                message: "please provide college name"
            })
        }

        let CollegeName = data.collegeName

        const getCollegeDetail = await collegeModel.findOne({
            name: CollegeName,
            isDeleted: false
        })

        console.log(getCollegeDetail)

        if (!getCollegeDetail) return res.status(404).send({
            status: false,
            message: "no college found with this college name please provide correct college name"
        })

        const collegeId = getCollegeDetail._id
        console.log(collegeId)

        const findIntern = await internModel.find({
            collegeId: collegeId,
            isDeleted: false
        }).select({ name: 1, email: 1, mobile: 1 })

        console.log(findIntern)

        let saveData = {
            name: getCollegeDetail.name,
            fullName: getCollegeDetail.fullName,
            logoLink: getCollegeDetail.logoLink,
            interns: findIntern
        }

        console.log(saveData)

        // 
        res.status(200).send({
            status: true,
            message: "college interns details",
            data: saveData
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}



module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails