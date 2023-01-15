const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { adminRegistration } = require('../models');
const ApiError = require('../utils/ApiError');


const createadminRegistration = async (adminRegistrationBody) => {
  const { password, confirmPassword } = adminRegistrationBody
  if(password !== confirmPassword){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password Does Not Match 😞');
  }
  return adminRegistration.create(adminRegistrationBody);
};

const getadminRegistrationByEmail = async (email) => {
  return adminRegistration.findOne({ email });
};

const loginadminRegistrationWithEmailAndPassword = async (email, password) => {
  const adminRegistration = await getadminRegistrationByEmail(email);
  if (!adminRegistration || !(await adminRegistration.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return adminRegistration;
};

// const queryInterviewerRegistration = async (filter, options) => {
//   const interviewerRegistration = await InterviewerRegistration.paginate(filter, options);
//   return interviewerRegistration;
// };

// const getInterviewerRegistrationId = async (id) => {
//   const interviewerData = await interviewerRegistration.findById(id)
//   if(!interviewerData){
//     throw new ApiError(httpStatus.NOT_FOUND, 'Interviewer not found')
//   }
//   let interviewDetail = ""
//   let interview = ""
//   let technology = ""
//   let additional = ""
//   let communication = ""
//   let functional = ""

//   let interviewDetails = await InterviewerWorkStatus.find()
//   let interviewShedul =  await interviewshedule.find()
//   let technologys = await InterviewtechnologySkill.find()
//   let additionals = await InterviewAdditionalSkill.find()
//   let communications = await  InterviewcommunicationSkill.find()
//   let functionalSkills = await InterviewFunctionalSkill.find()


//   let Detailmap = interviewDetails.map((e)=>{
//     if(e.interviewId == id){
//       interviewDetail = e.interviewId
//     }
//   })

//   let shedulemap = interviewShedul.map((e)=>{
//     if(e.interviewId == id){
//       interview = e.interviewId
//     }
//   })
//   let functionalmap= functionalSkills.map((e)=>{
//     if(e.interviewId == id){
//       functional = e.interviewId
//     }
//   })
//   let communicationsmap = communications.map((e)=>{
//     if(e.interviewId == id){
//       communication = e.interviewId
//     }
//   })
//   let technologysmap = technologys.map((e)=>{
//     if(e.interviewId == id){
//       technology = e.interviewId
//     }
//   })
//   let additionalsmap = additionals.map((e)=>{
//     if(e.interviewId == id){
//       additional = e.interviewId
//     }
//   })

 
//   let technologySkills = await InterviewtechnologySkill.find({interviewId:technology})
//   interviewerData.technologySkill = technologySkills

//   let additionalSkills = await InterviewAdditionalSkill.find({interviewId:additional})
//   interviewerData.additionalSkill = additionalSkills

//   let communicationSkills = await InterviewcommunicationSkill.find({interviewId:communication})
//   interviewerData.communicationSkill = communicationSkills

//   let functionals = await InterviewFunctionalSkill.find({interviewId:functional})
//   interviewerData.functionalSkill = functionals


//   let det = await InterviewerWorkStatus.find({interviewId:interviewDetail})
//   interviewerData.workStatus =  det

//   let shedule = await interviewshedule.find({interviewId:interview})
//   interviewerData.interviewShedule =  shedule

//   return interviewerData

// };

// const getSameInterviewRegistartion = async(id)=>{
//   const interviewerData = await interviewerRegistration.findById(id)
//   //  console.log(interviewerData._id)
 
//   if(!interviewerData){
//     throw new ApiError(httpStatus.NOT_FOUND, 'Interviewer not found')
//   }

//   let funid = ""

//   let functionalSkills = await InterviewFunctionalSkill.find({interviewId:interviewerData._id})
//   let functionalSkillsss = await functionalSkill.find()
//   //  console.log(functionalSkillsss)

//   let arr ={}

//   let ggj = functionalSkillsss.map((e)=>{
//     for(let i =0;i<functionalSkillsss.length;i++){
//       if(e.functionalSkillsss[i].functionalSkill1.functionalSkill == functionalSkills.functionalSkill1.functionalSkill){
//         arr ={...e.functionalSkillsss[i]}
//         // let jjjj = await functionalSkill.find({userId:e.userId})
        
//     }
//     }
   
//    })

//   //  console.log(arr)

//   return interviewerData

// }


// const getInterviewerRegistration = async()=>{
//   return interviewerRegistration.find();
// } 
// const updateInterviewerRegistrationById = async (interviewerRegistrationId, updateBody) => {
//   const interviewersRegistration = await getInterviewerRegistrationId(interviewerRegistrationId);
//   // console.log(interviewersRegistration.uploadResume)
//   if (!interviewersRegistration) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'InterviewerRegistration not found');
//   }
//   if (updateBody.email && (await interviewerRegistration.isEmailTaken(updateBody.email, interviewerRegistrationId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   // console.log(JSON.stringify(updateBody));
//   const updatedInterviewerRegistration = await interviewerRegistration.findOneAndUpdate({ _id: interviewerRegistrationId }, updateBody, { new: true });
//   // console.log(updatedInterviewerRegistration.uploadResume);
//   await updatedInterviewerRegistration.save();
//   return updatedInterviewerRegistration;
// };
// const deleteInterviewerRegistrationById = async (interviewerRegistrationId) => {
//   const interview = await getInterviewerRegistrationById(interviewerRegistrationId);
//   if (!interview ) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'InterviewRegistration  not found');
//   }
//   (interview.active = false), (interview.archive = true), await interview.save();
//   return interview;
// };

// const resetPassword = async (interviewerRegistrationId, newPassword) => {
//   const interviewerRegistration = await getVendorById(interviewerRegistrationId);
//   if (!interviewerRegistration) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'InterviewerRegistration not found');
//   }
//   const password = await bcrypt.hash(newPassword, 8);
//   const resetedPassword = await interviewerRegistration.findOneAndUpdate({ _id: interviewerRegistrationId }, { password });
//   await resetedPassword.save();
//   return resetedPassword;
// };

// const changePassword = async (interviewerRegistrationId, oldPassword, newPassword) => {
//   const interviewerRegistration = await getCustomerById(interviewerRegistrationId);
//   if (!interviewerRegistration) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'InterviewerRegistration not found');
//   }
//   const isPasswordMatched = await interviewerRegistration.isPasswordMatch(oldPassword);
//   if (!isPasswordMatched) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Password doesn't Match");
//   }
//   const password = await bcrypt.hash(newPassword, 8);
//   const updatedPassword = await interviewerRegistration.findOneAndUpdate({ _id: interviewerRegistrationId }, { password });
//   await updatedPassword.save();
//   return updatedPassword;
// }

module.exports = {
  // createInterviewerRegistration,
  // getInterviewerRegistrationByEmail,
  // loginInterviewerRegistrationWithEmailAndPassword,
  // queryInterviewerRegistration,
  // getInterviewerRegistrationId,
  // deleteInterviewerRegistrationById,
  // getInterviewerRegistration,
  // updateInterviewerRegistrationById,
  // resetPassword,
  // changePassword,
  // getSameInterviewRegistartion
  loginadminRegistrationWithEmailAndPassword,
  getadminRegistrationByEmail,
  createadminRegistration
};
