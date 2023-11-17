const httpStatus = require('http-status');
const { Menues } = require('../models/menues.model');
const ApiError = require('../utils/ApiError');

const createMenues = async (menueBody) => {
  const { parentMenu } = menueBody;
  let parentName;
  if (parentMenu === '0' || parentMenu === null) {
    parentName = 'none';
  } else {
    const menu = await Menues.findById(parentMenu);
    parentName = menu.menuName;
  }
  let values = {};
  values = { ...menueBody, ...{ parentName: parentName } };
  return await Menues.create(values);
};
const getMenuesById = async (id) => {
  return Menues.findById(id);
};

const getAllMenues = async () => {
  return Menues.aggregate([
    {
      $lookup: {
        from: 'menues',
        localField: '_id',
        foreignField: 'parentMenu',
        as: 'child',
      },
    },
  ]);
};

const updateMenuesById = async (menueId, updateBody) => {
  let menue = await getMenuesById(menueId);
  if (!menue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Menues not found');
  }
  menue = await Menues.findByIdAndUpdate({ _id: menueId }, updateBody, { new: true });
  return menue;
};

const deleteMenueById = async (menueId) => {
  const menue = await getMenuesById(menueId);
  if (menue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Menues not found');
  }
  return menue;
};

module.exports = {
  createMenues,
  getAllMenues,
  getMenuesById,
  updateMenuesById,
  deleteMenueById,
};
