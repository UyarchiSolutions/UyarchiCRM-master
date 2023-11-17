const httpStatus = require('http-status');
const { Roles } = require('../models/roles.model');
const MenueAssign = require('../models/menuAssign.model');
const ApiError = require('../utils/ApiError');
const { Menues } = require('../models/menues.model');
const moment = require('moment');

const createRoles = async (rolesBody) => {
  return Roles.create(rolesBody);
};

const getAllRoles = async () => {
  return Roles.find();
};

// const queryRoles = async (filter, options) => {
//   return Roles.paginate(filter, options);
// };

const mainWarehouseRoles = async () => {
  const roles = await Roles.find({ addMainWH: true });
  //console.log(roles);
  if (!roles) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There is No Roles Available For Main WhareHouse Admin');
  }
  return roles;
};

const getRolesById = async (id) => {
  const role = Roles.findById(id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roles  Not Found');
  }
  return role;
};

const getMenu = async (id) => {
  // const role = Roles.findById(id);
  // if (!role) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Roles  Not Found');
  // }
  let menues = await Menues.aggregate([
    {
      $lookup: {
        from: 'menueassigns',
        localField: '_id',
        foreignField: 'menuid',
        pipeline: [
          {
            $match: {
              rolesId: id
            }
          }
        ],
        as: 'menueassigns',
      },
    },
    {
      $unwind: {
        path: '$menueassigns',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        menuName: 1,
        route: 1,
        parentMenu: 1,
        read: "$menueassigns.read",
        write: "$menueassigns.write",
        update: "$menueassigns.update",
        delete: "$menueassigns.delete",
        point: "$menueassigns.point",
      }
    }
  ]);
  return menues;
};

const updateRolesById = async (roleId, updateBody) => {
  // const role = await MenueAssign.deleteMany({ rolesId: roleId })
  try {
    await MenueAssign.deleteMany({ rolesId: roleId })
  } catch (e) {
    print(e);
  }
  updateBody.forEach(async (e) => {
    //console.log(e)
    if (e.read || e.write || e.update || e.delete) {
      await MenueAssign.create({
        rolesId: roleId,
        menuid: e.menuid,
        read: e.read == null ? false : e.read,
        write: e.write == null ? false : e.write,
        update: e.update == null ? false : e.update,
        delete: e.delete == null ? false : e.delete,
        point: e.point==null?100:e.point,
      })
    }
  })
  return updateBody;
};

const deleterolesById = async (roleId) => {
  const roles = await getLoadingExecuteById(roleId);
  if (!roles) {
    throw new ApiError(httpStatus.NOT_FOUND, 'roles not found');
  }
  (roles.active = false), (roles.archive = true), await roles.save();
  return roles;
};

const getroleWardAdmin = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Admin Sales Manager (WASM)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        //   pipeline:[
        //     {
        //       $lookup: {
        //         from: 'wardadminroles',
        //         let: {
        //           localField: '$_id',
        //         },
        //         pipeline: [{ $match: { $expr: { $eq: ['$b2bUserId', '$$localField'] } } }],
        //         as: 'wardadminrolesData',
        //       },
        //     },
        //     {
        //       $unwind: {
        //         path: '$wardadminrolesData',
        //         preserveNullAndEmptyArrays: true,
        //       },
        //     },
        //  ],
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        _id: 1,
        // wardadminrolesData:'$b2busersData.wardadminrolesData'
      },
    },
    // {
    //   $match: { wardadminrolesData: { $eq: null } },
    // },
  ]);
  return data;
};

// notAssignTonneValueSalesmanager
const notAssignTonneValueSalesmanager = async () => {
  let serverdate = moment().format('yyy-MM-DD');
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Admin Sales Manager (WASM)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        pipeline: [
          {
            $lookup: {
              from: 'wardadminroles',
              let: {
                localField: '$_id',
              },
              pipeline: [
                { $match: { $expr: { $eq: ['$b2bUserId', '$$localField'] } } },
                {
                  $match: {
                    $and: [{ date: { $eq: serverdate } }],
                  },
                },
              ],
              as: 'wardadminrolesData',
            },
          },
          // {
          //   $unwind:'$wardadminrolesData',
          //     // preserveNullAndEmptyArrays: true,
          // },
        ],
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        _id: 1,
        // wardadminrolesData:'$b2busersData.wardadminrolesData'
        b2user: '$b2busersData.wardadminrolesData',
      },
    },
    {
      $match: { $and: [{ b2user: { $type: 'array', $ne: [] } }] },
    },
  ]);
  return data;
};

const getroleWardAdminAsm = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        // pipeline: [
        //   {
        //     $lookup: {
        //       from: 'wardadminroleasms',
        //       let: {
        //         localField: '$_id',
        //       },
        //       pipeline: [{ $match: { $expr: { $eq: ['$b2bUserId', '$$localField'] } } }],
        //       as: 'wardadminroleasmsData',
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: '$wardadminroleasmsData',
        //       preserveNullAndEmptyArrays: true,
        //     },
        //   },
        // ],
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },

    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        _id: 1,
        // wardadminroleasmsData: '$b2busersData.wardadminroleasmsData',
      },
    },
    // {
    //   $match: { wardadminroleasmsData: { $eq: null } },
    // },
  ]);
  return data;
};

const getAlldataSalesManager = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Admin Sales Manager (WASM)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        _id: 1,
      },
    },
  ]);
  return data;
};

const getAlldataSalesMan = async (page) => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        pipeline: [
          {
            $match: {
              $or: [
                { salesManagerStatus: { $ne: 'Assign' } },
                { salesManagerStatus: { $eq: null } },
                { salesManagerStatus: { $eq: 'Reassign' } },
              ],
            },
          },
        ],
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        mobileNumber: '$b2busersData.phoneNumber',
        email: '$b2busersData.email',
        roleName: 1,
        _id: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        pipeline: [
          {
            $match: {
              $or: [
                { salesManagerStatus: { $ne: 'Assign' } },
                { salesManagerStatus: { $eq: null } },
                { salesManagerStatus: { $eq: 'Reassign' } },
              ],
            },
          },
        ],
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        mobileNumber: '$b2busersData.phoneNumber',
        email: '$b2busersData.email',
        roleName: 1,
        _id: 1,
      },
    },
  ]);
  let over = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        mobileNumber: '$b2busersData.phoneNumber',
        email: '$b2busersData.email',
        roleName: 1,
        _id: 1,
      },
    },
  ]);
  return { data, total: total.length, overallCount: over.length };
};

// get all salesman
const getsalesman = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: 'b2busersData._id',
        foreignField: 'fromSalesManId',
        pipeline: [{
          $match: {
            $or: [
              {
                $and: [
                  { status: { $eq: 'Assign' } },
                ],
              },
            ],
          },
        },
        ],
        as: 'salesmanshops',
      },
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: 'b2busersData._id',
        foreignField: 'salesManId',
        pipeline: [{
          $match: {
            $or: [
              {
                $and: [
                  { status: { $eq: 'tempReassign' } },
                ],
              },
            ],
          },
        },
        ],
        as: 'salesmanshopsdata',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'b2busersData._id',
        foreignField: 'DA_USER',
        as: 'b2bshopclones',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'b2busersData._id',
        foreignField: 're_Uid',
        as: 'b2bshopclones_re',
      },
    },

    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'b2busersData._id',
        foreignField: 'Uid',
        pipeline: [
          {
            $match: {
              $and: [
                {
                  daStatus: { $in: ['Not Interested', 'Cannot Spot the Shop'] }
                },
              ]
            }
          }
        ],
        as: 'b2bshopclones_re_not',
      },
    },

    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'b2busersData._id',
        foreignField: 're_Uid',
        pipeline: [
          {
            $match: {
              $and: [
                {
                  Re_daStatus: { $ne: null }
                },
              ]
            }
          }
        ],
        as: 'b2bshopclones_re_da',
      },
    },

    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'b2busersData._id',
        foreignField: 'Uid',
        pipeline: [
          {
            $match: {
              $and: [
                {
                  Re_daStatus: { $ne: null }
                },
              ]
            }
          }
        ],
        as: 'b2bshopclones_re_not_da',
      },
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        assigncount: { $size: "$salesmanshops" },
        tempcount: { $size: "$salesmanshopsdata" },
        DA_count: { $size: "$b2bshopclones" },
        re_assgin: { $size: "$b2bshopclones_re" },
        re_assgin_da: { $size: "$b2bshopclones_re_da" },
        not_intrested: { $size: "$b2bshopclones_re_not" },
        not_intrested_da: { $size: "$b2bshopclones_re_not_da" },
        total_re: { $add: [{ $size: "$b2bshopclones_re" }, { $size: "$b2bshopclones_re_not" }] },
        total_re_da: { $add: [{ $size: "$b2bshopclones_re_da" }, { $size: "$b2bshopclones_re_not_da" }] },
        count: { $add: [{ $size: "$salesmanshops" }, { $size: "$salesmanshopsdata" }] },
        _id: 1,
      },
    },
  ]);
  return data;
};

// get all telecaller

const gettelecaller = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: "Ward CCE(WCCE)" } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $lookup: {
        from: 'telecallershops',
        localField: 'b2busersData._id',
        foreignField: 'fromtelecallerteamId',
        pipeline: [{
          $match: {
            $or: [
              {
                $and: [
                  { status: { $eq: 'Assign' } },
                ],
              },
            ],
          },
        },
        ],
        as: 'salesmanshops',
      },
    },
    {
      $lookup: {
        from: 'telecallershops',
        localField: 'b2busersData._id',
        foreignField: 'telecallerteamId',
        pipeline: [{
          $match: {
            $or: [
              {
                $and: [
                  { status: { $eq: 'tempReassign' } },
                ],
              },
            ],
          },
        },
        ],
        as: 'salesmanshopsdata',
      },
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        assigncount: { $size: "$salesmanshops" },
        tempcount: { $size: "$salesmanshopsdata" },
        count: { $add: [{ $size: "$salesmanshops" }, { $size: "$salesmanshopsdata" }] },
        _id: 1,
      },
    },
  ]);
  return data;
};

// get all salesmanOrder

const getsalesmanOrder = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $lookup: {
        from: 'salesmanordershops',
        localField: 'b2busersData._id',
        foreignField: 'fromsalesmanOrderteamId',
        pipeline: [{
          $match: {
            $or: [
              {
                $and: [
                  { status: { $eq: 'Assign' } },
                ],
              },
            ],
          },
        },
        ],
        as: 'salesmanshops',
      },
    },
    {
      $lookup: {
        from: 'salesmanordershops',
        localField: 'b2busersData._id',
        foreignField: 'salesmanOrderteamId',
        pipeline: [{
          $match: {
            $or: [
              {
                $and: [
                  { status: { $eq: 'tempReassign' } },
                ],
              },
            ],
          },
        },
        ],
        as: 'salesmanshopsdata',
      },
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        assigncount: { $size: "$salesmanshops" },
        tempcount: { $size: "$salesmanshopsdata" },
        count: { $add: [{ $size: "$salesmanshops" }, { $size: "$salesmanshopsdata" }] },
        _id: 1,
      },
    },
  ]);
  return data;
};

// getAllSalesmanShops
const getAllSalesmanShops = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: 'b2busersData._id',
        pipeline: [
          {
            $match: {
              $and: [{ status: { $eq: 'Assign' } }],
            },
          },
        ],
        foreignField: 'salesManId',
        as: 'salesmanshopsData',
      },
    },
    // {
    //   $unwind: '$salesmanshopsData',
    // },
    // {
    //   $lookup: {
    //     from: 'b2bshopclones',
    //     localField: 'salesmanshopsData.shopId',
    //     foreignField: '_id',
    //     as: 'b2bshopclonesData',
    //   },
    // },
    // {
    //   $unwind: '$b2bshopclonesData',
    // },

    {
      $project: {
        salesmanName: '$b2busersData.name',
        salemanId: '$b2busersData._id',
        // shopsId:'$b2bshopclonesData._id',
        // SName:'$b2bshopclonesData.SName',
        shopCount: { $size: '$salesmanshopsData' },
        _id: 1,
      },
    },
  ]);
  return data;
};

const get_user_menu = async (userRole) => {
  let menus = await Menues.aggregate([
    {
      $match: { parentMenu: "0" }
    },
    {
      $lookup: {
        from: 'menueassigns',
        localField: '_id',
        foreignField: 'menuid',
        pipeline: [
          {
            $match: {
              rolesId: { $eq: userRole }
            }
          },
          {
            $lookup: {
              from: 'menues',
              localField: 'menuid',
              foreignField: 'parentMenu',
              pipeline: [
                {
                  $lookup: {
                    from: 'menueassigns',
                    localField: '_id',
                    foreignField: 'menuid',
                    pipeline: [
                      {
                        $match: {
                          rolesId: { $eq: userRole }
                        }
                      },
                    ],
                    as: "menueassigns"
                  }

                },
                {
                  $unwind: '$menueassigns',
                },
                {
                  $project: {
                    menuName: 1,
                    _id: 1,
                    route: 1,
                    parentMenu: 1,
                    parentName: 1,
                    read: "$menueassigns.read",
                    write: "$menueassigns.write",
                    update: "$menueassigns.update",
                    delete: "$menueassigns.delete",
                    point: "$menueassigns.point",
                  }
                },
                {
                  $sort: {
                    point: 1
                  }
                }

              ],
              as: 'menues',
            },
          },

        ],
        as: 'menueassigns',
      },
    },
    {
      $unwind: '$menueassigns',
    },
    {
      $project: {
        menuName: 1,
        _id: 1,
        route: 1,
        parentMenu: 1,
        parentName: 1,
        read: "$menueassigns.read",
        write: "$menueassigns.write",
        update: "$menueassigns.update",
        delete: "$menueassigns.delete",
        point: "$menueassigns.point",
        child: "$menueassigns.menues",
        createdDate: 1
      }
    },
    {
      $sort: {
        createdDate: 1,
        point: 1,
      }
    }
  ])
  return menus;
}
module.exports = {
  createRoles,
  getAllRoles,
  getRolesById,
  mainWarehouseRoles,
  updateRolesById,
  deleterolesById,
  getroleWardAdmin,
  getroleWardAdminAsm,
  getAlldataSalesManager,
  getAlldataSalesMan,
  getsalesman,
  getAllSalesmanShops,
  notAssignTonneValueSalesmanager,
  getMenu,
  get_user_menu,
  getsalesmanOrder,
  gettelecaller,
};
