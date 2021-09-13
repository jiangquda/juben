module.exports = app => {
    // app.bull.get('LogQueue').add({ action: 'item',log:{uid:1,item_id:1,count:1,from:1,group_id:1} });
    app.bull.get('LogQueue').process(function(job,done) {
    const ctx = app.createAnonymousContext();
    //   assert(job.data.message === 'hi bull');
    console.info(job.data)
        if(job.data.action == "item"){
            let now = new Date()
            ctx.model.UserItemLog.create({
                user_id: job.data.log.uid,
                item_id:job.data.log.item_id,
                group_id:job.data.log.group_id,
                count:job.data.log.count,
                from:job.data.log.from,
                created_at: now,
                updated_at: now
            })
        }else if(job.data.action == "asset"){
            let now = new Date()
            ctx.model.AssetLog.create({
                user_id:job.data.log.uid,
                amount: job.data.log.count,
                prev_amount:job.data.log.prev_amount,
                channel:job.data.log.channel,
                type:job.data.log.type,
                created_at: now,
                updated_at: now
            })
        }
        done();
    });
}