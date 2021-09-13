'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();
  // router.post('/api/addCoin',auth, controller.home.addTestCoin);
  // router.post('/api/addWine',auth,controller.home.addTestWine)
  // router.post('/api/addTestMaterial',auth,controller.home.addTestMaterail)

  // router.get('/api/getBundleInfos', controller.home.getBundleInfo)
  // router.post('/getApkUrl', controller.home.getApkUrl)
  // router.post('/updateRedisDow',controller.home.updateRedisDow);
  // router.get('/home', controller.home.index);
  // router.get('/updateDb',controller.home.updateDb)
  // router.get('/home/updateConfig', controller.home.updateConfig)

  // router.post('/api/login', controller.user.login);
  // router.put('/api/logout',controller.user.logout)
  // router.post('/api/getOfflineReward',auth, controller.user.getOfflineReward)
  // router.get('/api/showOfflineReward',auth, controller.user.showOfflineReward)
  // router.post('/api/getOnlineReward', auth, controller.user.getOnlineReward)
  // router.get('/api/getUserItem',auth, controller.user.getUserItem)
  // router.post('/api/sellBagWine', auth, controller.user.sellBagWine)


  router.post('/api/login', controller.user.login);
  router.post('/api/getUser', auth, controller.user.getUserItem);

  router.post('/api/getUserInfo', auth, controller.user.getUserItemInfo);
  router.post('/api/getUserExtraInfo', auth, controller.user.getUserExtraInfo);
  router.post('/api/updateUserExtra', auth, controller.user.updateUserExtra);


  router.post('/api/createStaff', auth, controller.staff.createStaff);
  router.post('/api/getStaffList', auth, controller.staff.getStaffList);



  router.post('/api/fileUpload', controller.file.saveAvatar);


  router.post('/api/getPlayStores', controller.playStore.plsyStoreInfos);
  router.post('/api/addPlayStore', controller.playStore.addPlayStoreInfo);
  router.post('/api/delPlayStoreInfo', controller.playStore.delPlayStoreInfo);
  router.post('/api/updatePlayStore', controller.playStore.updatePlayStore);

  

};
