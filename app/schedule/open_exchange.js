'use strict';

const Subscription = require('egg').Subscription;

/**
 * 开启游商--暂时废弃
 */

class OpneExchangeSubscription extends Subscription {
    static get schedule() {
        return {
            type: 'worker',
            cron: '0 0 * * * * ',
            // disable: true
            // disable: process.env.EGG_SCHEDULE === 'true'
        };
    }

    async subscribe() {
        const { ctx } = this;
        let key = `STRING:EXCHANGE`
        // const redisClient = ctx.app.redis.get('cache');
        // await redisClient.set(key,1)
        ctx.logger.info('开启交易');
    }
}

module.exports = OpneExchangeSubscription;
