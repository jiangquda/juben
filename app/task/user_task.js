module.exports = app => {
    // app.bull.get('UserQueue').add({ action: 'update_online_reward',uid:11 });
    app.bull.get('UserQueue').process(function(job,done) {
        const ctx = app.createAnonymousContext();
    //   assert(job.data.message === 'hi bull');
        if(job.data.action == "update_online_reward"){
            ctx.service.wine.updateOnlineReward(job.data.uid)
        }else if(job.data.action == "update_login"){
            ctx.service.user.updateOnline(job.data.uid)
        }
        done();
    });
}