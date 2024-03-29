const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const jobEnquiryRoute = require('./jobEnquiry.route');
const supplierRoute = require('./supplier.route');
const requirementCollectionRoute = require('./requirementCollection.route');
const supplierAppUserRoute = require('./supplierAppUser.route');
const slotandSlotsubmitRoute = require('./slotandSlotsubmit.route');
const requirementCollectionBSRoute = require('./requirementCollectionBS.route');
const interestTableRoute = require('./interestTable.route');
const manageTelecallerRoute = require('./manageTelecaller.route');
const liveStreamRoute = require('./liveStream.route');
const paymentDataRoute = require('./paymentData.route');
const adminRegistrationRoute = require('./adminRegistration.route');
const chattingRoute = require('./chating.route');
const messageRoute = require('./message.route');
const hostregRoute = require('./hostreg.route');
const RecipientOrderRoute = require('./recipients.order.route');
const RecipientsPaymentRoute = require('./recipients.payment.route');
const BuyerSellerRoute = require('./BuyerSeller.route');
const AdminPlanRoute = require('./AdminPlan.route');
const UserPlanRoute = require('./userPlan.route');
const propertVisitRoute = require('./propertyVisit.route');
const savedSearch = require('./saved.search.route');
const AmentiesRoute = require('./amenties.route');
const RecentSearch = require('./recentSearch.route');
const properBuyerrelation = require('./propertyBuyerrelation.route');
const propertyAlert = require('./property.alert.route');
const RequestStreamRoute = require('./request.route');
const StreamPlanRoute = require('./StreamPlan.route');
const SubHostRoute = require('./SubHost.route');
const EnquieryRoute = require('./Enquiry.route');
const agoraRoute = require('./AgoraAppId.route');
const b2buser = require('./B2Busers.route');
const role = require('./role.route');
const menu = require('./menue.route');
const Demo = require('./demo.realestate.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/demo',
    route: Demo,
  },
  {
    path: '/EnquieryRoute',
    route: EnquieryRoute,
  },
  {
    path: '/requestStream',
    route: RequestStreamRoute,
  },
  {
    path: '/subHost',
    route: SubHostRoute,
  },
  {
    path: '/agora',
    route: agoraRoute,
  },
  {
    path: '/b2bUsers',
    route: b2buser,
  },
  {
    path: '/role',
    route: role,
  },
  {
    path: '/menu',
    route: menu,
  },
  {
    path: '/propertyAlert',
    route: propertyAlert,
  },
  {
    path: '/StreamPlan',
    route: StreamPlanRoute,
  },
  {
    path: '/BuyerSeller',
    route: BuyerSellerRoute,
  },
  {
    path: '/properBuyerrelation',
    route: properBuyerrelation,
  },
  {
    path: '/amenties',
    route: AmentiesRoute,
  },
  {
    path: '/search',
    route: savedSearch,
  },
  {
    path: '/RecentSearch',
    route: RecentSearch,
  },
  {
    path: '/userPlan',
    route: UserPlanRoute,
  },
  {
    path: '/AdminPlan',
    route: AdminPlanRoute,
  },
  {
    path: '/propertyVisit',
    route: propertVisitRoute,
  },
  {
    path: '/message',
    route: messageRoute,
  },
  {
    path: '/RecipientOrder',
    route: RecipientOrderRoute,
  },
  {
    path: '/RecipientPayment',
    route: RecipientsPaymentRoute,
  },
  {
    path: '/chating',
    route: chattingRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/jobenquiry',
    route: jobEnquiryRoute,
  },
  {
    path: '/supplier',
    route: supplierRoute,
  },
  {
    path: '/requirementCollection',
    route: requirementCollectionRoute,
  },
  {
    path: '/supplierAppUser',
    route: supplierAppUserRoute,
  },
  {
    path: '/slotandSlotsubmit',
    route: slotandSlotsubmitRoute,
  },
  {
    path: '/requirementCollectionBS',
    route: requirementCollectionBSRoute,
  },
  {
    path: '/interestTable',
    route: interestTableRoute,
  },
  {
    path: '/manageTelecaller',
    route: manageTelecallerRoute,
  },
  {
    path: '/liveStream',
    route: liveStreamRoute,
  },
  {
    path: '/paymentData',
    route: paymentDataRoute,
  },
  {
    path: '/adminRegistration',
    route: adminRegistrationRoute,
  },
  {
    path: '/hostreg',
    route: hostregRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
