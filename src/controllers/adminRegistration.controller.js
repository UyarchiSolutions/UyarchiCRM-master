const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adminRegistrationService, tokenService } = require('../services');

const createadminRegistrationService = catchAsync(async (req, res) => {
  const adminRegistartion = await adminRegistrationService.createadminRegistration(req.body)
  res.status(httpStatus.CREATED).send(adminRegistartion)
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const adminRegistartion = await adminRegistrationService.loginadminRegistrationWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(adminRegistartion);
  let options = {
    httpOnly : true,
  }
  res.cookie("token", tokens.access.token, options)
  res.send({ adminRegistartion, tokens });
});

// const getcustomer = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'code']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   filter.active = true;
//   const result = await oemService.queryOems(filter, options);
//   res.send(result);
// });

// const getInterviewerRegistrationById = catchAsync(async (req, res) => {
//   const interviewerRegistration = await interviewerRegistrationService.getInterviewerRegistrationId(req.params.interviewerRegistrationId);
//   if (!interviewerRegistration) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'InterviewerRegistration not found');
//   }
//   res.send(interviewerRegistration);
// });

// const getSameInterviewRegistration = catchAsync(async(req,res)=>{
//   const interviewerRegistration = await interviewerRegistrationService.getInterviewerRegistrationId(req.params.interviewerRegistrationId);
//   if (!interviewerRegistration) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'InterviewerRegistration not found');
//   }
//  data =interviewerRegistration.functionalSkill[0].functionalSkill1[0].functionalSkill
//  data1 = interviewerRegistration.functionalSkill[0].functionalSkill2[0].functionalSkill   
//  exp = interviewerRegistration.functionalSkill[0].functionalSkill1[0].experience
//  exp1 = interviewerRegistration.functionalSkill[0].functionalSkill2[0].experience

//  values=[];
//  let functionalSkills = await functionalSkill.find()
// //  console.log(functionalSkills[0].functionalSkill1[0].functionalSkill)
// //  for(let i=0;i<=functionalSkills.length;i++){
// //   if(functionalSkills[i].functionalSkill1[0].functionalSkill == data){
// //     values={...functionalSkills[i]}
// //     }
// //  }
// functionalSkills.forEach((element)=>{
//       // console.log(element.functionalSkill1[0].functionalSkill)
//       if((element.functionalSkill1[0].functionalSkill == data &&  (element.functionalSkill1[0].experience == "0-1" && exp == "3-5" || element.functionalSkill1[0].experience == "1-3" && exp == "5-7" ||  element.functionalSkill1[0].experience == "3-5" && exp == "7-10" ||  element.functionalSkill1[0].experience == "5-10" && exp == "10-15"||  element.functionalSkill1[0].experience == "10-15" && exp == "15-20" ||  element.functionalSkill1[0].experience == "Above 15" && exp =="Above 20"))
//       || (element.functionalSkill2[0].functionalSkill == data && (element.functionalSkill2[0].experience == "0-1" && exp == "3-5" || element.functionalSkill2[0].experience == "1-3" && exp == "5-7" ||  element.functionalSkill2[0].experience == "3-5" && exp == "7-10" ||  element.functionalSkill2[0].experience == "5-10" && exp == "10-15"||  element.functionalSkill2[0].experience == "10-15" && exp == "15-20" ||  element.functionalSkill2[0].experience == "Above 15" && exp =="Above 20"))
//       || (element.functionalSkill1[0].functionalSkill == data1 && (element.functionalSkill1[0].experience == "0-1" && exp1 == "3-5" || element.functionalSkill1[0].experience == "1-3" && exp1 == "5-7" ||  element.functionalSkill1[0].experience == "3-5" && exp1 == "7-10" ||  element.functionalSkill1[0].experience == "5-10" && exp1 == "10-15"||  element.functionalSkill1[0].experience == "10-15" && exp1 == "15-20" ||  element.functionalSkill1[0].experience == "Above 15" && exp1 =="Above 20")) 
//       || (element.functionalSkill2[0].functionalSkill == data1 && (element.functionalSkill2[0].experience == "0-1" && exp1 == "3-5" || element.functionalSkill2[0].experience == "1-3" && exp1 == "5-7" ||  element.functionalSkill2[0].experience == "3-5" && exp1 == "7-10" ||  element.functionalSkill2[0].experience == "5-10" && exp1 == "10-15"||  element.functionalSkill2[0].experience == "10-15" && exp1 == "15-20" ||  element.functionalSkill2[0].experience == "Above 15" && exp1 =="Above 20"))){
//         values.push(element);
//         // count +=1;
//         // console.log(element.functionalSkill1[0].functionalSkill)
//         // console.log(count)
//       }
// })
//   // console.log(values)
//   res.send(values);
// });
// const getInterviewerRegistration = catchAsync (async (req,res)=>{
//   const  interviewerRegistration = await  interviewerRegistrationService.getInterviewerRegistration(req.params);
//   if(!interviewerRegistration){
//     throw new ApiError(httpStatus.NOT_FOUND, "InterviewerRegistration Not Available ")
//   }
//   res.send(interviewerRegistration)
// })

// const getSameInterviewerRegistration = catchAsync (async (req,res)=>{
//   const  interviewerRegistration = await  interviewerRegistrationService.getSameInterviewRegistartion(req.params.interviewerRegistrationId);
//   if(!interviewerRegistration){
//     throw new ApiError(httpStatus.NOT_FOUND, "InterviewerRegistration Not Available ")
//   }
//   res.send(interviewerRegistration)
// })


// const listInterviewerRegistration = catchAsync(async (req, res) => {
//   const results = await interviewerRegistrationService.getInterviewerRegistration();
//   res.send(results);
// });

// const updateInterviewerRegistrationById = catchAsync(async (req, res) => {
//   const interviewerRegistration = await interviewerRegistrationService.updateInterviewerRegistrationById(req.params.interviewerRegistrationId, req.body);
//   let filenameempty="";
//   let inter = interviewerRegistration
//   let path = '';
//   if (req.files) {
//     req.files.forEach(function (files, index, arr) {
//       path = "resumes/"+files.filename
//       filenameempty=files.filename
//     });
//   }
//   if(filenameempty == ""){
//     interviewerRegistration.uploadResume = inter.uploadResume;
//   }else{
//     interviewerRegistration.uploadResume = path;

//   }
//   res.send(interviewerRegistration);
//   await interviewerRegistration.save();
// });



// const deleteInterviewerRegistration = catchAsync(async (req, res) => {
//   await interviewerRegistrationService.deleteInterviewerRegistrationById(req.params.interviewerRegistrationId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const resetPassword = catchAsync(async (req, res) => {
//   await interviewerRegistrationService.resetPassword(req.params.interviewerRegistrationId, req.body.newPassword);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// const changePassword = catchAsync(async (req, res) => {
//   await interviewerRegistrationService.changePassword(req.params.interviewerRegistrationId, req.body.oldPassword, req.body.newPassword);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  // createInterviewerRegistration,
  login,
  createadminRegistrationService,
  // deleteInterviewerRegistration,
  // getInterviewerRegistrationById,
  // getInterviewerRegistration,
  // listInterviewerRegistration,
  // resetPassword,
  // changePassword,
  // updateInterviewerRegistrationById,
  // getSameInterviewerRegistration,
  // getSameInterviewRegistration
};