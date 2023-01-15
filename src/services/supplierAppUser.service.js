const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const supplierAppUser = require('../models/supplierAppUser.model')

const createSupplierAppUser = async (supplierAppUserBody) => {
  return supplierAppUser.create(supplierAppUserBody);
};

const getSupplierAppUserById = async (supplierAppUserId) => {
  return supplierAppUser.findById(supplierAppUserId);
};

const getAllSupplierAppUser = async () => {
  return supplierAppUser.find({ active: 'true' });
}

const getAllSupplierAppUserResponce = async (id) => {
  return supplierAppUser.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }]
      }
    },
    {
      $lookup:
      {
        from: 'supplierslots',
        localField: '_id',
        foreignField: 'supplierAppId',
        as: 'supplierslots.data'
      }
    },
    {
      $lookup:
      {
        from: 'supplierslotsubmits',
        localField: '_id',
        foreignField: 'supplierAppId',
        as: 'supplierslotsubmits.data'
      }
    },

  ])
}


const getAllSupplierAppUserResponceNotId = async () => {
  return supplierAppUser.aggregate([
    {
      $lookup:
      {
        from: 'supplierslots',
        localField: '_id',
        foreignField: 'supplierAppId',
        as: 'supplierslots.data'
      }
    },
    {
      $lookup:
      {
        from: 'supplierslotsubmits',
        localField: '_id',
        foreignField: 'supplierAppId',
        as: 'supplierslotsubmits.data'
      }
    },

  ])
}

const loginSupplierAppUserEmailAndPassword = async (email, dateOfBirth) => {
  const interviewerRegistration = await supplierAppUser.find({ email: email });
  let dob = interviewerRegistration[0].dateOfBirth.replace(/[^0-9\.]+/g, '');
  if (interviewerRegistration != '') {
    if (dob == dateOfBirth) {
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'DOB Not Match');
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'email Not Registored');
  }

  return interviewerRegistration;
};

const updateSupplierAppUserId = async (supplierAppUserId, updateBody) => {
  let Manage = await getSupplierAppUserById(supplierAppUserId);

  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ManageUser not found');
  }
  Manage = await supplierAppUser.findByIdAndUpdate({ _id: supplierAppUserId }, updateBody, { new: true });
  return Manage;
};

const deleteSupplierAppUserById = async (supplierAppUserId) => {
  const Manage = await getSupplierAppUserById(supplierAppUserId);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SupplierAppUser not found');
  }
  (Manage.active = false), (Manage.archive = true), await Manage.save();
  return Manage;
};

module.exports = {
  createSupplierAppUser,
  getAllSupplierAppUser,
  getSupplierAppUserById,
  loginSupplierAppUserEmailAndPassword,
  updateSupplierAppUserId,
  deleteSupplierAppUserById,
  getAllSupplierAppUserResponce,
  getAllSupplierAppUserResponceNotId,
};
