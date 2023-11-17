const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const menueSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    menuName: {
      type: String,
    },
    route: {
      type: String,
    },
    parentMenu: {
      type: String,
    },
    parentName: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  }
);
menueSchema.plugin(toJSON);
menueSchema.plugin(paginate);
const Menues = mongoose.model('Menues', menueSchema);

module.exports = {Menues};
