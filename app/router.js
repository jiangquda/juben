'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();
 
  router.post('/api/login', controller.user.login);
  //router.post('/api/getUser', auth, controller.user.getUserItem);
  //用户信息接口
  //router.post('/api/getUserInfo', auth, controller.user.getUserItemInfo);
  router.post('/api/getUserExtraInfo', auth, controller.user.getUserExtraInfo);
  router.post('/api/updateUserExtra', auth, controller.user.updateUserExtra);
  router.post('/api/createStaff', auth, controller.staff.createStaff);
  router.post('/api/getStaffList', auth, controller.staff.getStaffList);

  //图片上传
  router.post('/api/fileUpload', controller.file.saveAvatar);

  //剧本店接口
  router.post('/api/getPlayStores', controller.playStore.plsyStoreInfos);
  router.post('/api/addPlayStore', controller.playStore.addPlayStoreInfo);
  router.post('/api/delPlayStoreInfo', controller.playStore.delPlayStoreInfo);
  router.post('/api/updatePlayStore', controller.playStore.updatePlayStore);

  //订单接口
  router.post('/api/order/createOrder', auth,controller.order.createOrder);
  router.post('/api/order/cancelOrder', controller.order.cancelOrder);
  router.post('/api/order/confirmOrder', controller.order.confirmOrder);
  

};
