const ORDER_STATE = {
    ALL:0,
    NO_ORDER_RECEIVE : 1,       //未接单
    ORDER_RECEIVE : 2,          //已接单
    ORDER_DO : 3,               //进行中
    ORDER_END : 4,              //已完成   
    CANCEL : 5,                 //已取消
}

const ORDER_MEN_STATE = {
    NO_SHOW_UP_CONFIRM : 0,
    SHOW_UP_CONFIRM : 1,
    END_CONFIRM : 2,
}

module.exports = {
    ORDER_STATE,
    ORDER_MEN_STATE,
}
