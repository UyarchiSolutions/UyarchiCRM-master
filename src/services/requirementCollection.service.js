const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { requirementCollection } = require('../models');
const axios = require('axios');

const createRequirementCollection = async (requirementCollectionBody) => {
return requirementCollection.create(requirementCollectionBody);
};


// const samedata = async () =>{
//   requirementCollection.aggregate([

//   ])
// }

const getAllRequirementCollection = async () => {
  return requirementCollection.aggregate([
    {
      $lookup:{
          from: "suppliers",  
          localField:"name",
          foreignField:"_id", 
          as: "suppliersData" 
      }
  },
  { $unwind:"$suppliersData" }, 
  {   
    $project:{
        _id : 1,
        type:1,
        name:'$suppliersData.primaryContactName',
        secretName:'$suppliersData.secretName',
        buyerpname:1,
        minrange:1,
        maxrange:1,
        minprice:1,
        maxprice:1,
        pdelivery:1,
        deliverylocation:1,
        buyerdeliverydate:1,
        supplierpname:1,
        stocklocation:1,
        stockposition:1,
        stockavailabilitydate:1,
        packtype:1,
        expquantity:1,
        expprice:1,
        paymentmode:1,
        supplierid:1,
        buyerid:1,
        selectboth:1,
        advance:1,
        Date:1,
        status:1,
        reasonCallback:1,
        dateCallback:1,
        feedbackCallback:1,
        statusAccept:1,
        aliveFeedback:1,
        deadFeedback:1,
        modificationFeedback:1,
        moderateStatus:1,
        editedPrice:1,
        moderateRejectReason:1,
        Slatitude:1,
        Slongitude:1,
        Blatitude:1,
        Blongitude:1,
        matchesstatus:1,
        active:1,
        archive:1
    } 
}
  ])
};

const getAllRequirementCollectionStatus = async () => {
  return requirementCollection.aggregate([
    {
      $match:{$or:[
        {$and:[{ status: { $eq: "Accepted" }},{statusAccept:{$ne:"Requirement dead"}}]},
  ]},
},
    {
      $lookup:{
          from: "suppliers",  
          localField:"name",
          foreignField:"_id", 
          as: "suppliersData" 
      }
  },
  { $unwind:"$suppliersData" }, 
  {   
    $project:{
        _id : 1,
        type:1,
        name:'$suppliersData.primaryContactName',
        secretName:'$suppliersData.secretName',
        buyerpname:1,
        minrange:1,
        maxrange:1,
        minprice:1,
        maxprice:1,
        pdelivery:1,
        deliverylocation:1,
        buyerdeliverydate:1,
        supplierpname:1,
        stocklocation:1,
        stockposition:1,
        stockavailabilitydate:1,
        packtype:1,
        expquantity:1,
        expprice:1,
        paymentmode:1,
        supplierid:1,
        buyerid:1,
        selectboth:1,
        advance:1,
        Date:1,
        status:1,
        reasonCallback:1,
        dateCallback:1,
        feedbackCallback:1,
        statusAccept:1,
        aliveFeedback:1,
        deadFeedback:1,
        modificationFeedback:1,
        moderateStatus:1,
        editedPrice:1,
        moderateRejectReason:1,
        Slatitude:1,
        Slongitude:1,
        Blatitude:1,
        Blongitude:1,
        matchesstatus:1,
        active:1,
        archive:1
    } 
}
  ])
};


const data = async()=>{
   return await requirementCollection.aggregate([
    {
      $match:{$or:[
        {$and:[{ type: { $eq: "Both" }},{ selectboth: { $eq: "Supplier" }},{ moderateStatus: { $eq: "Moderated" }},{ matchesstatus: { $eq: "Interested" }}]},
        {$and:[{ type: { $eq: "Supplier" }},{ moderateStatus: { $eq: "Moderated" }},{ matchesstatus: { $eq: "Interested" }}]},
  ]},
},
 {
      $lookup:{
        from: 'suppliers',
        localField: 'interestedBId',
        foreignField: '_id',
        as: 'suppliersData',
      }
    },
    {
      $unwind:'$suppliersData'
    },
   
  //   {
  //     $match:{$or:[
  //       {$and:[{ 'requirementcollectionsData.type': { $eq: "Both" }},{ 'requirementcollectionsData.selectboth': { $eq: "Supplier" }},{ 'requirementcollectionsData.moderateStatus': { $eq: "Moderated" }},{ 'requirementcollectionsData.matchesstatus': { $eq: "Interested" }}]},
  //       {$and:[{  'requirementcollectionsData.type': { $eq: "Supplier" }},{ 'requirementcollectionsData.moderateStatus': { $eq: "Moderated" }},{ 'requirementcollectionsData.matchesstatus': { $eq: "Interested" }}]},
  // ]},
// },
    {
      $project:{
        name:'$suppliersData.primaryContactName',
        _id:1,
        date:1,
        packtype:1,
        expquantity:1,
        expprice:1,
        paymentmode:1,
        supplierid:1, 
        buyerpname:1,
        minrange:1,
        maxrange:1,
        minprice:1,
        maxprice:1,
        pdelivery:1,
        deliverylocation:1,
        buyerdeliverydate:1,
        supplierpname:1,
        stocklocation:1,
        stockposition:1,
        stockavailability:1,
        buyerid:1,
        selectboth:1,
        advance:1,
        Date:1,
        status:1,
        reasonCallback:1,
        dateCallback:1,
        feedbackCallback:1,
        statusAccept:1,
        aliveFeedback:1,
        deadFeedback:1,
        modificationFeedback:1,
        moderateStatus:1,
        editedPrice:1,
        moderateRejectReason:1,
        Slatitude:1,
        Slongitude:1,
        Blatitude:1,
        Blongitude:1,
        matchesstatus:1,
        interestedBId:1,
        interestedDate:1,
        interestedProduct:1,
        active:1,
        archive:1
        
      }
    }


  ])
 
}
const buyerData = async ()=>{
  return await requirementCollection.aggregate([
    // {
    //   $match:{$and:[{ type: { $eq: "Supplier" }}]}
    // },
    {
      $match:{$or:[
        {$and:[{ type: { $eq: "Both" }},{ selectboth: { $eq: "Buyer" }}]},
        {$and:[{ type: { $eq: "Buyer" }}]},
  ]},
},
    // {
    //   $lookup:{
    //     from: 'requirementcollections',
    //     localField: 'supplierpname',
    //     foreignField: 'buyerpname',
    //     as: 'buyerdata',
    //   }
    // },

    // {
    //   $match:{$or:[
    //     {$and:[{'buyerdata':{$type: 'array', $ne: []}}]}]}
    // },
    {
      $lookup:{
          from: "suppliers",  
          localField:"name",
          foreignField:"_id", 
          as: "suppliersData" 
      }
  },
  { $unwind:"$suppliersData" }, 
 
    {
      $project:{
        _id : 1,
        type:1,
        SecretName:'$suppliersData.secretName',
        name:'$suppliersData.primaryContactName',
        mobileNumber:'$suppliersData.primaryContactNumber',
        BuyerId:"$suppliersData._id",
        date:1,
        packtype:1,
        expquantity:1,
        expprice:1,
        paymentmode:1,
        supplierid:1, 
        buyerpname:1,
        minrange:1,
        maxrange:1,
        minprice:1,
        maxprice:1,
        pdelivery:1,
        deliverylocation:1,
        buyerdeliverydate:1,
        supplierpname:1,
        stocklocation:1,
        stockposition:1,
        stockavailability:1,
        buyerid:1,
        selectboth:1,
        advance:1,
        Date:1,
        status:1,
        reasonCallback:1,
        dateCallback:1,
        feedbackCallback:1,
        statusAccept:1,
        aliveFeedback:1,
        deadFeedback:1,
        modificationFeedback:1,
        moderateStatus:1,
        editedPrice:1,
        moderateRejectReason:1,
        Slatitude:1,
        Slongitude:1,
        Blatitude:1,
        Blongitude:1,
        matchesstatus:1,
        active:1,
        archive:1
      }
    },
  ])
}

const BuyerSearch = async (id) =>{
   const data = requirementCollection.find({name:id}).select('buyerpname')
   if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementCollection not found');
   }
   return data
}

const getmaxmin = async (product,fromprice,toprice,fromquantity,toquantity,destination,page)=>{

  let match ;
  if(product != 'null' && fromprice == 'null' && toprice == 'null' && fromquantity == 'null' && toquantity == 'null' && destination == 'null'){
    match =[{supplierpname:{$eq:product}},{active:{$eq:true}}]
 }
  else if(product != 'null' && fromprice != 'null' && toprice != 'null' && fromquantity == 'null' && toquantity == 'null' && destination == 'null'){
     match =[{supplierpname:{$eq:product}},{editedPrice:{$gte:parseInt(fromprice)}},{editedPrice:{$lte:parseInt(toprice)}},{active:{$eq:true}}]
  }
  else if(product != 'null' && fromprice != 'null' && toprice != 'null' && fromquantity != 'null' && toquantity != 'null' && destination == 'null'){
  match =[{supplierpname:{$eq:product}},{editedPrice:{$gte:parseInt(fromprice)}},{editedPrice:{$lte:parseInt(toprice)}},{expquantity:{$gte:parseInt(fromquantity)}},{expquantity:{$lte:parseInt(toquantity)}},{active:{$eq:true}}]
  }
  // else if(product != 'null' && fromprice != 'null' && toprice != 'null' && fromquantity != 'null' && toquantity != 'null' && destination != 'null'){
  //   match =[{supplierpname:{$eq:product}},{editedPrice:{$gte:parseInt(fromprice)}},{editedPrice:{$lte:parseInt(toprice)}},{expquantity:{$gte:parseInt(fromquantity)}},{expquantity:{$lte:parseInt(toquantity)}},{expquantity:{$eq:destination}},{active:{$eq:true}}]
  //   }
  else{
    match=[{ supplierpname: { $ne: null }},{active:{$eq:true}}]
  }
  console.log(match)
  const mat = await requirementCollection.aggregate([
    // {
    //   $match:{$and:[{ type: { $eq: "Supplier" }}]}
    // },
    {
      $match:{$or:[
        {$and:[{ type: { $eq: "Both" }},{ selectboth: { $eq: "Supplier" }},{ moderateStatus: { $eq: "Moderated" }}]},
        {$and:[{ type: { $eq: "Supplier" }},{ moderateStatus: { $eq: "Moderated" }}]},
  ]},
},
    // {
    //   $lookup:{
    //     from: 'requirementcollections',
    //     localField: 'supplierpname',
    //     foreignField: 'buyerpname',
    //     as: 'buyerdata',
    //   }
    // },

    // {
    //   $match:{$or:[
    //     {$and:[{'buyerdata':{$type: 'array', $ne: []}}]}]}
    // },
    {
      $lookup:{
          from: "suppliers",  
          localField:"name",
          foreignField:"_id", 
          as: "suppliersData" 
      }
  },
  { $unwind:"$suppliersData" }, 

   {
      $match: {
        $and: match,
      },
    },
 
    {
      $project:{
        _id : 1,
        type:1,
        SecretName:'$suppliersData.secretName',
        name:'$suppliersData.primaryContactName',
      date:1,
        packtype:1,
        expquantity:1,
        expprice:1,
        paymentmode:1,
        supplierid:1,  buyerpname:1,
        minrange:1,
        maxrange:1,
        minprice:1,
        maxprice:1,
        pdelivery:1,
        deliverylocation:1,
        buyerdeliverydate:1,
        supplierpname:1,
        stocklocation:1,
        stockposition:1,
        stockavailability:1,
        buyerid:1,
        selectboth:1,
        advance:1,
        Date:1,
        status:1,
        reasonCallback:1,
        dateCallback:1,
        feedbackCallback:1,
        statusAccept:1,
        aliveFeedback:1,
        deadFeedback:1,
        modificationFeedback:1,
        moderateStatus:1,
        editedPrice:1,
        moderateRejectReason:1,
        Slatitude:1,
        Slongitude:1,
        Blatitude:1,
        Blongitude:1,
        matchesstatus:1,
        active:1,
        archive:1
      }
    },
    {
      $skip:10*parseInt(page)
    },
   {
      $limit:10
    },

    // { $sort: { 'buyerdata.editedPrice':{$eq:}, <field2>: sort order } }
  ])
  const count = await requirementCollection.aggregate([
    // {
    //   $match:{$and:[{ type: { $eq: "Supplier" }}]}
    // },
    {
      $match:{$or:[
        {$and:[{ type: { $eq: "Both" }},{ selectboth: { $eq: "Supplier" }},{ moderateStatus: { $eq: "Moderated" }}]},
        {$and:[{ type: { $eq: "Supplier" }},{ moderateStatus: { $eq: "Moderated" }}]},
  ]},
},
    // {
    //   $lookup:{
    //     from: 'requirementcollections',
    //     localField: 'supplierpname',
    //     foreignField: 'buyerpname',
    //     as: 'buyerdata',
    //   }
    // },

    // {
    //   $match:{$or:[
    //     {$and:[{'buyerdata':{$type: 'array', $ne: []}}]}]}
    // },
  //   {
  //     $lookup:{
  //         from: "suppliers",  
  //         localField:"name",
  //         foreignField:"_id", 
  //         as: "suppliersData" 
  //     }
  // },
  // { $unwind:"$suppliersData" }, 

   {
      $match: {
        $and: match,
      },
    },
 
  
  ])
  // console.log(mat)
  return {data:mat,count:count.length}

}


const productAll = async () => {
  return requirementCollection.aggregate([
    {
      $match:{$or:[
        {$and:[{ type: { $eq: "Both" }},{ selectboth: { $eq: "Buyer" }}]},
        {$and:[{ type: { $eq: "Buyer" }}]},
  ]},
     },
  ])
}

const getAllRequirementCollectionDelete = async () => {
  return requirementCollection.find();
};

const getRequirementCollectionById = async (requirementId) => {
  const requirement = requirementCollection.findById(requirementId);
  if (!requirement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementCollection Not Found');
  }
  return requirement;
};

const updateRequirementCollectionById = async (requirementId, updateBody) => {
  let requirementUpdate = await getRequirementCollectionById(requirementId);
  if (!requirementUpdate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementCollection not found');
  }
  requirementUpdate = await requirementCollection.findByIdAndUpdate({ _id: requirementId }, updateBody, { new: true });
  return requirementUpdate;
};

const deleteRequirementCollectionById = async (requirementId) => {
  const requirementDelete = await getRequirementCollectionById(requirementId);
  if (!requirementDelete) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementCollection not found');
  }
  (requirementDelete.active = false), (requirementDelete.archive = true), await requirementDelete.save();
  return requirementDelete;
};


// thirdpartyApi's
const UyarchiApi = async () => {
  let response = await axios.get(`https://kapture.click/v1/category/product/category`)
 return response.data
};

const UyarchiApiProduct = async () => {
  let response = await axios.get(`https://kapture.click/v1/product`)

 return response.data
};

const groupMap = async (from,to,id) => {

  let response = await axios.get(
   `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from}&destinations=${to}&key=${id}`
 )
// console.log(response.data)
return response.data
}

module.exports = {
  createRequirementCollection,
  getAllRequirementCollection,
  getAllRequirementCollectionDelete,
  getRequirementCollectionById,
  updateRequirementCollectionById,
  deleteRequirementCollectionById,
  UyarchiApi,
  getmaxmin,
  productAll,
  UyarchiApiProduct,
  getAllRequirementCollectionStatus,
  groupMap,
   data,
   buyerData,
   BuyerSearch,
};
