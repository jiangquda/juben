'use strict';

const Subscription = require('egg').Subscription;

/**
 * 开启游商--暂时废弃
 */

class CloseExchangeSubscription extends Subscription {
    static get schedule() {
        return {
            type: 'worker',
            cron: '0 30 * * * * ',
            // disable: true
            // disable: process.env.EGG_SCHEDULE === 'true'
        };
    }

    async subscribe() {
        const { ctx } = this;
        let key = `STRING:EXCHANGE`
        // const redisClient = ctx.app.redis.get('cache');
        // await redisClient.set(key,0)
        console.info('关闭交易')
        ctx.logger.info('关闭交易');
    }
}

module.exports = CloseExchangeSubscription;
