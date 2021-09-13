const Service = require('egg').Service
const crypto = require('crypto')
const {RES_MAP, mapToResp} = require('../respcode');
const {ASSETS_TYPE,CFG_LEVEL,SKILL_TYPE,CFG_SKILL} = require('../config/const')
const _ = require('lodash');
const Decimal = require("decimal.js");

class StaffService extends Service {

    async getStaffList(){
        const {ctx} = this;
        let list = await ctx.model.Staff.findAll();
        return mapToResp(RES_MAP.SUCCESS, list);
    }

    async createStaff(){

        await this.ctx.model.Staff.create({
            user_id: "2",
            name: "李国泰",
            extra_name: "阿萨德",
            phone: "123456768855",
            sex: "女",
            price: 100,
        })

        new Decimal();

        await this.ctx.model.Staff.findOne({
            where:{
                name
            }
        })
    }





}

module.exports = StaffService