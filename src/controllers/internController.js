const {isValid,isValidRequestBody} = require("./collegeController")
const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

// const isValid = function (value) {
//   if (typeof value === "undefined" || value === null) return false;
//   if (typeof value === "string" && value.trim().length === 0) return false;
//   return true;
// };

// const isValidRequestBody = function (requestbody) {
//   return Object.keys(requestbody).length > 0;
// };


//---------------------------------------------------------------------------------------


const createInterns = async function (req, res) {
  try {

    const requestBody = req.body;

    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request parameters. Please provide Intern Details",
      });
    }


    //Extract Params
    const { name, email, mobile, collegeId, isDeleted } = requestBody;


    //Validation Starts
    if (!isValid(name)) {
      res.status(400).send({ status: false, msg: "Intern name is required" });
      return;
    }
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Intern email required" });
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      res
        .status(400)
        .send({
          status: false,
          message: `Email should be a valid email address`
        });
      return;
    }

    const isEmailAlreadyUsed = await internModel.findOne({ email }); // {email: email} object shorthand property


    if (isEmailAlreadyUsed) {
      res.status(400).send({
        status: false,
        message: `${email} email address is already registered`
      });
      return;
    }


    if (!isValid(mobile)) {
      res.status(400).send({ status: false, msg: "Mobile Number is required" });
      return;
    }


    //if (!/^[0-9]\d{9}$/gi.test(mobile)) {
    //if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(mobile)) {
    if (!/^\+(?:[0-9] ?){10,12}[0-9]$/.test(mobile)) {
      res.status(400).send({
        status: false,
        message: `Mobile should be a valid number`
      });
      return;
    }


    const isMobileNumberAlreadyUsed = await internModel.findOne({ mobile }); // {mobile: mobile} object shorthand property


    if (isMobileNumberAlreadyUsed) {
      res.status(400).send({ status: false, message: `${mobile} mobile number is already registered`, });
      return;
    }


    if (isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, message: "Cannot input isDeleted as true while registering" });
    }

    //-------------------------------------------------------------------------------------------
    if (!isValid(collegeId)) {
      res.status(400).send({ status: false, msg: "College ID is required" });   //body
      return;
    }
    //----------------------------------------------------------------------------------------------

    //Validation ends


    //Validating College ID
    const isValidCollegeId = await collegeModel.findOne({ _id: collegeId, isDeleted: false });

    if (!isValidCollegeId) {
      res.status(400).send({ status: false, msg: `It is not a valid College ID` });
      return;
    }


    const newIntern = await internModel.create(requestBody)
    const updateResponse =await internModel.findOne(newIntern).select({createdAt: 0, updatedAt: 0, __v: 0,_id:0})
    res.status(201).send({
      status: true, msg: "New Intern created successfully", data: updateResponse
    });

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createInterns = createInterns;