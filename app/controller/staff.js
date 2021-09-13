const Controller = require('egg').Controller
const _ = require('lodash');
const { RES_MAP, mapToResp } = require('../respcode');
const crypto = require('crypto')
const USERNAME_REG = /^[a-zA-Z0-9]{4,16}$/;

class StaffController extends Controller {

    async createStaff(){
        const {ctx} = this;
        const redisClient = ctx.app.redis.get('cache');
    }

    async getStaffList(){
        const {ctx} = this;
        
        // let staffList = await ctx.model.Staff.findAll()

        // return ctx.body = mapToResp(RES_MAP.SUCCESS, staffList);

        ctx.body = await ctx.service.staff.getStaffList();
    }


    async getStaffInfo(){

    }






}

module.exports = StaffController